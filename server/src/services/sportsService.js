import { getDatabase } from '../db/connection.js';

export const getStandings = () => {
  const db = getDatabase();

  const teams = db.prepare(`
    SELECT 
      t.id,
      t.name as team,
      t.house_id as houseId,
      h.name as houseName,
      t.captain,
      t.crest_color as color,
      t.roster
    FROM sports_teams t
    JOIN houses h ON t.house_id = h.id
  `).all();

  const completedMatches = db.prepare(`
    SELECT home_team_id, away_team_id, home_score, away_score
    FROM sports_matches
    WHERE status = 'Completed' AND home_score IS NOT NULL AND away_score IS NOT NULL
  `).all();

  const standingsMap = {};
  for (const t of teams) {
    standingsMap[t.id] = {
      id: t.id,
      team: t.team,
      houseId: t.houseId,
      houseName: t.houseName,
      captain: t.captain,
      color: t.color,
      played: 0,
      wins: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    };
  }

  for (const m of completedMatches) {
    const home = standingsMap[m.home_team_id];
    const away = standingsMap[m.away_team_id];

    if (home && away) {
      home.played += 1;
      away.played += 1;
      home.goalsFor += m.home_score;
      home.goalsAgainst += m.away_score;
      away.goalsFor += m.away_score;
      away.goalsAgainst += m.home_score;

      if (m.home_score > m.away_score) {
        home.wins += 1;
        home.points += 3;
        away.losses += 1;
      } else if (m.away_score > m.home_score) {
        away.wins += 1;
        away.points += 3;
        home.losses += 1;
      }
    }
  }

  const standingsList = Object.values(standingsMap).map((s) => {
    const diff = s.goalsFor - s.goalsAgainst;
    return {
      id: s.id,
      team: s.team,
      houseId: s.houseId,
      houseName: s.houseName,
      captain: s.captain,
      color: s.color,
      played: s.played,
      wins: s.wins,
      losses: s.losses,
      goalsFor: s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      goalDiff: diff >= 0 ? `+${diff}` : `${diff}`,
      points: s.points
    };
  });

  standingsList.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    return b.wins - a.wins;
  });

  return standingsList.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

export const getTeams = () => {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT 
      t.id,
      t.name,
      t.house_id as houseId,
      h.name as houseName,
      t.captain,
      t.crest_color as crestColor,
      t.roster,
      t.created_at as createdAt
    FROM sports_teams t
    JOIN houses h ON t.house_id = h.id
    ORDER BY t.name ASC
  `).all();

  return rows.map((r) => ({
    ...r,
    roster: JSON.parse(r.roster || '[]')
  }));
};

export const registerTeam = ({ name, houseId, captain, crestColor, roster = [] }) => {
  const db = getDatabase();
  const id = `team-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  db.prepare(`
    INSERT INTO sports_teams (id, name, house_id, captain, wins, losses, goal_differential, points, crest_color, roster)
    VALUES (?, ?, ?, ?, 0, 0, '+0', 0, ?, ?)
  `).run(id, name, houseId, captain, crestColor || '#D6B46A', JSON.stringify(roster));

  return {
    id,
    name,
    houseId,
    captain,
    crestColor,
    roster
  };
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

export const updateMatchScore = (id, { homeScore, awayScore, snitchCaughtBy }) => {
  const db = getDatabase();

  const match = db.prepare('SELECT id, home_team_id, away_team_id FROM sports_matches WHERE id = ?').get(id);
  if (!match) return null;

  db.prepare(`
    UPDATE sports_matches SET
      home_score = ?,
      away_score = ?,
      snitch_caught_by = ?,
      status = 'Completed'
    WHERE id = ?
  `).run(homeScore, awayScore, snitchCaughtBy || null, id);

  return db.prepare(`
    SELECT 
      m.id,
      m.home_team_id as homeTeamId,
      ht.name as homeTeam,
      m.away_team_id as awayTeamId,
      at.name as awayTeam,
      m.status,
      m.home_score as homeScore,
      m.away_score as awayScore,
      m.snitch_caught_by as snitchCaughtBy
    FROM sports_matches m
    JOIN sports_teams ht ON m.home_team_id = ht.id
    JOIN sports_teams at ON m.away_team_id = at.id
    WHERE m.id = ?
  `).get(id);
};

export const simulateMatch = (matchId) => {
  const db = getDatabase();

  const match = db.prepare(`
    SELECT m.*, ht.name as homeName, at.name as awayName, ht.captain as homeCap, at.captain as awayCap
    FROM sports_matches m
    JOIN sports_teams ht ON m.home_team_id = ht.id
    JOIN sports_teams at ON m.away_team_id = at.id
    WHERE m.id = ?
  `).get(matchId);

  if (!match) return null;

  // If already completed, return existing
  if (match.status === 'Completed' && match.home_score !== null) {
    return {
      match: match,
      simulated: false,
      message: 'Match was already completed previously.'
    };
  }

  // Deterministic simulation based on matchId character codes
  let seed = 0;
  for (let i = 0; i < matchId.length; i++) {
    seed = (seed * 31 + matchId.charCodeAt(i)) % 1000;
  }

  // Realistic Quidditch scores (10 pts per goal, 150 for snitch)
  const homeGoals = 5 + (seed % 12);
  const awayGoals = 4 + ((seed * 7) % 11);
  const snitchToHome = seed % 2 === 0;

  const homeScore = homeGoals * 10 + (snitchToHome ? 150 : 0);
  const awayScore = awayGoals * 10 + (snitchToHome ? 0 : 150);
  const snitchCatcher = snitchToHome ? match.homeCap : match.awayCap;

  updateMatchScore(matchId, {
    homeScore,
    awayScore,
    snitchCaughtBy: snitchCatcher
  });

  const updatedMatch = db.prepare(`
    SELECT 
      m.id,
      m.home_team_id as homeTeamId,
      ht.name as homeTeam,
      m.away_team_id as awayTeamId,
      at.name as awayTeam,
      m.status,
      m.home_score as homeScore,
      m.away_score as awayScore,
      m.snitch_caught_by as snitchCaughtBy
    FROM sports_matches m
    JOIN sports_teams ht ON m.home_team_id = ht.id
    JOIN sports_teams at ON m.away_team_id = at.id
    WHERE m.id = ?
  `).get(matchId);

  return {
    match: updatedMatch,
    simulated: true,
    message: `Match simulated deterministically: ${updatedMatch.homeTeam} ${homeScore} – ${awayScore} ${updatedMatch.awayTeam} (Golden Snitch captured by ${snitchCatcher}).`
  };
};

export const getTournamentBracket = () => {
  const standings = getStandings();
  const matches = getMatches();

  return {
    season: 'Eldorian Aero-Broom Cup',
    round: 'Skyspire Grand Finals Bracket',
    semiFinal1: {
      team1: standings[0] || null,
      team2: standings[3] || null,
      match: matches.find((m) => m.id === 'match-1') || null
    },
    semiFinal2: {
      team1: standings[1] || null,
      team2: standings[2] || null,
      match: matches.find((m) => m.id === 'match-2') || null
    },
    championship: {
      title: 'Skyspire Grand Championship Final',
      team1: standings[0] || null,
      team2: standings[1] || null,
      match: matches.find((m) => m.id === 'match-3') || null
    }
  };
};
