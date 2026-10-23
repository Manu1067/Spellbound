import config from '../config/index.js';
import { sendError } from '../utils/response.js';

export const notFoundHandler = (req, res, next) => {
  return sendError(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    'NOT_FOUND',
    404
  );
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Arcane Server Error';
  const code = err.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');

  // Log error safely on server side
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  const details = config.isProduction ? null : err.stack;
  return sendError(res, message, code, statusCode, details);
};

export default errorHandler;
