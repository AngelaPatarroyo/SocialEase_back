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
 *   description: Scenario Management, Completion Tracking, Adaptive Recommendations, and VR Support
 */

/** ------------------------
 *   CREATE SCENARIO
 * ------------------------ */
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
 *               vrSupported:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Scenario created successfully
 */
router.post('/', authMiddleware, createScenarioValidation, validateRequest, ScenarioController.createScenario);

/** ------------------------
 *   GET ALL SCENARIOS
 * ------------------------ */
router.get('/', authMiddleware, ScenarioController.getScenarios);

/** ------------------------
 *   ADAPTIVE SCENARIO (FR4)
 * ------------------------ */
/**
 * @swagger
 * /api/scenarios/adaptive:
 *   get:
 *     summary: Get an adaptive scenario recommendation
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Adaptive scenario fetched successfully
 */
router.get('/adaptive', authMiddleware, ScenarioController.getAdaptiveScenario);

/** ------------------------
 *   REPLAY SCENARIO (DR2)
 * ------------------------ */
/**
 * @swagger
 * /api/scenarios/{scenarioId}/replay:
 *   post:
 *     summary: Replay a completed scenario (practice mode)
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
 *         description: Scenario replayed successfully
 */
router.post('/:scenarioId/replay', authMiddleware, ScenarioController.replayScenario);

/** ------------------------
 *   SKIP SCENARIO (DR2)
 * ------------------------ */
/**
 * @swagger
 * /api/scenarios/skip:
 *   get:
 *     summary: Skip current scenario and fetch an alternative
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: currentId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: difficulty
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *     responses:
 *       200:
 *         description: Alternative scenario fetched successfully
 */
router.get('/skip', authMiddleware, ScenarioController.skipScenario);

/** ------------------------
 *   VR SCENARIOS (Luxury Feature)
 * ------------------------ */
/**
 * @swagger
 * /api/scenarios/vr:
 *   get:
 *     summary: Get all VR-compatible scenarios
 *     tags: [Scenarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of VR scenarios
 */
router.get('/vr', authMiddleware, ScenarioController.getVRScenarios);

/** ------------------------
 *   GET SCENARIO BY ID
 * ------------------------ */
router.get('/:id', authMiddleware, paramIdValidation, validateRequest, ScenarioController.getScenarioById);

/** ------------------------
 *   UPDATE SCENARIO
 * ------------------------ */
router.put('/:id', authMiddleware, paramIdValidation, createScenarioValidation, validateRequest, ScenarioController.updateScenario);

/** ------------------------
 *   DELETE SCENARIO
 * ------------------------ */
router.delete('/:id', authMiddleware, paramIdValidation, validateRequest, ScenarioController.deleteScenario);

/** ------------------------
 *   COMPLETE SCENARIO
 * ------------------------ */
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
 */
router.post('/:scenarioId/complete', authMiddleware, ScenarioController.completeScenario);

module.exports = router;
