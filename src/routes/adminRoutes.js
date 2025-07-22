const express = require('express');
const router = express.Router();
const { getAllFeedback, getAllProgress } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// Admin-only routes
router.get('/feedback', verifyToken, isAdmin, getAllFeedback);
router.get('/progress', verifyToken, isAdmin, getAllProgress);

module.exports = router;
