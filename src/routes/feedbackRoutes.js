const express = require('express');
const router = express.Router();

const FeedbackControllerMaybe = require('../controllers/feedbackController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Use instance or class export safely
const FeedbackController =
  typeof FeedbackControllerMaybe === 'function'
    ? new FeedbackControllerMaybe()
    : FeedbackControllerMaybe;

// sanity route so we can verify mount
router.get('/health', (req, res) => res.json({ ok: true }));

// GET /api/feedback/:userId
router.get('/:userId',
  authMiddleware,
  (req, res, next) => FeedbackController.getUserFeedback(req, res, next)
);

// POST /api/feedback
router.post('/',
  authMiddleware,
  (req, res, next) => FeedbackController.submit(req, res, next)
);

module.exports = router;
