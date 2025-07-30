const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Email & Password Registration
router.post('/register', AuthController.register);

// Email & Password Login
router.post('/login', AuthController.login);

// Google OAuth Login/Register
router.get('/google', AuthController.googleOAuth);
router.get('/google/callback', AuthController.googleCallback);

// Logout (optional)
router.post('/logout', AuthController.logout); // optional: if you're clearing cookies/token

module.exports = router;
