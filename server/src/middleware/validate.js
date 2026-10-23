import { sendError } from '../utils/response.js';

export const validateRequiredFields = (fields, source = 'body') => {
  return (req, res, next) => {
    const data = req[source] || {};
    const missing = [];

    for (const field of fields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return sendError(
        res,
        `Missing required ${source} fields: ${missing.join(', ')}`,
        'VALIDATION_ERROR',
        400
      );
    }

    next();
  };
};
