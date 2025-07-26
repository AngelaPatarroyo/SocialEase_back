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
 *     summary: Complete a self-assessment and award XP
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
 *         description: Self-assessment completed successfully and XP awarded
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
 *                   example: Self-assessment completed successfully. 5 XP added.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64ad0fcb9d6b2e987d01f3c9
 *                     socialLevel:
 *                       type: string
 *                       example: medium
 *                     primaryGoal:
 *                       type: string
 *                       example: Improve conversation skills
 *                     comfortZones:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Work", "Friends"]
 *                     preferredScenarios:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Networking", "Public Speaking"]
 *                     anxietyTriggers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Crowded places"]
 *                     communicationConfidence:
 *                       type: number
 *                       example: 6
 *                     socialFrequency:
 *                       type: string
 *                       example: weekly
 */
router.post('/', authMiddleware, selfAssessmentValidation, validateRequest, SelfAssessmentController.create);

/**
 * @swagger
 * /api/self-assessment/{userId}:
 *   get:
 *     summary: Get all self-assessments completed by a user
 *     tags: [SelfAssessment]
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
 *         description: List of user's self-assessments
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
 *                       id:
 *                         type: string
 *                         example: 64ad0fcb9d6b2e987d01f3c9
 *                       socialLevel:
 *                         type: string
 *                         example: medium
 *                       primaryGoal:
 *                         type: string
 *                         example: Improve conversation skills
 */
router.get('/:userId', authMiddleware, paramUserIdValidation, validateRequest, SelfAssessmentController.getUserAssessment);

module.exports = router;
