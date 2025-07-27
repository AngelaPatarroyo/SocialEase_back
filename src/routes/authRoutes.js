const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// ✅ Google OAuth Routes
router.get('/google', AuthController.googleOAuth);
router.get('/google/callback', AuthController.googleCallback);

module.exports = router;
