const express = require('express');
const router = express.Router();
const SelfAssessmentController = require('../controllers/selfAssessmentController');
const { selfAssessmentValidation } = require('../validators/selfAssessmentValidator');
const validateRequest = require('../middleware/validateRequest');
const { authMiddleware } = require('../middleware/authMiddleware');

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
 */
router.post('/', authMiddleware, selfAssessmentValidation, validateRequest, SelfAssessmentController.create);

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
 *         description: Self-assessment data
 */
router.get('/:userId', authMiddleware, SelfAssessmentController.getUserAssessment);

module.exports = router;
