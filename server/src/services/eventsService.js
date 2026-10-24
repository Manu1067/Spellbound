import { getDatabase } from '../db/connection.js';

export const getAllEvents = ({ category, studentId = 'student-aris-thorne' } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      e.id,
      e.title,
      e.date_time as dateTime,
      e.location_id as locationId,
      e.location_name as locationName,
      e.category,
      e.description,
      e.rsvp_count as rsvpCount,
      e.capacity,
      e.is_active as isActive,
      e.created_at as createdAt,
      CASE WHEN er.id IS NOT NULL THEN 1 ELSE 0 END as isRsvp
    FROM events e
    LEFT JOIN event_registrations er 
      ON e.id = er.event_id AND er.student_id = ?
    WHERE e.is_active = 1
  `;

  const params = [studentId];

  if (category) {
    query += ` AND e.category = ?`;
    params.push(category);
  }

  query += ` ORDER BY e.date_time ASC`;

  const rows = db.prepare(query).all(...params);
  return rows.map((r) => ({
    ...r,
    capacity: r.capacity || 50,
    isRsvp: Boolean(r.isRsvp),
    isActive: Boolean(r.isActive)
  }));
};

export const getEventById = (id, studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  const query = `
    SELECT 
      e.id,
      e.title,
      e.date_time as dateTime,
      e.location_id as locationId,
      e.location_name as locationName,
      e.category,
      e.description,
      e.rsvp_count as rsvpCount,
      e.capacity,
      e.is_active as isActive,
      e.created_at as createdAt,
      CASE WHEN er.id IS NOT NULL THEN 1 ELSE 0 END as isRsvp
    FROM events e
    LEFT JOIN event_registrations er 
      ON e.id = er.event_id AND er.student_id = ?
    WHERE e.id = ?
  `;

  const row = db.prepare(query).get(studentId, id);
  if (!row) return null;

  return {
    ...row,
    capacity: row.capacity || 50,
    isRsvp: Boolean(row.isRsvp),
    isActive: Boolean(row.isActive)
  };
};

export const toggleRsvp = (eventId, studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  const event = db.prepare('SELECT id, title, rsvp_count, capacity FROM events WHERE id = ?').get(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  const existing = db
    .prepare('SELECT id FROM event_registrations WHERE event_id = ? AND student_id = ?')
    .get(eventId, studentId);

  // Capacity check
  if (!existing && event.capacity && event.rsvp_count >= event.capacity) {
    throw new Error(`This event has reached maximum seating capacity (${event.capacity} adepts).`);
  }

  let isRsvpNow = false;
  let newCount = event.rsvp_count;
  let pointsAwarded = 0;

  const txn = db.transaction(() => {
    const student = db.prepare('SELECT house_id FROM students WHERE id = ?').get(studentId);

    if (existing) {
      // Remove registration
      db.prepare('DELETE FROM event_registrations WHERE id = ?').run(existing.id);
      newCount = Math.max(0, event.rsvp_count - 1);
      db.prepare('UPDATE events SET rsvp_count = ? WHERE id = ?').run(newCount, eventId);
      isRsvpNow = false;

      if (student) {
        db.prepare('UPDATE houses SET points = MAX(0, points - 10) WHERE id = ?').run(student.house_id);
      }
    } else {
      // Add registration
      db.prepare('INSERT INTO event_registrations (event_id, student_id) VALUES (?, ?)').run(eventId, studentId);
      newCount = event.rsvp_count + 1;
      db.prepare('UPDATE events SET rsvp_count = ? WHERE id = ?').run(newCount, eventId);
      isRsvpNow = true;
      pointsAwarded = 10;

      if (student) {
        db.prepare('UPDATE houses SET points = points + 10 WHERE id = ?').run(student.house_id);
        db.prepare(`
          INSERT INTO house_points_log (house_id, amount, reason, awarded_by)
          VALUES (?, 10, ?, 'Headmaster Council')
        `).run(student.house_id, `RSVP registration for ${event.title}`);
      }
    }
  });

  txn();

  return {
    eventId,
    isRsvp: isRsvpNow,
    rsvpCount: newCount,
    capacity: event.capacity || 50,
    pointsAwarded
  };
};
