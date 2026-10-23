import { getDatabase } from '../db/connection.js';

export const getAllStudents = ({ house, search } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      s.id,
      s.name,
      s.house_id as houseId,
      h.name as house,
      s.year,
      s.title,
      s.wand,
      s.patronus,
      s.fav_subject as favSubject,
      s.bio,
      s.avatar_url as avatarUrl,
      s.points_contributed as pointsContributed,
      s.academic_rank as academicRank,
      s.is_current_user as isCurrentUser,
      s.created_at as createdAt
    FROM students s
    JOIN houses h ON s.house_id = h.id
    WHERE 1=1
  `;

  const params = [];

  if (house && house.toLowerCase() !== 'all houses') {
    query += ` AND (LOWER(h.name) = LOWER(?) OR LOWER(s.house_id) = LOWER(?))`;
    params.push(house, house);
  }

  if (search) {
    query += ` AND (
      LOWER(s.name) LIKE LOWER(?) OR 
      LOWER(s.title) LIKE LOWER(?) OR 
      LOWER(s.fav_subject) LIKE LOWER(?)
    )`;
    const wildcard = `%${search}%`;
    params.push(wildcard, wildcard, wildcard);
  }

  query += ` ORDER BY s.name ASC`;

  const rows = db.prepare(query).all(...params);
  return rows.map((r) => ({
    ...r,
    isCurrentUser: Boolean(r.isCurrentUser)
  }));
};

export const getStudentById = (id) => {
  const db = getDatabase();

  const query = `
    SELECT 
      s.id,
      s.name,
      s.house_id as houseId,
      h.name as house,
      h.crest_color as houseColor,
      h.accent_color as houseAccent,
      s.year,
      s.title,
      s.wand,
      s.patronus,
      s.fav_subject as favSubject,
      s.bio,
      s.avatar_url as avatarUrl,
      s.points_contributed as pointsContributed,
      s.academic_rank as academicRank,
      s.is_current_user as isCurrentUser,
      s.created_at as createdAt
    FROM students s
    JOIN houses h ON s.house_id = h.id
    WHERE s.id = ?
  `;

  const row = db.prepare(query).get(id);
  if (!row) return null;

  return {
    ...row,
    isCurrentUser: Boolean(row.isCurrentUser)
  };
};

export const getCurrentStudent = () => {
  const db = getDatabase();

  const query = `
    SELECT 
      s.id,
      s.name,
      s.house_id as houseId,
      h.name as house,
      h.crest_color as houseColor,
      h.accent_color as houseAccent,
      s.year,
      s.title,
      s.wand,
      s.patronus,
      s.fav_subject as favSubject,
      s.bio,
      s.avatar_url as avatarUrl,
      s.points_contributed as pointsContributed,
      s.academic_rank as academicRank,
      s.is_current_user as isCurrentUser,
      s.created_at as createdAt
    FROM students s
    JOIN houses h ON s.house_id = h.id
    WHERE s.is_current_user = 1
    LIMIT 1
  `;

  const row = db.prepare(query).get();
  if (!row) return null;

  return {
    ...row,
    isCurrentUser: true,
    term: 'Autumn Equinox · Term III',
    astralPhase: 'Waxing Crescent · Moon in Cassiopeia'
  };
};
