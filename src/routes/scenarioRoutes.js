const express = require('express');
const router = express.Router();
const ScenarioController = require('../controllers/scenarioController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, adminMiddleware, (req, res) => ScenarioController.create(req, res));
router.get('/', authMiddleware, (req, res) => ScenarioController.getAll(req, res));
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => ScenarioController.update(req, res));
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => ScenarioController.delete(req, res));

module.exports = router;
