const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const scenarioRoutes = require('./src/routes/scenarioRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const selfAssessmentRoutes = require('./src/routes/selfAssessmentRoutes');

const { swaggerUi, swaggerSpec } = require('./src/config/swagger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

//  Security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://yourfrontend.com', credentials: true }));

//  Global Rate Limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}));

//  Logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

//  JSON Parser
app.use(express.json());

//  Login Rate Limiter
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.'
}));

//  Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/self-assessment', selfAssessmentRoutes);

//  Test Route
app.get('/test', (req, res) => res.send('API is working'));

//  404 Handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Not Found - ${req.originalUrl}` });
});

//  Error Handler Middleware
app.use(errorHandler);

//  MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(' MongoDB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
