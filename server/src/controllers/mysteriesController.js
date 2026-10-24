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

export const getMysteryArchives = (req, res, next) => {
  try {
    const { chamber, difficulty, search, subject, topic, resourceType, rarity } = req.query;
    const archives = mysteriesService.getMysteryArchives({
      chamber,
      difficulty,
      search,
      subject,
      topic,
      resourceType,
      rarity
    });
    return sendSuccess(res, archives, { total: archives.length });
  } catch (err) {
    next(err);
  }
};

export const getResourceById = (req, res, next) => {
  try {
    const { id } = req.params;
    const resource = mysteriesService.getResourceById(id);
    if (!resource) {
      return sendError(res, `Learning resource not found with ID '${id}'`, 'NOT_FOUND', 404);
    }
    return sendSuccess(res, resource);
  } catch (err) {
    next(err);
  }
};

export const getArchiveFilters = (req, res, next) => {
  try {
    const filters = mysteriesService.getArchiveFilters();
    return sendSuccess(res, filters);
  } catch (err) {
    next(err);
  }
};

export const getRecommendations = (req, res, next) => {
  try {
    const { studentId } = req.query;
    const recs = mysteriesService.getRecommendations(studentId);
    return sendSuccess(res, recs);
  } catch (err) {
    next(err);
  }
};

export const queryArchivalScribe = (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return sendError(res, 'Prompt or query topic is required for the Archival Scribe.', 'VALIDATION_ERROR', 400);
    }
    const result = mysteriesService.queryArchivalScribe(prompt);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};
