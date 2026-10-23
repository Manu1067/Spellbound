import * as healthService from '../services/healthService.js';
import { sendSuccess } from '../utils/response.js';

export const getHealth = (req, res, next) => {
  try {
    const health = healthService.checkHealth();
    return sendSuccess(res, health);
  } catch (err) {
    next(err);
  }
};
