const express = require('express');
const router = express.Router();
const SelfAssessmentController = require('../controllers/selfAssessmentController');
const { selfAssessmentValidation, paramUserIdValidation } = require('../validators/selfAssessmentValidator');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: SelfAssessment
 *   description: Complete and retrieve self-assessments
 */

/**
 * @swagger
 * /api/self-assessment:
 *   post:
 *     summary: Complete self-assessment
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
 *                 example: medium
 *               primaryGoal:
 *                 type: string
 *                 example: Improve conversation skills
 *               comfortZones:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Work", "Friends"]
 *               preferredScenarios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Networking", "Public Speaking"]
 *               anxietyTriggers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Crowded places"]
 *               communicationConfidence:
 *                 type: number
 *                 example: 6
 *               socialFrequency:
 *                 type: string
 *                 example: weekly
 *     responses:
 *       201:
 *         description: Self-assessment completed successfully
 */
router.post('/', authMiddleware, selfAssessmentValidation, validateRequest, SelfAssessmentController.create);

/**
 * @swagger
 * /api/self-assessment/{userId}:
 *   get:
 *     summary: Get user's self-assessment
 *     tags: [SelfAssessment]
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
 *         description: Self-assessment details
 */
router.get('/:userId', authMiddleware, paramUserIdValidation, validateRequest, SelfAssessmentController.getUserAssessment);

module.exports = router;
