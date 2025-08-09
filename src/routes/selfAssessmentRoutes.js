// routes/selfAssessmentRoutes.js
const express = require('express');
const router = express.Router();

const SelfAssessmentController = require('../controllers/selfAssessmentController'); // keep your filename case
const { selfAssessmentValidation, paramUserIdValidation } = require('../validators/selfAssessmentValidator');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: SelfAssessment
 *   description: Complete and retrieve self-assessments
 */

router.post(
  '/',
  authMiddleware,
  selfAssessmentValidation,
  validateRequest,
  SelfAssessmentController.create
);

router.get(
  '/',
  authMiddleware,
  SelfAssessmentController.getCurrentUserAssessment
);

router.get(
  '/:userId',
  authMiddleware,
  paramUserIdValidation,
  validateRequest,
  SelfAssessmentController.getUserAssessment
);

module.exports = router;
