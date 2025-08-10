const { body, param } = require('express-validator');

function toArray(v) {
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (v == null || v === '') return [];
  return [String(v)];
}

function mapSocialFrequency(v) {
  if (!v) return 'rarely';
  const s = String(v).toLowerCase().trim();
  if (['rarely', 'sometimes', 'often', 'daily'].includes(s)) return s;
  if (['never', 'seldom', 'hardly'].includes(s)) return 'rarely';
  if (['occasionally', 'monthly', 'weekly'].includes(s)) return 'sometimes';
  if (['frequently'].includes(s)) return 'often';
  if (['everyday', 'each day'].includes(s)) return 'daily';
  return 'rarely';
}

function mapCommConfidence(v) {
  if (v === '' || v == null) return v;
  const n = Number(v);
  if (Number.isFinite(n)) return Math.max(0, Math.min(10, n));
  const s = String(v).toLowerCase().trim();
  if (['very low', 'very_low', 'vlow'].includes(s)) return 2;
  if (['low'].includes(s)) return 3;
  if (['med', 'medium', 'avg', 'average'].includes(s)) return 5;
  if (['high'].includes(s)) return 8;
  if (['very high', 'very_high', 'vhigh'].includes(s)) return 9;
  return 5; // safe default
}

exports.selfAssessmentValidation = [
  body('confidenceBefore')
    .customSanitizer(v => Number(v))
    .isInt({ min: 0, max: 100 }),
  body('confidenceAfter')
    .customSanitizer(v => Number(v))
    .isInt({ min: 0, max: 100 }),

  body('primaryGoal').trim().notEmpty(),

  body('comfortZones')
    .customSanitizer(toArray)
    .isArray({ min: 1 }),

  body('preferredScenarios')
    .customSanitizer(toArray)
    .isArray({ min: 1 }),

  body('anxietyTriggers')
    .customSanitizer(toArray)
    .isArray(),

  body('socialFrequency')
    .customSanitizer(mapSocialFrequency)
    .isString()
    .notEmpty(),

  // KEY FIX: map string → number (0..10), then validate as int
  body('communicationConfidence')
    .customSanitizer(mapCommConfidence)
    .isInt({ min: 0, max: 10 }),
];

exports.paramUserIdValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
];
