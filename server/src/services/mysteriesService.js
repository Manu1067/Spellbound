import { getDatabase } from '../db/connection.js';

export const getPuzzles = () => {
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT 
      id,
      title,
      question,
      options,
      difficulty,
      chamber,
      created_at as createdAt
    FROM mystery_puzzles
    ORDER BY id ASC
  `).all();

  return rows.map((r) => ({
    ...r,
    options: JSON.parse(r.options || '[]')
  }));
};

export const verifyPuzzleAnswer = ({ puzzleId, selectedIndex, studentId = 'student-aris-thorne' }) => {
  const db = getDatabase();

  const puzzle = db.prepare(`
    SELECT 
      id,
      title,
      correct_index as correctIndex,
      explanation
    FROM mystery_puzzles
    WHERE id = ?
  `).get(puzzleId);

  if (!puzzle) {
    throw new Error('Mystery puzzle not found');
  }

  const isCorrect = puzzle.correctIndex === parseInt(selectedIndex, 10);

  // Check if previously correctly solved
  const previousSuccess = db.prepare(`
    SELECT id FROM mystery_records
    WHERE puzzle_id = ? AND student_id = ? AND is_correct = 1
  `).get(puzzleId, studentId);

  // Record student attempt
  db.prepare(`
    INSERT INTO mystery_records (puzzle_id, student_id, selected_index, is_correct)
    VALUES (?, ?, ?, ?)
  `).run(puzzleId, studentId, selectedIndex, isCorrect ? 1 : 0);

  let pointsAwarded = 0;
  if (isCorrect && !previousSuccess) {
    pointsAwarded = 25;
    try {
      const student = db.prepare('SELECT house_id FROM students WHERE id = ?').get(studentId);
      if (student) {
        db.prepare('UPDATE houses SET points = points + ? WHERE id = ?').run(pointsAwarded, student.house_id);
        db.prepare('UPDATE students SET points_contributed = points_contributed + ? WHERE id = ?').run(pointsAwarded, studentId);
        db.prepare(`
          INSERT INTO house_points_log (house_id, amount, reason, awarded_by)
          VALUES (?, ?, ?, 'The Department of Mysteries Council')
        `).run(student.house_id, pointsAwarded, `Deciphered ${puzzle.title}`);
      }
    } catch (_) {}
  }

  return {
    puzzleId,
    isCorrect,
    explanation: puzzle.explanation,
    pointsAwarded
  };
};

export const getMysteryArchives = ({
  chamber,
  difficulty,
  search,
  subject,
  topic,
  resourceType,
  rarity
} = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      r.id,
      r.course_code as courseCode,
      c.title as courseTitle,
      r.title,
      r.resource_type as resourceType,
      r.author,
      r.rarity,
      r.content_snippet as contentSnippet,
      r.content_snippet as abstract,
      r.subject,
      r.topic,
      r.difficulty,
      r.study_notes as studyNotes,
      r.chamber,
      r.citation,
      r.is_approved as isApproved,
      r.created_at as createdAt
    FROM learning_resources r
    LEFT JOIN courses c ON r.course_code = c.code
    WHERE 1=1
  `;

  const params = [];

  if (chamber && chamber !== 'All Chambers') {
    query += ` AND LOWER(r.chamber) = LOWER(?)`;
    params.push(chamber);
  }

  if (difficulty && difficulty !== 'All Difficulties') {
    query += ` AND LOWER(r.difficulty) = LOWER(?)`;
    params.push(difficulty);
  }

  if (subject && subject !== 'All Subjects') {
    query += ` AND LOWER(r.subject) = LOWER(?)`;
    params.push(subject);
  }

  if (topic && topic !== 'All Topics') {
    query += ` AND LOWER(r.topic) = LOWER(?)`;
    params.push(topic);
  }

  if (resourceType && resourceType !== 'All Types') {
    query += ` AND LOWER(r.resource_type) = LOWER(?)`;
    params.push(resourceType);
  }

  if (rarity && rarity !== 'All Rarities') {
    query += ` AND LOWER(r.rarity) = LOWER(?)`;
    params.push(rarity);
  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    query += ` AND (
      LOWER(r.title) LIKE ? OR
      LOWER(r.author) LIKE ? OR
      LOWER(r.content_snippet) LIKE ? OR
      LOWER(r.study_notes) LIKE ? OR
      LOWER(r.subject) LIKE ? OR
      LOWER(r.topic) LIKE ? OR
      LOWER(r.citation) LIKE ? OR
      LOWER(c.title) LIKE ?
    )`;
    params.push(q, q, q, q, q, q, q, q);
  }

  query += ` ORDER BY r.id ASC`;

  const rows = db.prepare(query).all(...params);

  // Map backwards-compatible fields
  return rows.map((item) => {
    let restrictionLevel = 'Open Archive';
    if (item.rarity === 'Restricted') restrictionLevel = 'Black Ribbon Vault';
    else if (item.rarity === 'Rare') restrictionLevel = 'Curator Clearance Only';

    const glyphPrefix = item.chamber === 'Chronomancy Vault' ? 'Ψ-Chronos'
      : item.chamber === 'Acoustic Sanctum' ? 'Ω-Sonus'
      : item.chamber === 'Stellar Observatory' ? 'Δ-Astra'
      : 'Σ-Arcane';

    return {
      ...item,
      restrictionLevel,
      glyphSignature: `${glyphPrefix}-${item.id.replace('res-', '')}`
    };
  });
};

