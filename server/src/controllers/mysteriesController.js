import * as mysteriesService from '../services/mysteriesService.js';
import * as eventsService from '../services/eventsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getStudentCouncil = (req, res, next) => {
  try {
    const council = mysteriesService.getStudentCouncil();
    return sendSuccess(res, council, { total: council.length });
  } catch (err) {
    next(err);
  }
};

export const getOfficialNotices = (req, res, next) => {
  try {
    const { priority, category } = req.query;
    const notices = mysteriesService.getOfficialNotices({ priority, category });
    return sendSuccess(res, notices, { total: notices.length });
  } catch (err) {
    next(err);
  }
};

export const getUpcomingEvents = (req, res, next) => {
  try {
    const events = eventsService.getAllEvents();
    return sendSuccess(res, events, { total: events.length });
  } catch (err) {
    next(err);
  }
};

export const getConfessions = (req, res, next) => {
  try {
    const confessions = mysteriesService.getConfessions();
    return sendSuccess(res, confessions, { total: confessions.length });
  } catch (err) {
    next(err);
  }
};

export const createConfession = (req, res, next) => {
  try {
    const { message, category } = req.body;
    if (!message || message.trim().length < 5) {
      return sendError(res, 'Confession message must be at least 5 characters', 'VALIDATION_ERROR', 400);
    }

    const confession = mysteriesService.createConfession({ message, category });
    return sendSuccess(res, confession, null, 201);
  } catch (err) {
    next(err);
  }
};

export const likeConfession = (req, res, next) => {
  try {
    const { id } = req.params;
    const result = mysteriesService.likeConfession(id);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};

export const submitComplaint = (req, res, next) => {
  try {
    const { studentId, category, subject, description, priority } = req.body;
    const result = mysteriesService.submitComplaint({
      studentId: studentId || 'student-aris-thorne',
      category,
      subject,
      description,
      priority
    });
    return sendSuccess(res, result, null, 201);
  } catch (err) {
    if (err.message.includes('required')) {
      return sendError(res, err.message, 'VALIDATION_ERROR', 400);
    }
    next(err);
  }
};

export const getComplaintStatus = (req, res, next) => {
  try {
    const { refId } = req.params;
    const complaint = mysteriesService.getComplaintStatus(refId);

    if (!complaint) {
      return sendError(res, `No complaint found for reference ID '${refId}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, complaint);
  } catch (err) {
    next(err);
  }
};

export const getPuzzles = (req, res, next) => {
  try {
    const puzzles = mysteriesService.getPuzzles();
    return sendSuccess(res, puzzles, { total: puzzles.length });
  } catch (err) {
    next(err);
  }
};

export const verifyAnswer = (req, res, next) => {
  try {
    const { puzzleId, selectedIndex, studentId } = req.body;

    if (selectedIndex === undefined || selectedIndex === null) {
      return sendError(res, 'Option selection is required', 'VALIDATION_ERROR', 400);
    }

    const result = mysteriesService.verifyPuzzleAnswer({
      puzzleId,
      selectedIndex,
      studentId
    });

    return sendSuccess(res, result);
  } catch (err) {
    if (err.message === 'Mystery puzzle not found') {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};
