import { getDatabase } from '../db/connection.js';

export const getAllClubs = () => {
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT 
      c.id,
      c.name,
      c.description,
      c.lead_coordinator as leadCoordinator,
      c.meeting_schedule as meetingSchedule,
      c.activities,
      c.icon_name as iconName,
      c.created_at as createdAt,
      (SELECT COUNT(*) FROM events e WHERE e.club_id = c.id) as upcomingEventsCount
    FROM clubs c
    ORDER BY c.name ASC
  `).all();

  return rows.map((r) => ({
    ...r,
    activities: JSON.parse(r.activities || '[]')
  }));
};

export const getClubById = (id) => {
  const db = getDatabase();

  const row = db.prepare(`
    SELECT 
      c.id,
      c.name,
      c.description,
      c.lead_coordinator as leadCoordinator,
      c.meeting_schedule as meetingSchedule,
      c.activities,
      c.icon_name as iconName,
      c.created_at as createdAt
    FROM clubs c
    WHERE c.id = ?
  `).get(id);

  if (!row) return null;

  const events = db.prepare(`
    SELECT 
      id,
      title,
      date_time as dateTime,
      location_name as locationName,
      category,
      description,
      rsvp_count as rsvpCount
    FROM events
    WHERE club_id = ?
    ORDER BY date_time ASC
  `).all(id);

  return {
    ...row,
    activities: JSON.parse(row.activities || '[]'),
    events
  };
};
