import { getDatabase } from '../db/connection.js';

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

export const getMatches = ({ status } = {}) => {
  const db = getDatabase();

  let query = `
    SELECT 
      m.id,
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
    JOIN sports_teams ht ON m.home_team_id = ht.id
    JOIN sports_teams at ON m.away_team_id = at.id
    WHERE 1=1
  `;

  const params = [];

  if (status) {
    query += ` AND m.status = ?`;
    params.push(status);
  }

  query += ` ORDER BY m.match_date ASC`;

  return db.prepare(query).all(...params);
};
