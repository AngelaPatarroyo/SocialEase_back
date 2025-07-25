const { body } = require('express-validator');

exports.createScenarioValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard')
];
