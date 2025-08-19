const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
