const express = require('express');
const router = express.Router();
const { getScenarios, createScenario, updateScenario, deleteScenario } = require('../controllers/scenarioController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', verifyToken, getScenarios);
router.post('/', verifyToken, isAdmin, createScenario);
router.put('/:id', verifyToken, isAdmin, updateScenario);
router.delete('/:id', verifyToken, isAdmin, deleteScenario);

module.exports = router;
