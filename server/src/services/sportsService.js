import { getDatabase } from '../db/connection.js';

export const getSportsDisciplines = ({ category } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      id,
      name,
      category,
      description,
      team_size as teamSize,
      venue,
      equipment,
      rules_summary as rulesSummary,
      icon_name as iconName,
      created_at as createdAt,
      (SELECT COUNT(*) FROM sports_registrations sr WHERE sr.sport_id = sd.id) as interestedCount
    FROM sports_disciplines sd
    WHERE 1=1
  `;

  const params = [];

  if (category && category !== 'All') {
    query += ` AND LOWER(category) = LOWER(?)`;
    params.push(category);
  }

  query += ` ORDER BY category DESC, name ASC`;

  return db.prepare(query).all(...params);
};

export const getSportById = (id) => {
  const db = getDatabase();

  const query = `
    SELECT 
      id,
      name,
      category,
      description,
      team_size as teamSize,
      venue,
      equipment,
      rules_summary as rulesSummary,
      icon_name as iconName,
      created_at as createdAt
    FROM sports_disciplines
    WHERE id = ?
  `;

  const sport = db.prepare(query).get(id);
  if (!sport) return null;

  const matches = db.prepare(`
    SELECT 
      m.id,
      m.home_team_id as homeTeamId,
      ht.name as homeTeam,
      m.away_team_id as awayTeamId,
      at.name as awayTeam,
      m.match_date as matchDate,
      m.venue,
      m.status,
      m.home_score as homeScore,
      m.away_score as awayScore
    FROM sports_matches m
    JOIN sports_teams ht ON m.home_team_id = ht.id
    JOIN sports_teams at ON m.away_team_id = at.id
    WHERE m.sport_id = ?
    ORDER BY m.match_date DESC
  `).all(id);

  return {
    ...sport,
    matches
  };
};

export const registerSportInterest = ({ studentId = 'student-aris-thorne', sportId, experienceLevel, preferredRole, contactNote }) => {
  const db = getDatabase();

  const sport = db.prepare('SELECT id, name FROM sports_disciplines WHERE id = ?').get(sportId);
  if (!sport) throw new Error(`Sport not found with ID: ${sportId}`);

  const student = db.prepare('SELECT id, name FROM students WHERE id = ?').get(studentId);
  if (!student) throw new Error(`Student not found with ID: ${studentId}`);

  // Upsert or insert registration
  db.prepare(`
    INSERT INTO sports_registrations (student_id, sport_id, experience_level, preferred_role, contact_note)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(student_id, sport_id) DO UPDATE SET
      experience_level = excluded.experience_level,
      preferred_role = excluded.preferred_role,
      contact_note = excluded.contact_note,
      registered_at = CURRENT_TIMESTAMP
  `).run(studentId, sportId, experienceLevel || 'Intermediate', preferredRole || 'General Squad', contactNote || '');

  return {
    sportId,
    sportName: sport.name,
    studentId,
    studentName: student.name,
    experienceLevel: experienceLevel || 'Intermediate',
    preferredRole: preferredRole || 'General Squad',
    registeredAt: new Date().toISOString()
  };
};

export const getStandings = () => {
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT 
      t.id,
      t.name as team,
      t.house_id as houseId,
      h.name as houseName,
      t.captain,
      t.wins,
      t.losses,
      t.goal_differential as goalDiff,
      t.points,
      t.crest_color as color,
      ROW_NUMBER() OVER (ORDER BY t.points DESC, t.wins DESC) as rank
    FROM sports_teams t
    JOIN houses h ON t.house_id = h.id
    ORDER BY t.points DESC, t.wins DESC
  `).all();

  return rows;
};

export const getMatches = ({ status, sportId } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      m.id,
      m.sport_id as sportId,
      sd.name as sportName,
      m.home_team_id as homeTeamId,
      ht.name as homeTeam,
      ht.crest_color as homeColor,
      m.away_team_id as awayTeamId,
      at.name as awayTeam,
      at.crest_color as awayColor,
      m.match_date as matchDate,
      m.venue,
      m.status,
      m.home_score as homeScore,
      m.away_score as awayScore,
      m.snitch_caught_by as snitchCaughtBy,
      m.created_at as createdAt
    FROM sports_matches m
    LEFT JOIN sports_disciplines sd ON m.sport_id = sd.id
    JOIN sports_teams ht ON m.home_team_id = ht.id
    JOIN sports_teams at ON m.away_team_id = at.id
    WHERE 1=1
  `;

  const params = [];

  if (status) {
    query += ` AND m.status = ?`;
    params.push(status);
  }

  if (sportId) {
    query += ` AND m.sport_id = ?`;
    params.push(sportId);
  }

  query += ` ORDER BY m.match_date ASC`;

  return db.prepare(query).all(...params);
};
