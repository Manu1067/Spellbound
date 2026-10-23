import * as scheduleService from '../services/scheduleService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getSchedule = (req, res, next) => {
  try {
    const { studentId } = req.query;
    const schedule = scheduleService.getSchedule(studentId);
    return sendSuccess(res, schedule, { total: schedule.length });
  } catch (err) {
    next(err);
  }
};

export const toggleScheduleStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const result = scheduleService.toggleScheduleStatus(id, studentId);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.message === 'Schedule item not found') {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};
