/**
 * Standardized API response utilities
 */

export const sendSuccess = (res, data, meta = null, statusCode = 200) => {
  const payload = {
    success: true,
    data
  };

  if (meta !== null) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (res, message, code = 'BAD_REQUEST', statusCode = 400, details = null) => {
  const errorObj = {
    message,
    code
  };

  if (details && process.env.NODE_ENV !== 'production') {
    errorObj.details = details;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorObj
  });
};
