const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');
const { createFeedbackValidation, paramUserIdValidation } = require('../validators/feedbackValidator');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Submit and view feedback for scenarios
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
 *               scenarioId:
 *                 type: string
 *                 example: 64ad0fcb9d6b2e987d01f3c5
 *               reflection:
 *                 type: string
 *                 example: "This scenario helped improve my confidence"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Feedback submitted successfully. 10 XP added.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64ad0fcb9d6b2e987d01f3e0
 *                     scenarioId:
 *                       type: string
 *                       example: 64ad0fcb9d6b2e987d01f3c5
 *                     reflection:
 *                       type: string
 *                       example: "This scenario helped improve my confidence"
 *                     rating:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Validation error
 */
router.post('/', authMiddleware, createFeedbackValidation, validateRequest, FeedbackController.submit);

/**
 * @swagger
 * /api/feedback/{userId}:
 *   get:
 *     summary: Get all feedback submitted by a user
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
 *         description: List of feedback entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       scenarioId:
 *                         type: string
 *                         example: 64ad0fcb9d6b2e987d01f3c5
 *                       reflection:
 *                         type: string
 *                         example: "This scenario helped improve my confidence"
 *                       rating:
 *                         type: integer
 *                         example: 5
 *       404:
 *         description: No feedback found
 */
router.get('/:userId', authMiddleware, paramUserIdValidation, validateRequest, FeedbackController.getUserFeedback);

module.exports = router;
