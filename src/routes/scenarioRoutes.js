const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ScenarioController = require('../controllers/scenarioController');
const { authMiddleware } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Scenarios
 *   description: Scenario management
 */

/**
 * @swagger
 * /api/scenarios:
 *   get:
 *     summary: Get all scenarios
 *     tags: [Scenarios]
 *     responses:
 *       200:
 *         description: List of scenarios
 */
router.get('/', authMiddleware, (req, res) => ScenarioController.getAllScenarios(req, res));

/**
 * @swagger
 * /api/scenarios:
 *   post:
 *     summary: Create a new scenario (Admin only)
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
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               points:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Scenario created successfully
 *       403:
 *         description: Admin only
 */
router.post('/',
  authMiddleware,
  isAdmin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer')
  ],
  validateRequest,
  (req, res) => ScenarioController.createScenario(req, res)
);

/**
 * @swagger
 * /api/scenarios/{id}:
 *   put:
 *     summary: Update a scenario (Admin only)
 *     tags: [Scenarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scenario updated successfully
 */
router.put('/:id', authMiddleware, isAdmin, (req, res) => ScenarioController.updateScenario(req, res));

/**
 * @swagger
 * /api/scenarios/{id}:
 *   delete:
 *     summary: Delete a scenario (Admin only)
 *     tags: [Scenarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Scenario deleted successfully
 */
router.delete('/:id', authMiddleware, isAdmin, (req, res) => ScenarioController.deleteScenario(req, res));

module.exports = router;
