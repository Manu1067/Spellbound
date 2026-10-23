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

export const getMatches = (req, res, next) => {
  try {
    const { status } = req.query;
    const matches = sportsService.getMatches({ status });
    return sendSuccess(res, matches, { total: matches.length });
  } catch (err) {
    next(err);
  }
};
