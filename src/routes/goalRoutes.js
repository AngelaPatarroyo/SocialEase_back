const express = require('express');
const router = express.Router();
const GoalController = require('../controllers/goalController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Goal-setting and reminders for users
 */

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create a new goal for the logged-in user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - target
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete 5 scenarios this week
 *               target:
 *                 type: number
 *                 example: 5
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-15
 *               reminder:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-10T09:00:00Z
 *     responses:
 *       201:
 *         description: Goal created successfully
 */
router.post('/', authMiddleware, GoalController.createGoal);

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get all goals for the logged-in user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user goals
 */
router.get('/', authMiddleware, GoalController.getGoals);

/**
 * @swagger
 * /api/goals/{goalId}/progress:
 *   put:
 *     summary: Update progress for a specific goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: goalId
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
 *               increment:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Goal progress updated successfully
 */
router.put('/:goalId/progress', authMiddleware, GoalController.updateGoalProgress);

/**
 * @swagger
 * /api/goals/{goalId}:
 *   delete:
 *     summary: Delete a specific goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: goalId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 */
router.delete('/:goalId', authMiddleware, GoalController.deleteGoal);

module.exports = router;
