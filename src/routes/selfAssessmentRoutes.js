const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const SelfAssessmentController = require('../controllers/selfAssessmentController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: SelfAssessment
 *   description: User self-assessment endpoints
 */

/**
 * @swagger
 * /api/self-assessment:
 *   post:
 *     summary: Complete self-assessment after registration
 *     tags: [SelfAssessment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               socialLevel:
 *                 type: string
 *                 enum: [low, medium, high]
 *               primaryGoal:
 *                 type: string
 *               comfortZones:
 *                 type: array
 *                 items:
 *                   type: string
 *               preferredScenarios:
 *                 type: array
 *                 items:
 *                   type: string
 *               anxietyTriggers:
 *                 type: array
 *                 items:
 *                   type: string
 *               communicationConfidence:
 *                 type: number
 *               socialFrequency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Self-assessment completed
 *       400:
 *         description: Validation error
 */
router.post('/',
  authMiddleware,
  [
    body('socialLevel').isIn(['low', 'medium', 'high']).withMessage('Invalid social level'),
    body('primaryGoal').isString().optional(),
    body('comfortZones').isArray().optional(),
    body('preferredScenarios').isArray().optional(),
    body('anxietyTriggers').isArray().optional(),
    body('communicationConfidence').isInt({ min: 1, max: 10 }).optional(),
    body('socialFrequency').isString().optional()
  ],
  validateRequest,
  (req, res, next) => SelfAssessmentController.create(req, res, next)
);

/**
 * @swagger
 * /api/self-assessment/{userId}:
 *   get:
 *     summary: Get self-assessment for a user
 *     tags: [SelfAssessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: User self-assessment
 */
router.get('/:userId',
  authMiddleware,
  (req, res, next) => SelfAssessmentController.getUserAssessment(req, res, next)
);

module.exports = router;
