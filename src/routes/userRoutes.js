// routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { body } = require('express-validator');

const router = express.Router();

// 🔒 Middleware validations
const updateProfileValidation = [
  body('name').optional().isString().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('avatar').optional().isString().withMessage('Avatar must be a string'),
  body('theme').optional().isIn(['light', 'dark']).withMessage('Theme must be either light or dark')
];

const updatePasswordValidation = [
  body('currentPassword').optional().isString().withMessage('Current password must be a string'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

// Profile
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, validateRequest, UserController.updateProfile);

// Dashboard
router.get('/dashboard', authMiddleware, UserController.getDashboard);

// Password
router.get('/password/status', authMiddleware, UserController.getPasswordStatus);
router.put('/password', authMiddleware, updatePasswordValidation, validateRequest, UserController.updatePassword);

// Delete account
router.delete('/delete', authMiddleware, UserController.deleteAccount);

// Badges
router.get('/badges', authMiddleware, UserController.getBadges);

module.exports = router;
