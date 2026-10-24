import { getDatabase } from '../db/connection.js';

export const getAllHouses = () => {
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT 
      id,
      name,
      motto,
      core_values as "values",
      points,
      crest_color as crestColor,
      accent_color as accentColor,
      animal,
      gem,
      head_of_house as headOfHouse,
      created_at as createdAt,
      updated_at as updatedAt
    FROM houses
    ORDER BY points DESC
  `).all();

  return rows.map((r) => ({
    ...r,
    values: JSON.parse(r.values || '[]')
  }));
};

export const getHouseById = (id) => {
  const db = getDatabase();

  const row = db.prepare(`
    SELECT 
      id,
      name,
      motto,
      core_values as "values",
      points,
      crest_color as crestColor,
      accent_color as accentColor,
      animal,
      gem,
      head_of_house as headOfHouse,
      created_at as createdAt,
      updated_at as updatedAt
    FROM houses
    WHERE id = ?
  `).get(id);

  if (!row) return null;

  const logs = db.prepare(`
    SELECT 
      id,
      amount,
      reason,
      awarded_by as awardedBy,
      awarded_at as awardedAt
    FROM house_points_log
    WHERE house_id = ?
    ORDER BY awarded_at DESC, id DESC
    LIMIT 20
  `).all(id);

  return {
    ...row,
    values: JSON.parse(row.values || '[]'),
    recentAwards: logs
  };
};

export const awardHousePoints = (houseId, { amount, reason, awardedBy = 'Academy Faculty' }) => {
  const db = getDatabase();

  const numAmount = parseInt(amount, 10);
  if (isNaN(numAmount) || numAmount === 0) {
    throw new Error('Point amount must be a non-zero integer');
  }

  const house = db.prepare('SELECT id, name, points FROM houses WHERE id = ?').get(houseId);
  if (!house) {
    throw new Error(`House not found with id: ${houseId}`);
  }

  let updatedPoints = house.points + numAmount;

  const txn = db.transaction(() => {
    // 1. Update house points
    db.prepare('UPDATE houses SET points = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(updatedPoints, houseId);

    // 2. Insert into points log
    db.prepare(`
      INSERT INTO house_points_log (house_id, amount, reason, awarded_by)
      VALUES (?, ?, ?, ?)
    `).run(houseId, numAmount, reason || 'Exemplary Magical Merit', awardedBy);
  });

  txn();

  return {
    houseId,
    houseName: house.name,
    pointsAwarded: numAmount,
    totalPoints: updatedPoints,
    reason,
    awardedBy
  };
};

export const getPointsHistory = (limit = 20) => {
  const db = getDatabase();
  return db.prepare(`
    SELECT 
      l.id,
      l.house_id as houseId,
      h.name as houseName,
      h.crest_color as crestColor,
      l.amount,
      l.reason,
      l.awarded_by as awardedBy,
      l.awarded_at as awardedAt
    FROM house_points_log l
    JOIN houses h ON l.house_id = h.id
    ORDER BY l.awarded_at DESC, l.id DESC
    LIMIT ?
  `).all(limit);
};

export const SORTING_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'When entering an unmapped chamber of the castle, your first impulse is:',
    options: [
      { text: 'Inspect the astral glyphs and deduce the ward logic.', house: 'ravencrest' },
      { text: 'Draw your wand and step boldly into the threshold.', house: 'gryphonhart' },
      { text: 'Observe from the shadows to see what lurks unseen.', house: 'shadowvale' },
      { text: 'Check that your companions are safe and warm.', house: 'emberwyrm' }
    ]
  },
  {
    id: 'q2',
    prompt: 'Which magical relic would you guard with your life?',
    options: [
      { text: 'The Astrolabe of Infinite Constellations.', house: 'ravencrest' },
      { text: 'The Sword of Gryphon Flight.', house: 'gryphonhart' },
      { text: 'The Philtre of Nocturnal Ambition.', house: 'shadowvale' },
      { text: 'The Heart-Root of the Eternal Forest.', house: 'emberwyrm' }
    ]
  },
  {
    id: 'q3',
    prompt: 'Your greatest magical ambition is:',
    options: [
      { text: 'To unlock the ultimate secrets of the cosmos.', house: 'ravencrest' },
      { text: 'To perform heroic feats that inspire legends.', house: 'gryphonhart' },
      { text: 'To attain mastery over subtlety and power.', house: 'shadowvale' },
      { text: 'To protect the harmony of all living souls.', house: 'emberwyrm' }
    ]
  },
  {
    id: 'q4',
    prompt: 'When brewing a volatile cauldron elixir:',
    options: [
      { text: 'Calculate the exact thermodynamic formula before brewing.', house: 'ravencrest' },
      { text: 'Stir with swift courage and trust your instinct.', house: 'gryphonhart' },
      { text: 'Alter the recipe with a cunning catalyst.', house: 'shadowvale' },
      { text: 'Tend with patience and steady low flame; let nature take its course.', house: 'emberwyrm' }
    ]
  }
];

export const submitSortingQuiz = ({ studentId = 'student-aris-thorne', answers = {} }) => {
  const db = getDatabase();

  const scores = {
    ravencrest: 0,
    gryphonhart: 0,
    shadowvale: 0,
    emberwyrm: 0
  };

  SORTING_QUESTIONS.forEach((q) => {
    const chosenIndex = answers[q.id];
    if (chosenIndex !== undefined && q.options[chosenIndex]) {
      const houseKey = q.options[chosenIndex].house;
      scores[houseKey] = (scores[houseKey] || 0) + 1;
    }
  });

  const totalAnswered = Object.values(scores).reduce((a, b) => a + b, 0) || 1;

  // Find top house
  let topHouseId = 'ravencrest';
  let topScore = -1;
  for (const [houseId, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topHouseId = houseId;
    }
  }

  const housePercentages = {
    ravencrest: Math.round((scores.ravencrest / totalAnswered) * 100),
    gryphonhart: Math.round((scores.gryphonhart / totalAnswered) * 100),
    shadowvale: Math.round((scores.shadowvale / totalAnswered) * 100),
    emberwyrm: Math.round((scores.emberwyrm / totalAnswered) * 100)
  };

  const house = db.prepare('SELECT id, name, motto, crest_color as crestColor, animal FROM houses WHERE id = ?').get(topHouseId);

  // Update student house in DB
  const pointsAwarded = 50;
  const txn = db.transaction(() => {
    db.prepare('UPDATE students SET house_id = ? WHERE id = ?').run(topHouseId, studentId);
    db.prepare('UPDATE houses SET points = points + ? WHERE id = ?').run(pointsAwarded, topHouseId);
    db.prepare(`
      INSERT INTO house_points_log (house_id, amount, reason, awarded_by)
      VALUES (?, ?, ?, 'The Grand Ceremonial Sorting Hat')
    `).run(topHouseId, pointsAwarded, `Sorting Ceremony Inscription for Adept`);
  });

  txn();

  return {
    sortedHouse: house,
    affinityScores: scores,
    breakdownPercentages: housePercentages,
    pointsAwarded,
    message: `The ancient magic resonates: You are proclaimed an adept of House ${house.name}!`
  };
};
