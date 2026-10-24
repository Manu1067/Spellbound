import * as coursesService from '../services/coursesService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getCourses = (req, res, next) => {
  try {
    const { term } = req.query;
    const courses = coursesService.getAllCourses({ term });
    return sendSuccess(res, courses, { total: courses.length });
  } catch (err) {
    next(err);
  }
};

export const getCourseByCode = (req, res, next) => {
  try {
    const { code } = req.params;
    const course = coursesService.getCourseByCode(code.toUpperCase());

    if (!course) {
      return sendError(res, `Course not found with code '${code}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, course);
  } catch (err) {
    next(err);
  }
};

export const getCourseResources = (req, res, next) => {
  try {
    const { code } = req.params;
    const resources = coursesService.getCourseResources(code.toUpperCase());
    return sendSuccess(res, resources, { total: resources.length });
  } catch (err) {
    next(err);
  }
};

export const getAllResources = (req, res, next) => {
  try {
    const { search, rarity, type } = req.query;
    const resources = coursesService.getAllResources({ search, rarity, type });
    return sendSuccess(res, resources, { total: resources.length });
  } catch (err) {
    next(err);
  }
};

export const getPotionIngredients = (req, res, next) => {
  try {
    const ingredients = coursesService.getPotionIngredients();
    return sendSuccess(res, ingredients, { total: ingredients.length });
  } catch (err) {
    next(err);
  }
};

export const brewPotion = (req, res, next) => {
  try {
    const { studentId, ingredientIds, heatLevel, stirDirection } = req.body;
    if (!ingredientIds || !Array.isArray(ingredientIds) || ingredientIds.length === 0) {
      return sendError(res, 'At least one potion ingredient must be added to the cauldron.', 'BAD_REQUEST', 400);
    }
    const result = coursesService.brewPotion({ studentId, ingredientIds, heatLevel, stirDirection });
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const submitQuiz = (req, res, next) => {
  try {
    const { studentId, courseCode, answers } = req.body;
    if (!courseCode) {
      return sendError(res, 'Course code is required to grade quiz.', 'BAD_REQUEST', 400);
    }
    const result = coursesService.submitQuiz({ studentId, courseCode, answers });
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const getStudentProgress = (req, res, next) => {
  try {
    const { studentId } = req.params;
    const progress = coursesService.getStudentProgress(studentId);
    return sendSuccess(res, progress);
  } catch (err) {
    next(err);
  }
};
