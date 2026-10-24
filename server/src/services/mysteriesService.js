import { getDatabase } from '../db/connection.js';

// 1. Student Council Directory & Announcements
export const getStudentCouncil = () => {
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT 
      id,
      role,
      student_name as studentName,
      branch,
      office_hours as officeHours,
      contact_email as contactEmail,
      avatar_url as avatarUrl,
      announcements,
      created_at as createdAt
    FROM student_council
    ORDER BY id ASC
  `).all();

  return rows.map((r) => ({
    ...r,
    announcements: JSON.parse(r.announcements || '[]')
  }));
};

// 2. Future Warnings & Official Notices
export const getOfficialNotices = ({ priority, category } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      id,
      title,
      category,
      message,
      publication_date as publicationDate,
      expiry_date as expiryDate,
      priority,
      issuing_authority as issuingAuthority,
      is_verified as isVerified,
      created_at as createdAt
    FROM official_notices
    WHERE 1=1
  `;

  const params = [];

  if (priority && priority !== 'All') {
    query += ` AND LOWER(priority) = LOWER(?)`;
    params.push(priority);
  }

  if (category && category !== 'All') {
    query += ` AND category = ?`;
    params.push(category);
  }

  query += ` ORDER BY 
    CASE priority 
      WHEN 'Urgent' THEN 1 
      WHEN 'High' THEN 2 
      WHEN 'Normal' THEN 3 
      ELSE 4 
    END, 
    publication_date DESC
  `;

  const rows = db.prepare(query).all(...params);
  return rows.map((r) => ({
    ...r,
    isVerified: Boolean(r.isVerified)
  }));
};

// 3. Anonymous Confessions Board
export const getConfessions = ({ status = 'Approved' } = {}) => {
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT 
      id,
      message,
      category,
      status,
      likes_count as likesCount,
      created_at as createdAt
    FROM confessions
    WHERE status = ?
    ORDER BY created_at DESC
    LIMIT 30
  `).all(status);

  return rows;
};

export const createConfession = ({ message, category }) => {
  const db = getDatabase();

  if (!message || message.trim().length < 5) {
    throw new Error('Confession message must be at least 5 characters');
  }

  const id = `conf-${Date.now()}`;
  const cleanCategory = category || 'General';

  db.prepare(`
    INSERT INTO confessions (id, message, category, status, likes_count)
    VALUES (?, ?, ?, 'Approved', 0)
  `).run(id, message.trim(), cleanCategory);

  return {
    id,
    message: message.trim(),
    category: cleanCategory,
    status: 'Approved',
    likesCount: 0,
    createdAt: new Date().toISOString()
  };
};

export const likeConfession = (id) => {
  const db = getDatabase();

  const item = db.prepare('SELECT id, likes_count FROM confessions WHERE id = ?').get(id);
  if (!item) throw new Error('Confession not found');

  const newLikes = item.likes_count + 1;
  db.prepare('UPDATE confessions SET likes_count = ? WHERE id = ?').run(newLikes, id);

  return {
    id,
    likesCount: newLikes
  };
};

// 4. Confidential Complaints & Grievance Tracking
export const submitComplaint = ({ studentId = 'student-aris-thorne', category, subject, description, priority }) => {
  const db = getDatabase();

  if (!subject || !subject.trim()) throw new Error('Complaint subject is required');
  if (!description || !description.trim()) throw new Error('Complaint description is required');
  if (!category) throw new Error('Complaint category is required');

  const randomRef = Math.floor(1000 + Math.random() * 9000);
  const id = `REF-MYST-${randomRef}`;

  db.prepare(`
    INSERT INTO complaints (id, student_id, category, subject, description, priority, status, is_confidential)
    VALUES (?, ?, ?, ?, ?, ?, 'Submitted', 1)
  `).run(id, studentId, category, subject.trim(), description.trim(), priority || 'Routine');

  return {
    referenceId: id,
    category,
    subject: subject.trim(),
    priority: priority || 'Routine',
    status: 'Submitted',
    isConfidential: true,
    submittedAt: new Date().toISOString(),
    notice: 'Your complaint has been logged under confidential seal. Only authorized Academy proctors can inspect its details.'
  };
};

export const getComplaintStatus = (referenceId) => {
  const db = getDatabase();

  const row = db.prepare(`
    SELECT 
      id as referenceId,
      category,
      subject,
      priority,
      status,
      is_confidential as isConfidential,
      submitted_at as submittedAt
    FROM complaints
    WHERE id = ?
  `).get(referenceId);

  if (!row) return null;

  return {
    ...row,
    isConfidential: Boolean(row.isConfidential)
  };
};

// 5. Arcane Puzzles (Chronos Enigma)
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

  if (!puzzle) throw new Error('Mystery puzzle not found');

  const isCorrect = puzzle.correctIndex === parseInt(selectedIndex, 10);

  // Record student attempt
  db.prepare(`
    INSERT INTO mystery_records (puzzle_id, student_id, selected_index, is_correct)
    VALUES (?, ?, ?, ?)
  `).run(puzzleId, studentId, selectedIndex, isCorrect ? 1 : 0);

  return {
    puzzleId,
    isCorrect,
    explanation: puzzle.explanation
  };
};
