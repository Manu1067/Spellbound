import { getDatabase } from '../db/connection.js';

export const getAllCourses = ({ term } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      c.code,
      c.title,
      c.instructor,
      c.term,
      c.credits,
      c.description,
      c.location_id as locationId,
      l.name as locationName,
      c.created_at as createdAt
    FROM courses c
    LEFT JOIN locations l ON c.location_id = l.id
    WHERE 1=1
  `;

  const params = [];

  if (term) {
    query += ` AND c.term = ?`;
    params.push(term);
  }

  query += ` ORDER BY c.code ASC`;

  const rows = db.prepare(query).all(...params);
  return rows;
};

export const getCourseByCode = (code) => {
  const db = getDatabase();

  const query = `
    SELECT 
      c.code,
      c.title,
      c.instructor,
      c.term,
      c.credits,
      c.description,
      c.location_id as locationId,
      l.name as locationName,
      c.created_at as createdAt
    FROM courses c
    LEFT JOIN locations l ON c.location_id = l.id
    WHERE c.code = ?
  `;

  const course = db.prepare(query).get(code);
  if (!course) return null;

  const resources = db.prepare(`
    SELECT 
      id,
      title,
      resource_type as resourceType,
      author,
      rarity,
      content_snippet as contentSnippet,
      created_at as createdAt
    FROM learning_resources
    WHERE course_code = ?
    ORDER BY title ASC
  `).all(code);

  return {
    ...course,
    resources
  };
};

export const getCourseResources = (courseCode) => {
  const db = getDatabase();
  return db.prepare(`
    SELECT 
      id,
      course_code as courseCode,
      title,
      resource_type as resourceType,
      author,
      rarity,
      content_snippet as contentSnippet,
      created_at as createdAt
    FROM learning_resources
    WHERE course_code = ?
  `).all(courseCode);
};

export const getAllResources = ({ search, rarity, type } = {}) => {
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
      r.created_at as createdAt
    FROM learning_resources r
    JOIN courses c ON r.course_code = c.code
    WHERE 1=1
  `;

  const params = [];

  if (rarity && rarity.toLowerCase() !== 'all rarities') {
    query += ` AND LOWER(r.rarity) = LOWER(?)`;
    params.push(rarity);
  }

  if (type && type.toLowerCase() !== 'all types') {
    query += ` AND LOWER(r.resource_type) = LOWER(?)`;
    params.push(type);
  }

  if (search) {
    query += ` AND (
      LOWER(r.title) LIKE LOWER(?) OR 
      LOWER(r.author) LIKE LOWER(?) OR 
      LOWER(r.content_snippet) LIKE LOWER(?) OR
      LOWER(c.title) LIKE LOWER(?)
    )`;
    const wildcard = `%${search}%`;
    params.push(wildcard, wildcard, wildcard, wildcard);
  }

  query += ` ORDER BY r.title ASC`;

  return db.prepare(query).all(...params);
};

export const getPotionIngredients = () => {
  const db = getDatabase();
  return db.prepare(`
    SELECT id, name, potency, stability, color, description
    FROM potion_ingredients
    ORDER BY name ASC
  `).all();
};

