const express = require('express');
const router = express.Router();
const ScenarioController = require('../controllers/scenarioController');
const { createScenarioValidation } = require('../validators/scenarioValidator');
const validateRequest = require('../middleware/validateRequest');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Scenarios
 *   description: Manage scenarios
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
 *                 example: A scenario to practice speaking in front of an audience
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: medium
 *     responses:
 *       201:
 *         description: Scenario created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  createScenarioValidation,
  validateRequest,
  ScenarioController.createScenario
);

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
 *         description: List of scenarios retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, ScenarioController.getScenarios);

/**
 * @swagger
 * /api/scenarios/{id}:
 *   get:
 *     summary: Get a scenario by ID
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
 *       404:
 *         description: Scenario not found
 */
router.get('/:id', authMiddleware, ScenarioController.getScenarioById);

/**
 * @swagger
 * /api/scenarios/{id}:
 *   put:
 *     summary: Update an existing scenario
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
 *                 example: Updated Scenario Title
 *               description:
 *                 type: string
 *                 example: Updated description for scenario
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       200:
 *         description: Scenario updated successfully
 *       404:
 *         description: Scenario not found
 */
router.put(
  '/:id',
  authMiddleware,
  createScenarioValidation,
  validateRequest,
  ScenarioController.updateScenario
);

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
 *       404:
 *         description: Scenario not found
 */
router.delete('/:id', authMiddleware, ScenarioController.deleteScenario);

module.exports = router;
