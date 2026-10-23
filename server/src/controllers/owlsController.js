import * as owlsService from '../services/owlsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const dispatchOwl = (req, res, next) => {
  try {
    const { senderId, senderName, recipientId, message } = req.body;

    if (!recipientId) {
      return sendError(res, 'Recipient ID is required to dispatch an owl', 'VALIDATION_ERROR', 400);
    }
    if (!message || !message.trim()) {
      return sendError(res, 'Parchment message content cannot be empty', 'VALIDATION_ERROR', 400);
    }

    const dispatch = owlsService.dispatchOwl({
      senderId,
      senderName,
      recipientId,
      message: message.trim()
    });

    return sendSuccess(res, dispatch, null, 201);
  } catch (err) {
    if (err.message.includes('Recipient student not found')) {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};

export const getRecentDispatches = (req, res, next) => {
  try {
    const { studentId } = req.query;
    const dispatches = owlsService.getRecentDispatches(studentId);
    return sendSuccess(res, dispatches, { total: dispatches.length });
  } catch (err) {
    next(err);
  }
};
