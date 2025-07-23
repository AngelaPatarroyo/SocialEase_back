const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');
require('dotenv').config();

// Routes
const authRoutes = require('./src/routes/authRoutes');
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
app.use(cors({ origin: ['http://yourfrontend.com'], credentials: true }));

//  Logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

//  JSON parser
app.use(express.json());

//  Rate limit login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.'
});
app.use('/api/auth/login', loginLimiter);

//  Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//  Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/self-assessment', selfAssessmentRoutes);

//  Test route
app.get('/test', (req, res) => res.send('API is working'));

//  404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

//  Global error handler
app.use(errorHandler);

//  MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// ✅ Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
