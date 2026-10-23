import * as housesService from '../services/housesService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getHouses = (req, res, next) => {
  try {
    const houses = housesService.getAllHouses();
    return sendSuccess(res, houses, { total: houses.length });
  } catch (err) {
    next(err);
  }
};

export const getHouseById = (req, res, next) => {
  try {
    const { id } = req.params;
    const house = housesService.getHouseById(id.toLowerCase());

    if (!house) {
      return sendError(res, `House not found with ID '${id}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, house);
  } catch (err) {
    next(err);
  }
};

export const awardPoints = (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, reason, awardedBy } = req.body;

    const result = housesService.awardHousePoints(id.toLowerCase(), {
      amount,
      reason,
      awardedBy
    });

    return sendSuccess(res, result);
  } catch (err) {
    if (err.message.includes('House not found')) {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    if (err.message.includes('Point amount must be')) {
      return sendError(res, err.message, 'VALIDATION_ERROR', 400);
    }
    next(err);
  }
};

export const getPointsHistory = (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '20', 10);
    const history = housesService.getPointsHistory(limit);
    return sendSuccess(res, history, { total: history.length });
  } catch (err) {
    next(err);
  }
};
