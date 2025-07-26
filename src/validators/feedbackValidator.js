const { body, param } = require('express-validator');

exports.createFeedbackValidation = [
  body('scenarioId').isMongoId().withMessage('Valid scenarioId is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('reflection').optional().isString().isLength({ max: 500 }).withMessage('Reflection cannot exceed 500 characters')
];

exports.paramUserIdValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];
