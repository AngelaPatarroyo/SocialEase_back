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
 *   description: Track user scenario completion and achievements
 */

/**
 * @swagger
 * /api/progress/update:
 *   post:
 *     summary: Update user progress when completing a scenario
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scenarioId
 *             properties:
 *               scenarioId:
 *                 type: string
 *                 example: 64ad0fcb9d6b2e987d01f3c5
 *     responses:
 *       200:
 *         description: Progress updated successfully
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
 *                   example: Progress updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 64ad0fcb9d6b2e987d01f3a5
 *                     completedScenarios:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [64ad0fcb9d6b2e987d01f3c5]
 *                     achievements:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Getting Started", "Consistent Learner"]
 */
router.post('/update', authMiddleware, updateProgressValidation, validateRequest, ProgressController.updateProgress);

/**
 * @swagger
 * /api/progress/{userId}:
 *   get:
 *     summary: Get user's progress record (completed scenarios and achievements)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 64ad0fcb9d6b2e987d01f3a5
 *     responses:
 *       200:
 *         description: User's progress details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 64ad0fcb9d6b2e987d01f3a5
 *                     completedScenarios:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [64ad0fcb9d6b2e987d01f3c5, 64ad0fcb9d6b2e987d01f3c7]
 *                     achievements:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Getting Started", "Consistent Learner"]
 */
router.get('/:userId', authMiddleware, paramUserIdValidation, validateRequest, ProgressController.getUserProgress);

module.exports = router;
