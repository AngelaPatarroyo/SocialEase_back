// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const AppError = require('../utils/errors');

exports.authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return next(new AppError('Missing or invalid Authorization header', 401));
    }

    const token = header.split(' ')[1];
    if (!token) {
      return next(new AppError('Token not provided', 401));
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return next(new AppError('Invalid or expired token', 401));
    }

    // attach user (normalize shape your controllers expect)
    req.user = {
      id: payload.id || payload.userId || payload.sub,
      role: payload.role // Extract role for admin middleware
    };

    if (!req.user.id) {
      return next(new AppError('Token payload missing user id', 403));
    }

    next();
  } catch (err) {
    next(new AppError('Authentication error', 401));
  }
};
