module.exports = function (req, res, next) {
  console.log(`🔒 [AdminMiddleware] Checking admin access for user:`, {
    id: req.user.id,
    role: req.user.role,
    isAdmin: req.user.role === 'admin'
  });
  
  if (req.user.role !== 'admin') {
      console.log(`❌ [AdminMiddleware] Access denied for user ${req.user.id} with role ${req.user.role}`);
      return res.status(403).json({ message: 'Access denied: Admin only' });
  }
  
  console.log(`✅ [AdminMiddleware] Admin access granted for user ${req.user.id}`);
  next();
};
