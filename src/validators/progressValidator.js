const { body, param } = require('express-validator');
const { Types } = require('mongoose');

const isObjectIdOrSlug = (v) => {
  const s = String(v ?? '').trim();
  if (Types.ObjectId.isValid(s)) return true;
  return /^[a-z0-9-]{3,64}$/.test(s); // simple slug pattern
};

exports.updateProgressValidation = [
  body('scenarioId')
    .exists().withMessage('scenarioId is required')
    .bail()
    .custom(isObjectIdOrSlug).withMessage('scenarioId must be a MongoId or slug'),

  // status is optional; keep if you use it
  body('status')
    .optional()
    .isIn(['completed', 'in-progress'])
    .withMessage('status must be completed or in-progress')
];

exports.paramUserIdValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];
