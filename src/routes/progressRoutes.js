const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const ProgressController = require('../controllers/progressController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Progress tracking endpoints
 */

/**
 * @swagger
 * /api/progress/update:
 *   post:
 *     summary: Update user progress after completing a scenario
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
 *               userId:
 *                 type: string
 *               scenarioId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [completed, pending]
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Validation error
 */
router.post('/update',
  authMiddleware,
  [
    body('userId').isMongoId().withMessage('Valid userId is required'),
    body('scenarioId').isMongoId().withMessage('Valid scenarioId is required'),
    body('status').isIn(['completed', 'pending']).withMessage('Status must be either completed or pending')
  ],
  validateRequest,
  (req, res) => ProgressController.updateProgress(req, res)
);

/**
 * @swagger
 * /api/progress/{userId}:
 *   get:
 *     summary: Get progress data for a specific user
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
 *         description: Progress data retrieved successfully
 *       400:
 *         description: Validation error
 */
router.get('/:userId',
  authMiddleware,
  [
    param('userId').isMongoId().withMessage('Valid userId is required')
  ],
  validateRequest,
  (req, res) => ProgressController.getProgress(req, res)
);

module.exports = router;
