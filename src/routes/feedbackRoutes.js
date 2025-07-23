const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback operations
 */

/**
 * @swagger
 * /api/feedback/submit:
 *   post:
 *     summary: Submit feedback for a scenario
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               scenarioId:
 *                 type: string
 *               reflection:
 *                 type: string
 *               rating:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Validation error
 */
router.post('/submit',
  authMiddleware,
  [
    body('userId').isMongoId().withMessage('Valid userId is required'),
    body('scenarioId').isMongoId().withMessage('Valid scenarioId is required'),
    body('reflection').isString().isLength({ min: 10 }).withMessage('Reflection must be at least 10 characters long'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
  ],
  validateRequest,
  (req, res) => FeedbackController.submit(req, res)
);

/**
 * @swagger
 * /api/feedback/{userId}:
 *   get:
 *     summary: Get all feedback by user
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of feedback
 */
router.get('/:userId',
  authMiddleware,
  [
    param('userId').isMongoId().withMessage('Valid userId is required')
  ],
  validateRequest,
  (req, res) => FeedbackController.getUserFeedback(req, res)
);

module.exports = router;
