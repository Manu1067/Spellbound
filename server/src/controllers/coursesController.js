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
