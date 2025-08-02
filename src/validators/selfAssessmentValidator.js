const { body, param } = require('express-validator');

exports.selfAssessmentValidation = [
  body('confidenceBefore').isInt({ min: 1, max: 10 }),
  body('confidenceAfter').isInt({ min: 1, max: 10 }),
  body('primaryGoal').notEmpty(),
  body('comfortZones').isArray({ min: 1 }),
  body('preferredScenarios').isArray({ min: 1 }),
  body('anxietyTriggers').isArray(),
  body('socialFrequency').isString().notEmpty(),
  body('communicationConfidence')
    .isString()
    .notEmpty()
];

exports.paramUserIdValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];
