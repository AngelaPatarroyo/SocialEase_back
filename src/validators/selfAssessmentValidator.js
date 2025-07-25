const { body } = require('express-validator');

exports.selfAssessmentValidation = [
  body('socialLevel')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Social level must be low, medium, or high'),
  body('primaryGoal')
    .optional()
    .isString().withMessage('Primary goal must be a string'),
  body('comfortZones')
    .optional()
    .isArray().withMessage('Comfort zones must be an array'),
  body('preferredScenarios')
    .optional()
    .isArray().withMessage('Preferred scenarios must be an array'),
  body('anxietyTriggers')
    .optional()
    .isArray().withMessage('Anxiety triggers must be an array'),
  body('communicationConfidence')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Communication confidence must be between 1 and 10'),
  body('socialFrequency')
    .optional()
    .isString().withMessage('Social frequency must be a string')
];
