const { body, param } = require('express-validator');

exports.updateProgressValidation = [
  body('scenarioId').isMongoId().withMessage('Valid scenarioId is required'),
  body('status').isIn(['completed', 'in-progress']).withMessage('Status must be completed or in-progress')
];

exports.paramUserIdValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];