export const getResourceById = (id) => {
  const db = getDatabase();

  const query = `
    SELECT 
      r.id,
      r.course_code as courseCode,
      c.title as courseTitle,
      c.instructor as courseInstructor,
      r.title,
      r.resource_type as resourceType,
      r.author,
      r.rarity,
      r.content_snippet as contentSnippet,
      r.content_snippet as abstract,
      r.subject,
      r.topic,
      r.difficulty,
      r.study_notes as studyNotes,
      r.chamber,
      r.citation,
      r.is_approved as isApproved,
      r.created_at as createdAt
    FROM learning_resources r
    LEFT JOIN courses c ON r.course_code = c.code
    WHERE r.id = ?
  `;

  const item = db.prepare(query).get(id);
  if (!item) return null;

  let restrictionLevel = 'Open Archive';
  if (item.rarity === 'Restricted') restrictionLevel = 'Black Ribbon Vault';
  else if (item.rarity === 'Rare') restrictionLevel = 'Curator Clearance Only';

  return {
    ...item,
    restrictionLevel,
    glyphSignature: `Ψ-Arcane-${item.id.replace('res-', '')}`
  };
};

export const getArchiveFilters = () => {
  const db = getDatabase();

  const subjects = db.prepare(`SELECT DISTINCT subject FROM learning_resources WHERE subject IS NOT NULL ORDER BY subject ASC`).all().map(r => r.subject);
  const topics = db.prepare(`SELECT DISTINCT topic FROM learning_resources WHERE topic IS NOT NULL ORDER BY topic ASC`).all().map(r => r.topic);
  const difficulties = ['Apprentice', 'Adept', 'Arch-Mage'];
  const resourceTypes = db.prepare(`SELECT DISTINCT resource_type FROM learning_resources WHERE resource_type IS NOT NULL ORDER BY resource_type ASC`).all().map(r => r.resource_type);
  const chambers = db.prepare(`SELECT DISTINCT chamber FROM learning_resources WHERE chamber IS NOT NULL ORDER BY chamber ASC`).all().map(r => r.chamber);

  return {
    subjects: ['All Subjects', ...subjects],
    topics: ['All Topics', ...topics],
    difficulties: ['All Difficulties', ...difficulties],
    resourceTypes: ['All Types', ...resourceTypes],
    chambers: ['All Chambers', ...chambers]
  };
};

