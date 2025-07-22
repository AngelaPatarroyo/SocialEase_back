const express = require('express');
const { getProgress, updateProgress } = require('../controllers/progressController');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, getProgress);

router.post('/update', [
  verifyToken,
  body('scenarioId').notEmpty().withMessage('Scenario ID is required'),
  body('points').isNumeric().withMessage('Points must be numeric')
], validateRequest, updateProgress);

module.exports = router;
