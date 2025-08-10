const { body, param } = require('express-validator');
const { Types } = require('mongoose');

const isObjectIdOrSlug = (v) => {
  const s = String(v ?? '').trim();
  if (Types.ObjectId.isValid(s)) return true;
  return /^[a-z0-9-]{3,64}$/.test(s);
};

exports.createFeedbackValidation = [
  body('scenarioId')
    .exists().withMessage('scenarioId is required')
    .bail()
    .custom(isObjectIdOrSlug).withMessage('scenarioId must be an ObjectId or slug'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('reflection').isString().trim().isLength({ min: 1, max: 500 })
    .withMessage('Reflection 1–500 chars'),
];

exports.paramUserIdValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
];
