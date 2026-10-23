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
    isRsvp: Boolean(row.isRsvp),
    isActive: Boolean(row.isActive)
  };
};

export const toggleRsvp = (eventId, studentId = 'student-aris-thorne') => {
  const db = getDatabase();

  const event = db.prepare('SELECT id, rsvp_count FROM events WHERE id = ?').get(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  const existing = db
    .prepare('SELECT id FROM event_registrations WHERE event_id = ? AND student_id = ?')
    .get(eventId, studentId);

  let isRsvpNow = false;
  let newCount = event.rsvp_count;

  const txn = db.transaction(() => {
    if (existing) {
      // Remove registration
      db.prepare('DELETE FROM event_registrations WHERE id = ?').run(existing.id);
      newCount = Math.max(0, event.rsvp_count - 1);
      db.prepare('UPDATE events SET rsvp_count = ? WHERE id = ?').run(newCount, eventId);
      isRsvpNow = false;
    } else {
      // Add registration
      db.prepare('INSERT INTO event_registrations (event_id, student_id) VALUES (?, ?)').run(eventId, studentId);
      newCount = event.rsvp_count + 1;
      db.prepare('UPDATE events SET rsvp_count = ? WHERE id = ?').run(newCount, eventId);
      isRsvpNow = true;
    }
  });

  txn();

  return {
    eventId,
    isRsvp: isRsvpNow,
    rsvpCount: newCount
  };
};