export const getRecommendations = (studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  const student = db.prepare(`
    SELECT id, name, house_id as houseId, fav_subject as favSubject, skills, interests
    FROM students
    WHERE id = ?
  `).get(studentId) || { favSubject: 'Ancient Runes', skills: '[]', interests: '[]' };

  const parsedSkills = JSON.parse(student.skills || '[]');
  const parsedInterests = JSON.parse(student.interests || '[]');

  // Check student academic history
  let progressRows = [];
  try {
    progressRows = db.prepare(`
      SELECT course_code as courseCode, score, completed_at as completedAt
      FROM student_quizzes
      WHERE student_id = ?
      ORDER BY id DESC LIMIT 5
    `).all(studentId);
  } catch (_) {
    progressRows = [];
  }

  // Check solved mystery puzzles
  const solvedPuzzles = db.prepare(`
    SELECT puzzle_id
    FROM mystery_records
    WHERE student_id = ? AND is_correct = 1
  `).all(studentId).map(r => r.puzzle_id);

  // Rule 1: Recommend courses & resources aligning with favSubject and interests
  const matchingResources = db.prepare(`
    SELECT 
      r.id,
      r.title,
      r.resource_type as resourceType,
      r.subject,
      r.topic,
      r.difficulty,
      r.citation,
      c.code as courseCode
    FROM learning_resources r
    LEFT JOIN courses c ON r.course_code = c.code
    WHERE LOWER(r.subject) LIKE LOWER(?) OR LOWER(r.topic) LIKE LOWER(?)
    LIMIT 3
  `).all(`%${student.favSubject}%`, `%${parsedInterests[0] || 'Runes'}%`);

  const recommendedResources = matchingResources.length > 0
    ? matchingResources.map(r => ({
        id: r.id,
        title: r.title,
        type: r.resourceType,
        reason: `Synergizes with your focus in ${r.subject} (${r.topic})`,
        category: 'Curriculum & Research',
        courseCode: r.courseCode,
        citation: r.citation
      }))
    : [
        {
          id: 'res-2',
          title: 'Eldorian Glyphs & Astronomical Stelae',
          type: 'Parchment Scroll',
          reason: `Matches your primary focus in ${student.favSubject}`,
          category: 'Curriculum',
          courseCode: 'RUNE-404',
          citation: 'Department of Mysteries Inscription Archives, Stela VII'
        },
        {
          id: 'res-1',
          title: 'Codex of Living Metamorphosis',
          type: 'Grimoire',
          reason: 'Synergizes with your research in ward logic',
          category: 'Advanced Reading',
          courseCode: 'TRANS-501',
          citation: 'Grand Library, Restricted Alcove IV, Folio 112'
        }
      ];

  // Rule 2: Recommend communities aligning with interests
  const matchingCommunities = db.prepare(`
    SELECT id, name, category, description
    FROM communities
    WHERE is_joined = 0
    ORDER BY member_count DESC
    LIMIT 2
  `).all();

  const recommendedCommunities = matchingCommunities.length > 0
    ? matchingCommunities.map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        reason: `Recommended based on your interest in ${parsedInterests[0] || 'Arcane Research'}`
      }))
    : [
        {
          name: 'The Arithmancy & Runic Circle',
          reason: `Recommended based on your interest in ${parsedInterests[0] || 'Astrolabe Calibration'}`,
          category: 'Study Circle'
        },
        {
          name: 'Order of the Golden Quill',
          reason: 'High activity amongst fellow senior research adepts',
          category: 'Guild'
        }
      ];

  // Rule 3: Recommend next unsolved mystery enigma
  const nextEnigma = db.prepare(`
    SELECT id, title, chamber, difficulty
    FROM mystery_puzzles
    WHERE id NOT IN (${solvedPuzzles.length > 0 ? solvedPuzzles.map(() => '?').join(',') : "''"})
    ORDER BY id ASC
    LIMIT 1
  `).get(...solvedPuzzles) || db.prepare(`SELECT id, title, chamber, difficulty FROM mystery_puzzles LIMIT 1`).get();

  const recommendedEnigma = nextEnigma ? {
    id: nextEnigma.id,
    title: nextEnigma.title,
    chamber: nextEnigma.chamber,
    difficulty: nextEnigma.difficulty,
    reason: `Next challenge in the ${nextEnigma.chamber} matched to your adept level`
  } : {
    title: 'The Enigma of the Three Celestial Spheres',
    chamber: 'Chronomancy Vault',
    difficulty: 'Adept',
    reason: 'Aligns with your celestial geometry background'
  };

  return {
    engine: 'Rule-Based Arcane Knowledge Engine',
    isDeterministic: true,
    studentId,
    favSubject: student.favSubject,
    skills: parsedSkills,
    interests: parsedInterests,
    recommendedResources,
    recommendedCommunities,
    recommendedEnigma,
    recentProgressSummary: progressRows.length > 0
      ? `Completed ${progressRows.length} recent academic milestones (latest: ${progressRows[0].courseCode || 'Curriculum'} examination)`
      : 'Ready to commence your semester reading and laboratory milestones.',
    advisoryNote: 'Curated deterministically from your Adept Dossier, course syllabus, and laboratory progress records.'
  };
};

