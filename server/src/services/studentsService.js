import { getDatabase } from '../db/connection.js';

export const getAllStudents = ({ house, search, mentor, subject, skill } = {}) => {
  const db = getDatabase();

  let query = `
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
      s.skills,
      s.interests,
      s.project_experience as projectExperience,
      s.is_mentor as isMentor,
      s.role,
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

  if (mentor === 'true' || mentor === '1' || mentor === true) {
    query += ` AND s.is_mentor = 1`;
  }

  if (subject && subject.toLowerCase() !== 'all subjects') {
    query += ` AND LOWER(s.fav_subject) LIKE LOWER(?)`;
    params.push(`%${subject}%`);
  }

  if (skill) {
    query += ` AND LOWER(s.skills) LIKE LOWER(?)`;
    params.push(`%${skill}%`);
  }

  if (search) {
    query += ` AND (
      LOWER(s.name) LIKE LOWER(?) OR 
      LOWER(s.title) LIKE LOWER(?) OR 
      LOWER(s.fav_subject) LIKE LOWER(?) OR
      LOWER(s.skills) LIKE LOWER(?) OR
      LOWER(s.interests) LIKE LOWER(?)
    )`;
    const wildcard = `%${search}%`;
    params.push(wildcard, wildcard, wildcard, wildcard, wildcard);
  }

  query += ` ORDER BY s.name ASC`;

  const rows = db.prepare(query).all(...params);
  return rows.map((r) => ({
    ...r,
    isCurrentUser: Boolean(r.isCurrentUser),
    isMentor: Boolean(r.isMentor),
    skills: JSON.parse(r.skills || '[]'),
    interests: JSON.parse(r.interests || '[]')
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
      s.skills,
      s.interests,
      s.project_experience as projectExperience,
      s.is_mentor as isMentor,
      s.role,
      s.created_at as createdAt
    FROM students s
    JOIN houses h ON s.house_id = h.id
    WHERE s.id = ?
  `;

  const row = db.prepare(query).get(id);
  if (!row) return null;

  return {
    ...row,
    isCurrentUser: Boolean(row.isCurrentUser),
    isMentor: Boolean(row.isMentor),
    skills: JSON.parse(row.skills || '[]'),
    interests: JSON.parse(row.interests || '[]')
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
      s.skills,
      s.interests,
      s.project_experience as projectExperience,
      s.is_mentor as isMentor,
      s.role,
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
    isMentor: Boolean(row.isMentor),
    skills: JSON.parse(row.skills || '[]'),
    interests: JSON.parse(row.interests || '[]'),
    term: 'Autumn Equinox · Term III',
    astralPhase: 'Waxing Crescent · Moon in Cassiopeia'
  };
};

export const updateStudent = (id, updates = {}) => {
  const db = getDatabase();

  const existing = db.prepare('SELECT id, house_id FROM students WHERE id = ?').get(id);
  if (!existing) return null;

  const current = getStudentById(id);

  const title = updates.title !== undefined ? updates.title : current.title;
  const wand = updates.wand !== undefined ? updates.wand : current.wand;
  const patronus = updates.patronus !== undefined ? updates.patronus : current.patronus;
  const favSubject = updates.favSubject !== undefined ? updates.favSubject : current.favSubject;
  const bio = updates.bio !== undefined ? updates.bio : current.bio;
  const role = updates.role !== undefined ? updates.role : current.role;
  const isMentor = updates.isMentor !== undefined ? (updates.isMentor ? 1 : 0) : (current.isMentor ? 1 : 0);
  const houseId = updates.houseId !== undefined ? updates.houseId : current.houseId;

  const skillsJson = Array.isArray(updates.skills)
    ? JSON.stringify(updates.skills)
    : (updates.skills !== undefined ? updates.skills : JSON.stringify(current.skills || []));

  const interestsJson = Array.isArray(updates.interests)
    ? JSON.stringify(updates.interests)
    : (updates.interests !== undefined ? updates.interests : JSON.stringify(current.interests || []));

  const projectExp = updates.projectExperience !== undefined ? updates.projectExperience : (current.projectExperience || '');

  db.prepare(`
    UPDATE students SET
      title = ?,
      wand = ?,
      patronus = ?,
      fav_subject = ?,
      bio = ?,
      role = ?,
      is_mentor = ?,
      house_id = ?,
      skills = ?,
      interests = ?,
      project_experience = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, wand, patronus, favSubject, bio, role, isMentor, houseId, skillsJson, interestsJson, projectExp, id);

  return getStudentById(id);
};
