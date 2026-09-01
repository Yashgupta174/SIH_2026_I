const logger = require('../utils/logger');

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log exact technical traceback internally
  logger.error(`API Error [${req.method} ${req.originalUrl}]: ${err.message}`, {
    stack: err.stack,
    statusCode: err.statusCode,
    user: req.user?.id,
  });

  if (process.env.NODE_ENV === 'development' || req.headers['x-debug']) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Patient / User-friendly sanitized error response
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Generic fallback for unhandled technical/DB errors
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again or ask hospital staff for assistance.',
  });
};

module.exports = globalErrorHandler;
