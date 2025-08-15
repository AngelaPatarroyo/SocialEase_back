const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');
require('dotenv').config();

const app = express();

app.use(helmet());

const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Development-friendly rate limiting
// Set NODE_ENV=development in your .env file for higher rate limits
const isDevelopment = process.env.NODE_ENV === 'development';

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 2000 : 1000, // 2000 in dev, 1000 in production
  message: 'Too many requests from this IP, please try again later.',
});

// Apply global limiter to all routes except auth routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth')) {
    return next(); // Skip global rate limiting for auth routes
  }
  globalLimiter(req, res, next);
});

// Specific rate limiting for auth routes (very generous for development)
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 500 : 200, // 500 in dev, 200 in production
  message: 'Too many authentication requests, please try again later.',
}));

// Rate limiting for admin endpoints (higher limits for admin users)
app.use('/api/admin', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // 200 admin requests per 15 minutes
  message: 'Too many admin requests, please try again later.',
}));

// Rate limiting for user data endpoints
app.use('/api/user', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // 300 user requests per 15 minutes
  message: 'Too many user requests, please try again later.',
}));

// Rate limiting for scenario and progress endpoints
app.use('/api/scenarios', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400, // 400 scenario requests per 15 minutes
  message: 'Too many scenario requests, please try again later.',
}));

app.use('/api/progress', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400, // 400 progress requests per 15 minutes
  message: 'Too many progress requests, please try again later.',
}));

// Temporarily comment out rate limiting to debug login issue
// app.use('/api/auth/login', rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 15,
//   message: 'Too many login attempts, please try again later.',
// }));

const { swaggerUi, swaggerSpec } = require('./src/config/swagger');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes'); 
const scenarioRoutes = require('./src/routes/scenarioRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const selfAssessmentRoutes = require('./src/routes/selfAssessmentRoutes');
const cloudinaryRoutes = require('./src/routes/cloudinaryRoutes');
const goalRoutes = require('./src/routes/goalRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/self-assessment', selfAssessmentRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/goals', goalRoutes);



// Test endpoint removed to prevent errors

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple auth test endpoint
app.get('/auth-test', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Auth routes are accessible',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Not Found - ${req.originalUrl}` });
});

const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// Only connect to MongoDB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}

const PORT = process.env.PORT || 4000;

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the app for testing
module.exports = app;