export const brewPotion = ({ studentId = 'student-aris-thorne', ingredientIds = [], heatLevel = 'Steady Flame', stirDirection = 'Clockwise' }) => {
  const db = getDatabase();

  const ingredients = db.prepare(`
    SELECT id, name, potency, stability, color
    FROM potion_ingredients
    WHERE id IN (${ingredientIds.map(() => '?').join(',')})
  `).all(...ingredientIds);

  let totalPotency = ingredients.reduce((sum, ing) => sum + ing.potency, 0);
  let totalStability = ingredients.reduce((sum, ing) => sum + ing.stability, 0);

  // Heat modifiers
  if (heatLevel === 'Low Ember') {
    totalStability += 3;
    totalPotency += 1;
  } else if (heatLevel === 'Steady Flame') {
    totalStability += 0;
    totalPotency += 3;
  } else if (heatLevel === 'Dragon Fire') {
    totalStability -= 4;
    totalPotency += 6;
  }

  // Stir modifiers
  if (stirDirection === 'Clockwise') {
    totalStability += 3;
  } else if (stirDirection === 'Counter-Clockwise') {
    totalStability -= 2;
    totalPotency += 3;
  }

  let potionName = '';
  let outcome = 'Success';
  let description = '';
  let potionColor = '#315C4A';

  if (totalStability >= 5 && totalPotency >= 16) {
    potionName = 'Elixir of Astral Clarity';
    potionColor = '#3A6BA5';
    description = 'A luminous sapphire elixir that sharpens astral perception and grants crystalline focus.';
  } else if (totalStability >= 2 && totalPotency >= 12) {
    potionName = 'Draught of Luminescence';
    potionColor = '#4E8A71';
    description = 'Phosphorescent emerald draught that glows brilliantly in the deepest subterranean gloom.';
  } else if (totalStability >= 0 && totalPotency >= 7) {
    potionName = 'Essence of Silver Dewleaf';
    potionColor = '#9BE0B5';
    description = 'A gentle silver tonic that calms erratic spell residue and soothes alchemical burns.';
  } else if (totalStability >= -2) {
    potionName = 'Volatile Alchemical Slag';
    outcome = 'Unstable';
    potionColor = '#7A5BA3';
    description = 'The mixture fizzes violently and produces dense purple smoke. Requires neutralizing salt.';
  } else {
    potionName = 'Acrid Slag of Rupture';
    outcome = 'Failed';
    potionColor = '#8A3B3B';
    description = 'The cauldron boils over with explosive sparks. Quenched safely by laboratory ward seals.';
  }

  // Save to student potion brews journal
  try {
    db.prepare(`
      INSERT INTO potion_brews (student_id, potion_name, potency, stability, outcome)
      VALUES (?, ?, ?, ?, ?)
    `).run(studentId, potionName, totalPotency, totalStability, outcome);
  } catch (_) {}

  // Award house points for successful discovery
  let housePointsAwarded = 0;
  if (outcome === 'Success') {
    housePointsAwarded = 15;
    try {
      const student = db.prepare('SELECT house_id FROM students WHERE id = ?').get(studentId);
      if (student) {
        db.prepare('UPDATE houses SET points = points + ? WHERE id = ?').run(housePointsAwarded, student.house_id);
        db.prepare(`
          INSERT INTO house_points_log (house_id, amount, reason, awarded_by)
          VALUES (?, ?, ?, ?)
        `).run(student.house_id, housePointsAwarded, `Brewed pristine ${potionName}`, 'Mistress Belladonna');
      }
    } catch (_) {}
  }

  return {
    potionName,
    outcome,
    description,
    potionColor,
    potency: totalPotency,
    stability: totalStability,
    heatLevel,
    stirDirection,
    ingredientsUsed: ingredients.map((i) => i.name),
    housePointsAwarded,
    disclaimer: 'Academy Alchemical Notice: This is a fictional wizarding simulation based on arcane lore. It does not contain or represent real-world chemical formulas.'
  };
};