export const queryArchivalScribe = (prompt = '') => {
  const cleanPrompt = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  const db = getDatabase();

  // 1. Direct domain match: Moonstone & Potions
  if (cleanPrompt.includes('moonstone')) {
    return {
      status: 'Verified Lore',
      title: 'Properties of Crushed Moonstone in Alchemy',
      answer: 'Crushed Moonstone exhibits high stabilizing qualities (+6 stability) and steady illumination potency (+5). Adding Crushed Moonstone before volatile dragon fire reagents buffers crucible expansion and prevents cauldron rupture.',
      source: 'Grimoire of Subterranean Reagents, Folio 42',
      courseCode: 'ALCH-520',
      resourceId: 'res-3',
      chamber: 'Subterranean Vaults',
      mode: 'Archival Scribe v2.0 (Grounded Local Intelligence)',
      isGrounded: true,
      confidence: 0.98,
      extensibilityNotice: 'Compliant Local Grounded Architecture: standard request/response interface ready for approved AI models.'
    };
  }

  // 2. Direct domain match: Chronomancy Vault & Hourglasses
  if (cleanPrompt.includes('chronos') || (cleanPrompt.includes('hourglass') && cleanPrompt.includes('vault'))) {
    return {
      status: 'Verified Lore',
      title: 'Wards of the Chronomancy Vault',
      answer: 'The Chronomancy Vault is anchored by three concentric ward rings. To traverse without tripping the temporal stasis trap, one must align the Obsidian Hourglass with the Saturnian eclipse.',
      source: 'Department of Mysteries Vault Protocols, Section VII',
      courseCode: 'RUNE-404',
      resourceId: 'res-4',
      chamber: 'Chronomancy Vault',
      mode: 'Archival Scribe v2.0 (Grounded Local Intelligence)',
      isGrounded: true,
      confidence: 0.98,
      extensibilityNotice: 'Compliant Local Grounded Architecture: standard request/response interface ready for approved AI models.'
    };
  }

  // 3. Direct domain match: Skyspire Broomstick Rules
  if (cleanPrompt.includes('skyspire') || cleanPrompt.includes('snitch') || (cleanPrompt.includes('broom') && cleanPrompt.includes('rule'))) {
    return {
      status: 'Verified Lore',
      title: 'Skyspire League Regulations & Scoring Codex',
      answer: 'A match concludes when the Golden Snitch is secured (awarding 150 points to the capturing team). Each quaffle goal through the elevated astral rings awards 10 points. Slalom interference incurs a 2-minute penalty hover.',
      source: 'Official Aero-Broom Tournament Codex, 1920 Edition',
      courseCode: 'AERO-201',
      resourceId: 'res-8',
      chamber: 'Grand Scriptoria',
      mode: 'Archival Scribe v2.0 (Grounded Local Intelligence)',
      isGrounded: true,
      confidence: 0.95,
      extensibilityNotice: 'Compliant Local Grounded Architecture: standard request/response interface ready for approved AI models.'
    };
  }

  // 4. Grounded search in learning_resources table
  const allResources = db.prepare(`
    SELECT 
      r.id,
      r.course_code as courseCode,
      c.title as courseTitle,
      r.title,
      r.resource_type as resourceType,
      r.author,
      r.content_snippet as contentSnippet,
      r.study_notes as studyNotes,
      r.subject,
      r.topic,
      r.chamber,
      r.citation
    FROM learning_resources r
    LEFT JOIN courses c ON r.course_code = c.code
  `).all();

  const stopWords = new Set(['what', 'are', 'the', 'how', 'does', 'why', 'who', 'and', 'for', 'with', 'from', 'this', 'that', 'can', 'you', 'tell', 'about', 'is', 'in', 'of']);
  const searchTerms = cleanPrompt.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

  let bestResource = null;
  let highestScore = 0;

  for (const res of allResources) {
    let score = 0;
    const fullText = `${res.title} ${res.subject} ${res.topic} ${res.contentSnippet} ${res.studyNotes} ${res.citation}`.toLowerCase();

    for (const term of searchTerms) {
      if (res.title.toLowerCase().includes(term)) score += 5;
      if (res.topic && res.topic.toLowerCase().includes(term)) score += 4;
      if (res.subject && res.subject.toLowerCase().includes(term)) score += 3;
      if (fullText.includes(term)) score += 1;
    }

    if (score > highestScore) {
      highestScore = score;
      bestResource = res;
    }
  }

  if (bestResource && highestScore >= 2) {
    return {
      status: 'Verified Lore',
      title: bestResource.title,
      answer: bestResource.studyNotes || bestResource.contentSnippet,
      source: bestResource.citation || `Grand Library Archives, ${bestResource.courseCode}`,
      courseCode: bestResource.courseCode,
      courseTitle: bestResource.courseTitle,
      resourceId: bestResource.id,
      chamber: bestResource.chamber,
      mode: 'Archival Scribe v2.0 (Grounded Local Intelligence)',
      isGrounded: true,
      confidence: 0.94,
      extensibilityNotice: 'Compliant Local Grounded Architecture: standard request/response interface ready for approved AI models.'
    };
  }

  // 5. Fallback domain: Potion Ingredients
  if (cleanPrompt.includes('potion') || cleanPrompt.includes('ingredient') || cleanPrompt.includes('cauldron') || cleanPrompt.includes('ember') || cleanPrompt.includes('dragon')) {
    const ingredients = db.prepare(`SELECT name, potency, stability, description FROM potion_ingredients`).all();
    const matchedIng = ingredients.find(i => cleanPrompt.includes(i.name.toLowerCase()) || cleanPrompt.includes(i.name.toLowerCase().split(' ')[0]));
    if (matchedIng) {
      return {
        status: 'Verified Lore',
        title: `Alchemical Properties: ${matchedIng.name}`,
        answer: `${matchedIng.description} Potency Rating: +${matchedIng.potency}, Stability Index: ${matchedIng.stability >= 0 ? '+' : ''}${matchedIng.stability}. Buffers thermal volatility in nocturnal cauldrons.`,
        source: 'Grimoire of Subterranean Reagents, Folio 42',
        courseCode: 'ALCH-520',
        resourceId: 'res-3',
        chamber: 'Subterranean Vaults',
        mode: 'Archival Scribe v2.0 (Grounded Local Intelligence)',
        isGrounded: true,
        confidence: 0.92,
        extensibilityNotice: 'Compliant Local Grounded Architecture: standard request/response interface ready for approved AI models.'
      };
    }
  }

  // 6. Out-of-Domain or Unsupported Query
  return {
    status: 'Archival Boundary Notice',
    title: 'Department of Mysteries Knowledge Boundary',
    answer: `The Archival Scribe could not verify approved Academy folios regarding "${prompt}". Academy archives are grounded in ancient runology, alchemy, celestial mechanics, defensive warding, transfiguration, and skyspire athletics.`,
    source: 'Grand Library Scriptoria Codex',
    suggestedQueries: [
      'Properties of crushed moonstone in potion brewing',
      'How do acoustic wards harmonize through basalt?',
      'Eldorian runic inscriptions and celestial stelae',
      'Alignment of the Corona Noctis constellation',
      'Rules of the Golden Snitch and Skyspire derby'
    ],
    mode: 'Archival Scribe v2.0 (Grounded Local Intelligence)',
    isGrounded: false,
    confidence: 0.20,
    extensibilityNotice: 'Compliant Local Grounded Architecture: standard request/response interface ready for approved AI models.'
  };
};
