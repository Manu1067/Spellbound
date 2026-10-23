import * as mysteriesService from '../services/mysteriesService.js';
import { sendSuccess, sendError } from '../utils/response.js';

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
