const express = require('express');
const { getScenarios, createScenario, updateScenario, deleteScenario } = require('../controllers/scenarioController');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/', verifyToken, getScenarios);

router.post('/', [
  verifyToken,
  isAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('points').isNumeric().withMessage('Points must be a number')
], validateRequest, createScenario);

router.put('/:id', [
  verifyToken,
  isAdmin,
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('points').optional().isNumeric()
], validateRequest, updateScenario);

router.delete('/:id', verifyToken, isAdmin, deleteScenario);

module.exports = router;
