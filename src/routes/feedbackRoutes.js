const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/submit', authMiddleware, (req, res) => FeedbackController.submit(req, res));
router.get('/:userId', authMiddleware, (req, res) => FeedbackController.getUserFeedback(req, res));

module.exports = router;
