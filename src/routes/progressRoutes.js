const express = require('express');
const router = express.Router();

const ProgressController = require('../controllers/progressController');
const { updateProgressValidation, paramUserIdValidation } = require('../validators/progressValidator');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/update',
  authMiddleware,
  ...updateProgressValidation,
  validateRequest,
  ProgressController.updateProgress
);

router.get(
  '/:userId',
  authMiddleware,
  ...paramUserIdValidation,
  validateRequest,
  ProgressController.getUserProgress
);

module.exports = router;
