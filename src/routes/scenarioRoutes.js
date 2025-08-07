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
router.post('/', authMiddleware, createScenarioValidation, validateRequest, ScenarioController.createScenario);

/** ------------------------
 *   GET ALL SCENARIOS
 * ------------------------ */
router.get('/', authMiddleware, ScenarioController.getScenarios);

/** ------------------------
 *   GET ADAPTIVE SCENARIO (FR4)
 * ------------------------ */
router.get('/adaptive', authMiddleware, ScenarioController.getAdaptiveScenario);

/** ------------------------
 *   REPLAY SCENARIO (DR2)
 * ------------------------ */
router.post('/:scenarioId/replay', authMiddleware, ScenarioController.replayScenario);

/** ------------------------
 *   SKIP SCENARIO (DR2)
 * ------------------------ */
router.get('/skip', authMiddleware, ScenarioController.skipScenario);

/** ------------------------
 *   GET VR SCENARIOS (Luxury Feature)
 * ------------------------ */
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
router.post('/:scenarioId/complete', authMiddleware, ScenarioController.completeScenario);

/** ------------------------
 *   SAVE SCENARIO PREPARATION (New)
 * ------------------------ */
router.post('/preparation', authMiddleware, ScenarioController.savePreparation);

module.exports = router;
