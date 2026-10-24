import * as clubsService from '../services/clubsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getClubs = (req, res, next) => {
  try {
    const clubs = clubsService.getAllClubs();
    return sendSuccess(res, clubs, { total: clubs.length });
  } catch (err) {
    next(err);
  }
};

export const getClubById = (req, res, next) => {
  try {
    const { id } = req.params;
    const club = clubsService.getClubById(id);

    if (!club) {
      return sendError(res, `Student club not found with ID '${id}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, club);
  } catch (err) {
    next(err);
  }
};
