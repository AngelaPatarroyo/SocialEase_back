const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());

// CORS Setup
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

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(globalLimiter);

// Logging with Morgan and Winston
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Body Parser
app.use(express.json());

// Login-specific Rate Limiter
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
}));

// Swagger Docs
const { swaggerUi, swaggerSpec } = require('./src/config/swagger');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const scenarioRoutes = require('./src/routes/scenarioRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const selfAssessmentRoutes = require('./src/routes/selfAssessmentRoutes');
const cloudinaryRoutes = require('./src/routes/cloudinaryRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/self-assessment', selfAssessmentRoutes);
app.use('/api/cloudinary', cloudinaryRoutes); 

// Test Route
app.get('/test', (req, res) => res.send('API is working ✅'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Not Found - ${req.originalUrl}` });
});

// Error Handler Middleware
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
