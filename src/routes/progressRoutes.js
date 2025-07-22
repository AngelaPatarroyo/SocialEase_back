const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progressController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/update', authMiddleware, (req, res) => ProgressController.updateProgress(req, res));
router.get('/:userId', authMiddleware, (req, res) => ProgressController.getProgress(req, res));

module.exports = router;
