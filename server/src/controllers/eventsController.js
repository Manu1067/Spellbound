import * as eventsService from '../services/eventsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getEvents = (req, res, next) => {
  try {
    const { category, studentId } = req.query;
    const events = eventsService.getAllEvents({ category, studentId });
    return sendSuccess(res, events, { total: events.length });
  } catch (err) {
    next(err);
  }
};

export const getEventById = (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.query;
    const event = eventsService.getEventById(id, studentId);

    if (!event) {
      return sendError(res, `Event not found with ID '${id}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
};

export const toggleRsvp = (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const result = eventsService.toggleRsvp(id, studentId);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.message === 'Event not found') {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};
