const { body } = require('express-validator');

exports.updateProgressValidation = [
  body('scenarioId').notEmpty().withMessage('Scenario ID is required'),
  body('status')
    .isIn(['completed', 'in-progress']).withMessage('Status must be completed or in-progress')
];