export const QUIZZES_DATA = {
  'TRANS-501': {
    title: 'Advanced Inanimate Transfiguration Examination',
    subject: 'Transfiguration',
    questions: [
      {
        id: 'q1',
        prompt: 'Which harmonic vibration frequency stabilizes copper into organic crystalline matrices?',
        options: ['432 Hz Sol-Fulgur', '528 Hz Vita-Forma', '108 Hz Litho-Morte', '960 Hz Ignis-Vael'],
        correctIndex: 1,
        explanation: '528 Hz Vita-Forma aligns the crystalline lattice without fracturing the molecular bound.'
      },
      {
        id: 'q2',
        prompt: 'What happens if the inanimate animus reversal charm is performed without grounding the wand tip?',
        options: ['The metal evaporates into ether', 'The object transmutes into basalt stone', 'Static discharge inverts the caster’s wand wood', 'The transfiguration rebounds into volatile glass'],
        correctIndex: 3,
        explanation: 'Ungrounded reversal charms cause rebound crystallization, producing brittle volatile glass.'
      },
      {
        id: 'q3',
        prompt: 'According to Vance’s Third Law of Transmutation, which attribute cannot be spontaneously induced?',
        options: ['Reflective luster', 'Permanent sentient consciousness', 'Tensile elasticity', 'Thermal conductivity'],
        correctIndex: 1,
        explanation: 'True sentient consciousness cannot be fabricated through mere inanimate transmutation.'
      }
    ]
  },
  'RUNE-404': {
    title: 'Eldorian Glyphs & Astronomical Stelae Mastery',
    subject: 'Ancient Runes',
    questions: [
      {
        id: 'q1',
        prompt: 'The tri-corner glyph inscribed on the North Spire denotes which astral celestial body?',
        options: ['The Eye of Saturn', 'The Talon of the Raven', 'The Golden Chariot of Apollo', 'The Eclipse of Cassiopeia'],
        correctIndex: 1,
        explanation: 'The Talon of the Raven represents perception and navigational orientation across northern skies.'
      },
      {
        id: 'q2',
        prompt: 'Which stylus alloy prevents rune ink smudging during high electromagnetic ley line pulses?',
        options: ['Tempered Electrum', 'Cast Lead', 'Brittle Obsidian', 'Sterling Copper'],
        correctIndex: 0,
        explanation: 'Tempered Electrum dissipates electromagnetic discharges without burning the enchanted parchment.'
      }
    ]
  }
};

export const submitQuiz = ({ studentId = 'student-aris-thorne', courseCode, answers = {} }) => {
  const db = getDatabase();
  const quiz = QUIZZES_DATA[courseCode];

  if (!quiz) {
    throw new Error(`No active examination found for course code '${courseCode}'.`);
  }

  let correctCount = 0;
  const detailedResults = quiz.questions.map((q, idx) => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      id: q.id,
      prompt: q.prompt,
      selectedOption: selected !== undefined ? q.options[selected] : null,
      correctOption: q.options[q.correctIndex],
      isCorrect,
      explanation: q.explanation
    };
  });

  const total = quiz.questions.length;
  const scorePercent = Math.round((correctCount / total) * 100);
  const passed = scorePercent >= 70;

  let pointsAwarded = 0;
  if (passed) {
    pointsAwarded = 25;
    try {
      const student = db.prepare('SELECT house_id FROM students WHERE id = ?').get(studentId);
      if (student) {
        db.prepare('UPDATE houses SET points = points + ? WHERE id = ?').run(pointsAwarded, student.house_id);
        db.prepare('UPDATE students SET points_contributed = points_contributed + ? WHERE id = ?').run(pointsAwarded, studentId);
        db.prepare(`
          INSERT INTO house_points_log (house_id, amount, reason, awarded_by)
          VALUES (?, ?, ?, ?)
        `).run(student.house_id, pointsAwarded, `Exemplary marks in ${quiz.title}`, 'Arch-Magister Valerius');
      }

      db.prepare(`
        INSERT INTO student_quizzes (student_id, quiz_id, course_code, score, total_questions, passed)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(studentId, `${courseCode}-quiz`, courseCode, scorePercent, total, passed ? 1 : 0);
    } catch (_) {}
  }

  return {
    courseCode,
    quizTitle: quiz.title,
    scorePercent,
    correctCount,
    totalQuestions: total,
    passed,
    pointsAwarded,
    results: detailedResults
  };
};

export const getStudentProgress = (studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  const quizzes = db.prepare(`
    SELECT quiz_id as quizId, course_code as courseCode, score, total_questions as totalQuestions, passed, completed_at as completedAt
    FROM student_quizzes
    WHERE student_id = ?
    ORDER BY completed_at DESC
  `).all(studentId);

  const brews = db.prepare(`
    SELECT potion_name as potionName, potency, stability, outcome, brewed_at as brewedAt
    FROM potion_brews
    WHERE student_id = ?
    ORDER BY brewed_at DESC
  `).all(studentId);

  return {
    studentId,
    completedQuizzes: quizzes,
    brewJournal: brews,
    accumulatedCredits: 12 + quizzes.length * 3
  };
};
