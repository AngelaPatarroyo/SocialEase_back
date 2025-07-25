const { body } = require('express-validator');

exports.createFeedbackValidation = [
  body('scenarioId').notEmpty().withMessage('Scenario ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 250 }).withMessage('Comment cannot exceed 250 characters')
];
