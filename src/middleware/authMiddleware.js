const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT
 */
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('🔒 No token provided');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      console.log('⚠️ Invalid token payload:', decoded);
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    console.log('✅ JWT verified:', decoded);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware to restrict access to admin users only
 */
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = {
  authMiddleware,
  adminMiddleware
};
