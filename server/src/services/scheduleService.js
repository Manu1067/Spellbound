import { getDatabase } from '../db/connection.js';

export const getSchedule = (studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  return db.prepare(`
    SELECT 
      id,
      student_id as studentId,
      time_slot as time,
      subject,
      instructor,
      location,
      status,
      notes,
      created_at as createdAt
    FROM daily_schedules
    WHERE student_id = ?
    ORDER BY id ASC
  `).all(studentId);
};

export const toggleScheduleStatus = (id, studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  const item = db.prepare('SELECT id, status FROM daily_schedules WHERE id = ? AND student_id = ?').get(id, studentId);
  if (!item) {
    throw new Error('Schedule item not found');
  }

  const nextStatus = item.status === 'Completed' ? 'Upcoming' : 'Completed';

  db.prepare('UPDATE daily_schedules SET status = ? WHERE id = ?').run(nextStatus, id);

  return {
    id,
    status: nextStatus
  };
};
