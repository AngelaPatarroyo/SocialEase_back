const express = require('express');
const router = express.Router();
const ScenarioController = require('../controllers/scenarioController');
const { createScenarioValidation, paramIdValidation } = require('../validators/scenarioValidator');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Scenarios
 *   description: Scenario Management and Completion Tracking
 */

/**
 * @swagger
 * /api/scenarios:
 *   post:
 *     summary: Create a new scenario
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Public Speaking Practice
 *               description:
 *                 type: string
 *                 example: Improve confidence by speaking in a group
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               points:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Scenario created successfully
 */
router.post('/', authMiddleware, createScenarioValidation, validateRequest, ScenarioController.createScenario);

/**
 * @swagger
 * /api/scenarios:
 *   get:
 *     summary: Get all scenarios
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all scenarios
 */
router.get('/', authMiddleware, ScenarioController.getScenarios);

/**
 * @swagger
 * /api/scenarios/{id}:
 *   get:
 *     summary: Get scenario by ID
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scenario details
 */
router.get('/:id', authMiddleware, paramIdValidation, validateRequest, ScenarioController.getScenarioById);

/**
 * @swagger
 * /api/scenarios/{id}:
 *   put:
 *     summary: Update scenario
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               points:
 *                 type: number
 *     responses:
 *       200:
 *         description: Scenario updated successfully
 */
router.put('/:id', authMiddleware, paramIdValidation, createScenarioValidation, validateRequest, ScenarioController.updateScenario);

/**
 * @swagger
 * /api/scenarios/{id}:
 *   delete:
 *     summary: Delete a scenario
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scenario deleted successfully
 */
router.delete('/:id', authMiddleware, paramIdValidation, validateRequest, ScenarioController.deleteScenario);

/**
 * @swagger
 * /api/scenarios/{scenarioId}/complete:
 *   post:
 *     summary: Mark scenario as completed and award XP
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: scenarioId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scenario completed and XP awarded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Scenario completed! You earned 50 XP and your progress has been updated.
 */
router.post('/:scenarioId/complete', authMiddleware, ScenarioController.completeScenario);

module.exports = router;
