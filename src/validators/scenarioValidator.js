const { body, param } = require('express-validator');

exports.createScenarioValidation = [
  body('title').isString().notEmpty().withMessage('Title is required').isLength({ min: 5 }),
  body('description').isString().notEmpty().withMessage('Description is required').isLength({ min: 10 }),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard')
];

exports.paramIdValidation = [
  param('id').isMongoId().withMessage('Invalid scenario ID')
];
