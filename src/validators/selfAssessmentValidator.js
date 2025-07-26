const { body, param } = require('express-validator');

exports.selfAssessmentValidation = [
  body('socialLevel').isIn(['low', 'medium', 'high']).withMessage('Social level must be low, medium, or high'),
  body('primaryGoal').optional().isString(),
  body('comfortZones').optional().isArray(),
  body('preferredScenarios').optional().isArray(),
  body('anxietyTriggers').optional().isArray(),
  body('communicationConfidence').optional().isInt({ min: 1, max: 10 }),
  body('socialFrequency').optional().isString()
];

exports.paramUserIdValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];
