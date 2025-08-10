const express = require('express');
const router = express.Router();

const ProgressController = require('../controllers/progressController');
const { updateProgressValidation, paramUserIdValidation } = require('../validators/progressValidator');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// TEMP debug – helps spot payload issues; remove after it’s fixed
router.post('/update', (req, _res, next) => { 
  console.log('[POST /api/progress/update] body:', req.body); 
  next(); 
});

router.post(
  '/update',
  authMiddleware,
  ...updateProgressValidation,   // spread!
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
