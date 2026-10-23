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
