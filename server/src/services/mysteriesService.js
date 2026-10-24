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

export const getMysteryArchives = ({ chamber, difficulty, search } = {}) => {
  const archives = [
    {
      id: 'arc-1',
      title: 'Chronomancy Fragment IX: The Divergence of Echoes',
      chamber: 'Chronomancy Vault',
      difficulty: 'Adept',
      author: 'Arch-Mage Chronis',
      abstract: 'Documentation on temporal resonance anomalies observed when multiple hourglasses are oscillated simultaneously.',
      restrictionLevel: 'Restricted Foliant',
      glyphSignature: 'Ψ-Chronos-9'
    },
    {
      id: 'arc-2',
      title: 'Acoustic Wards and Basalt Harmonization',
      chamber: 'Acoustic Sanctum',
      difficulty: 'Arch-Mage',
      author: 'Mistress Sonya Gale',
      abstract: 'Calculations for damping ultrasonic reverberations without disturbing sleeping spectral guardians.',
      restrictionLevel: 'Curator Clearance Only',
      glyphSignature: 'Ω-Sonus-3'
    },
    {
      id: 'arc-3',
      title: 'Astrolabe Alignments of the Northern Crown',
      chamber: 'Stellar Observatory',
      difficulty: 'Apprentice',
      author: 'Master Elowen Frost',
      abstract: 'Beginner manual for setting latitude rings during retrograde motion of celestial constellations.',
      restrictionLevel: 'Open Archive',
      glyphSignature: 'Δ-Astra-1'
    },
    {
      id: 'arc-4',
      title: 'The Solstice Serpent: Runes of Memory Inversion',
      chamber: 'Subterranean Vaults',
      difficulty: 'Arch-Mage',
      author: 'Unknown Elder Adept',
      abstract: 'Tapestry translation detailing the preservation of lost thoughts inside crystallized moonstone.',
      restrictionLevel: 'Black Ribbon Vault',
      glyphSignature: 'Σ-Noct-7'
    }
  ];

  return archives.filter((item) => {
    if (chamber && chamber !== 'All Chambers' && item.chamber !== chamber) return false;
    if (difficulty && difficulty !== 'All Difficulties' && item.difficulty !== difficulty) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.abstract.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
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

  // Rule 1: Recommend courses & resources aligning with favSubject
  const recommendedResources = [
    {
      title: 'Eldorian Glyphs & Astronomical Stelae',
      type: 'Scroll',
      reason: `Matches your primary focus in ${student.favSubject}`,
      category: 'Curriculum'
    },
    {
      title: 'Codex of Living Metamorphosis',
      type: 'Grimoire',
      reason: 'Synergizes with your research in ward logic',
      category: 'Advanced Reading'
    }
  ];

  // Rule 2: Recommend communities aligning with interests
  const recommendedCommunities = [
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

  // Rule 3: Recommend mystery enigma based on unsolved status
  const recommendedEnigma = {
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
    recommendedResources,
    recommendedCommunities,
    recommendedEnigma,
    advisoryNote: 'Curated deterministically from your Adept Dossier and active semester course syllabus.'
  };
};

export const queryArchivalScribe = (prompt = '') => {
  const cleanPrompt = prompt.toLowerCase();

  const knowledgeBase = [
    {
      keywords: ['moonstone', 'crushed moonstone', 'potions'],
      title: 'Properties of Crushed Moonstone in Alchemy',
      answer: 'Crushed Moonstone exhibits high stabilizing qualities (+6 stability) and steady illumination potency (+5). It is optimal for mitigating volatile dragon fire reagents when brewing night-vision philtres.',
      source: 'Grimoire of Subterranean Reagents, Folio 42'
    },
    {
      keywords: ['chronos', 'hourglass', 'vault', 'enigma'],
      title: 'Wards of the Chronomancy Vault',
      answer: 'The Chronomancy Vault is anchored by three concentric ward rings. To traverse without tripping the temporal stasis trap, one must align the Obsidian Hourglass with the Saturnian eclipse.',
      source: 'Department of Mysteries Vault Protocols, Section VII'
    },
    {
      keywords: ['skyspire', 'broom', 'quidditch', 'snitch', 'rules'],
      title: 'Skyspire League Rules & Snitch Capture',
      answer: 'A match concludes when the Golden Snitch is secured (awarding 150 points to the capturing team). Each quaffle goal through the elevated astral rings awards 10 points. Slalom interference incurs a 2-minute penalty hover.',
      source: 'Official Aero-Broom Tournament Codex, 1920 Edition'
    },
    {
      keywords: ['runes', 'eldorian', 'stela', 'stelae'],
      title: 'Eldorian Runic Inscription Methods',
      answer: 'Eldorian glyphs require tempered electrum styluses to avoid electromagnetic feedback during solstice conjunctions. Tri-corner glyphs consistently symbolize northern navigational vectors.',
      source: 'Compendium of Lost Astral Tongues by Arch-Magister Valerius'
    }
  ];

  const match = knowledgeBase.find((item) =>
    item.keywords.some((kw) => cleanPrompt.includes(kw))
  );

  if (match) {
    return {
      status: 'Verified Lore',
      title: match.title,
      answer: match.answer,
      source: match.source,
      mode: 'Archival Scribe v1.0 (Deterministic Lore Archive)',
      extensibilityNotice: 'Designed with clean request/response interfaces for future approved AI assistant sidecars.'
    };
  }

  return {
    status: 'Archival Synthesis',
    title: 'Academy Inscription Archive',
    answer: `The Archival Scribe has examined the scrolls regarding "${prompt}". Consult the Eldorian Astrolabe in the Grand Library or speak with Arch-Magister Valerius in East Scriptoria for deeper uncataloged folios.`,
    source: 'General Castle Cartography & Dossier Records',
    mode: 'Archival Scribe v1.0 (Deterministic Lore Archive)',
    extensibilityNotice: 'Designed with clean request/response interfaces for future approved AI assistant sidecars.'
  };
};
