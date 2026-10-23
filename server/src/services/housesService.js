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
    ORDER BY awarded_at DESC
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
    ORDER BY l.awarded_at DESC
    LIMIT ?
  `).all(limit);
};
