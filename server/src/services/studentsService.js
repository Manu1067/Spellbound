import { getDatabase } from '../db/connection.js';

export const getAllStudents = ({ house, branch, language, hobby, interest, search } = {}) => {
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
      s.branch,
      s.languages,
      s.hobbies,
      s.fields_of_interest as fieldsOfInterest,
      s.skills,
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

  if (branch && branch.toLowerCase() !== 'all') {
    query += ` AND LOWER(s.branch) LIKE LOWER(?)`;
    params.push(`%${branch}%`);
  }

  if (search) {
    query += ` AND (
      LOWER(s.name) LIKE LOWER(?) OR 
      LOWER(s.title) LIKE LOWER(?) OR 
      LOWER(s.fav_subject) LIKE LOWER(?) OR
      LOWER(s.branch) LIKE LOWER(?)
    )`;
    const wildcard = `%${search}%`;
    params.push(wildcard, wildcard, wildcard, wildcard);
  }

  query += ` ORDER BY s.name ASC`;

  const rows = db.prepare(query).all(...params);

  return rows
    .map((r) => ({
      ...r,
      languages: JSON.parse(r.languages || '[]'),
      hobbies: JSON.parse(r.hobbies || '[]'),
      fieldsOfInterest: JSON.parse(r.fieldsOfInterest || '[]'),
      skills: JSON.parse(r.skills || '[]'),
      isCurrentUser: Boolean(r.isCurrentUser)
    }))
    .filter((student) => {
      // Memory filter for JSON array fields if requested
      if (language && language !== 'All') {
        const hasLang = student.languages.some((l) => l.toLowerCase() === language.toLowerCase());
        if (!hasLang) return false;
      }
      if (hobby && hobby !== 'All') {
        const hasHobby = student.hobbies.some((h) => h.toLowerCase() === hobby.toLowerCase());
        if (!hasHobby) return false;
      }
      if (interest && interest !== 'All') {
        const hasInterest = student.fieldsOfInterest.some((i) => i.toLowerCase() === interest.toLowerCase());
        if (!hasInterest) return false;
      }
      return true;
    });
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
      s.branch,
      s.languages,
      s.hobbies,
      s.fields_of_interest as fieldsOfInterest,
      s.skills,
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
    languages: JSON.parse(row.languages || '[]'),
    hobbies: JSON.parse(row.hobbies || '[]'),
    fieldsOfInterest: JSON.parse(row.fieldsOfInterest || '[]'),
    skills: JSON.parse(row.skills || '[]'),
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
      s.branch,
      s.languages,
      s.hobbies,
      s.fields_of_interest as fieldsOfInterest,
      s.skills,
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
    languages: JSON.parse(row.languages || '[]'),
    hobbies: JSON.parse(row.hobbies || '[]'),
    fieldsOfInterest: JSON.parse(row.fieldsOfInterest || '[]'),
    skills: JSON.parse(row.skills || '[]'),
    isCurrentUser: true,
    term: 'Autumn Equinox · Term III',
    astralPhase: 'Waxing Crescent · Moon in Cassiopeia'
  };
};

/**
 * Deterministic Like-Minded Student Discovery Algorithm
 * Calculates compatibility score based on shared academic branch, languages, hobbies, and interests.
 */
export const findLikeMindedStudents = ({ studentId = 'student-aris-thorne', minScore = 1 } = {}) => {
  const targetStudent = getStudentById(studentId) || getCurrentStudent();
  if (!targetStudent) throw new Error('Target student not found');

  const allStudents = getAllStudents();

  const matches = allStudents
    .filter((s) => s.id !== targetStudent.id)
    .map((candidate) => {
      let score = 0;
      const sharedInterests = [];
      const sharedHobbies = [];
      const sharedLanguages = [];
      let sameBranch = false;

      // 1. Shared Fields of Interest (Weight: 3 pts each)
      for (const item of candidate.fieldsOfInterest) {
        if (targetStudent.fieldsOfInterest.some((t) => t.toLowerCase() === item.toLowerCase())) {
          score += 3;
          sharedInterests.push(item);
        }
      }

      // 2. Shared Hobbies (Weight: 2 pts each)
      for (const item of candidate.hobbies) {
        if (targetStudent.hobbies.some((t) => t.toLowerCase() === item.toLowerCase())) {
          score += 2;
          sharedHobbies.push(item);
        }
      }

      // 3. Shared Languages (Weight: 2 pts each)
      for (const item of candidate.languages) {
        if (targetStudent.languages.some((t) => t.toLowerCase() === item.toLowerCase())) {
          score += 2;
          sharedLanguages.push(item);
        }
      }

      // 4. Same Academic Branch (Weight: 2 pts)
      if (candidate.branch.toLowerCase() === targetStudent.branch.toLowerCase()) {
        score += 2;
        sameBranch = true;
      }

      // Percentage normalized (capped at 98% for realism)
      const matchPercentage = Math.min(98, Math.round((score / 16) * 100));

      const sharedTags = [
        ...sharedInterests.map((t) => ({ label: t, category: 'Interest' })),
        ...sharedHobbies.map((t) => ({ label: t, category: 'Hobby' })),
        ...sharedLanguages.map((t) => ({ label: t, category: 'Language' })),
        ...(sameBranch ? [{ label: candidate.branch, category: 'Branch' }] : [])
      ];

      return {
        student: candidate,
        score,
        matchPercentage,
        sameBranch,
        sharedTags,
        matchSummary: `${sharedTags.length} common attributes with ${targetStudent.name}`
      };
    })
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score);

  return {
    sourceStudent: {
      id: targetStudent.id,
      name: targetStudent.name,
      branch: targetStudent.branch
    },
    totalMatches: matches.length,
    matches
  };
};
