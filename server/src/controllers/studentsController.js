import * as studentsService from '../services/studentsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getStudents = (req, res, next) => {
  try {
    const { house, branch, language, hobby, interest, search } = req.query;
    const students = studentsService.getAllStudents({
      house,
      branch,
      language,
      hobby,
      interest,
      search
    });
    return sendSuccess(res, students, { total: students.length });
  } catch (err) {
    next(err);
  }
};

export const getStudentById = (req, res, next) => {
  try {
    const { id } = req.params;
    const student = studentsService.getStudentById(id);

    if (!student) {
      return sendError(res, `Student not found with ID '${id}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, student);
  } catch (err) {
    next(err);
  }
};

export const getCurrentStudent = (req, res, next) => {
  try {
    const current = studentsService.getCurrentStudent();
    if (!current) {
      return sendError(res, 'Current student profile not found', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, current);
  } catch (err) {
    next(err);
  }
};

export const getLikeMindedStudents = (req, res, next) => {
  try {
    const { studentId, minScore } = req.query;
    const result = studentsService.findLikeMindedStudents({
      studentId: studentId || 'student-aris-thorne',
      minScore: minScore ? parseInt(minScore, 10) : 1
    });
    return sendSuccess(res, result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};
