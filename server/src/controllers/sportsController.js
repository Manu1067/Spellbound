import * as sportsService from '../services/sportsService.js';
import { sendSuccess } from '../utils/response.js';

export const getStandings = (req, res, next) => {
  try {
    const standings = sportsService.getStandings();
    return sendSuccess(res, standings, { total: standings.length });
  } catch (err) {
    next(err);
  }
};

export const getTeams = (req, res, next) => {
  try {
    const teams = sportsService.getTeams();
    return sendSuccess(res, teams, { total: teams.length });
  } catch (err) {
    next(err);
  }
};

export const getMatches = (req, res, next) => {
  try {
    const { status } = req.query;
    const matches = sportsService.getMatches({ status });
    return sendSuccess(res, matches, { total: matches.length });
  } catch (err) {
    next(err);
  }
};

export const registerTeam = (req, res, next) => {
  try {
    const { name, houseId, captain, crestColor, roster } = req.body;
    if (!name || !houseId || !captain) {
      return res.status(400).json({ success: false, message: 'Name, houseId, and captain are required.' });
    }
    const team = sportsService.registerTeam({ name, houseId, captain, crestColor, roster });
    return sendSuccess(res, team, { message: 'Team successfully registered in Skyspire League.' }, 201);
  } catch (err) {
    next(err);
  }
};

export const updateMatchScore = (req, res, next) => {
  try {
    const { id } = req.params;
    const { homeScore, awayScore, snitchCaughtBy } = req.body;
    const updated = sportsService.updateMatchScore(id, { homeScore, awayScore, snitchCaughtBy });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    return sendSuccess(res, updated, { message: 'Match score recorded and standings updated.' });
  } catch (err) {
    next(err);
  }
};

export const simulateMatch = (req, res, next) => {
  try {
    const { id } = req.params;
    const result = sportsService.simulateMatch(id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const getTournamentBracket = (req, res, next) => {
  try {
    const bracket = sportsService.getTournamentBracket();
    return sendSuccess(res, bracket);
  } catch (err) {
    next(err);
  }
};
