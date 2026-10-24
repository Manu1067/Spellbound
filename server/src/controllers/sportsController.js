import * as sportsService from '../services/sportsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getSportsDisciplines = (req, res, next) => {
  try {
    const { category } = req.query;
    const sports = sportsService.getSportsDisciplines({ category });
    return sendSuccess(res, sports, { total: sports.length });
  } catch (err) {
    next(err);
  }
};

export const getSportById = (req, res, next) => {
  try {
    const { id } = req.params;
    const sport = sportsService.getSportById(id);

    if (!sport) {
      return sendError(res, `Sport not found with ID '${id}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, sport);
  } catch (err) {
    next(err);
  }
};

export const registerInterest = (req, res, next) => {
  try {
    const { studentId, sportId, experienceLevel, preferredRole, contactNote } = req.body;
    if (!sportId) {
      return sendError(res, 'Sport ID is required for registration', 'VALIDATION_ERROR', 400);
    }

    const reg = sportsService.registerSportInterest({
      studentId: studentId || 'student-aris-thorne',
      sportId,
      experienceLevel,
      preferredRole,
      contactNote
    });

    return sendSuccess(res, reg, null, 201);
  } catch (err) {
    if (err.message.includes('not found')) {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};

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
    const { status, sportId } = req.query;
    const matches = sportsService.getMatches({ status, sportId });
    return sendSuccess(res, matches, { total: matches.length });
  } catch (err) {
    next(err);
  }
};
