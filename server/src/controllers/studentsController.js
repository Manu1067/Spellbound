import * as studentsService from '../services/studentsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getStudents = (req, res, next) => {
  try {
    const { house, search, mentor, subject, skill } = req.query;
    const students = studentsService.getAllStudents({ house, search, mentor, subject, skill });
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

export const updateStudent = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = studentsService.updateStudent(id, req.body);

    if (!updated) {
      return sendError(res, `Student not found with ID '${id}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, updated, { message: 'Student dossier successfully inscribed.' });
  } catch (err) {
    next(err);
  }
};
