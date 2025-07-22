const express = require('express');
const { createFeedback, getScenarioFeedback } = require('../controllers/feedbackController');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.post('/', [
  verifyToken,
  body('scenarioId').notEmpty().withMessage('Scenario ID is required'),
  body('comments').notEmpty().withMessage('Comments are required'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], validateRequest, createFeedback);

router.get('/:scenarioId', verifyToken, isAdmin, getScenarioFeedback);

module.exports = router;
