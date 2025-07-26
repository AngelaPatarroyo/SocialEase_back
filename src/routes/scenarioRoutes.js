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
 *   description: Scenario Management
 */

/**
 * @swagger
 * /api/scenarios:
 *   post:
 *     summary: Create a scenario
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
 *         description: List of scenarios
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
 */
router.put('/:id', authMiddleware, paramIdValidation, createScenarioValidation, validateRequest, ScenarioController.updateScenario);

/**
 * @swagger
 * /api/scenarios/{id}:
 *   delete:
 *     summary: Delete scenario
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authMiddleware, paramIdValidation, validateRequest, ScenarioController.deleteScenario);

module.exports = router;
