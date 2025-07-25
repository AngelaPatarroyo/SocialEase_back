const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');
const { createFeedbackValidation } = require('../validators/feedbackValidator');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: User feedback endpoints
 */

/**
 * @swagger
 * /api/feedback:
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
 *                 example: 5
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 */
router.post('/', authMiddleware, createFeedbackValidation, validateRequest, FeedbackController.submit);

/**
 * @swagger
 * /api/feedback/{userId}:
 *   get:
 *     summary: Get feedback submitted by a user
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
 *         description: List of feedback by user
 */
router.get('/:userId', authMiddleware, FeedbackController.getUserFeedback);

module.exports = router;
