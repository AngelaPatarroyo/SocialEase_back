const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progressController');
const { updateProgressValidation, paramUserIdValidation } = require('../validators/progressValidator');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Track user scenario progress
 */

/**
 * @swagger
 * /api/progress/update:
 *   post:
 *     summary: Update user progress for a scenario
 *     tags: [Progress]
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
 *               status:
 *                 type: string
 *                 enum: [completed, in-progress]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Progress updated successfully
 */
router.post('/update', authMiddleware, updateProgressValidation, validateRequest, ProgressController.updateProgress);

/**
 * @swagger
 * /api/progress/{userId}:
 *   get:
 *     summary: Get user's progress history
 *     tags: [Progress]
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
 *         description: List of user's progress
 */
router.get('/:userId', authMiddleware, paramUserIdValidation, validateRequest, ProgressController.getUserProgress);

module.exports = router;
