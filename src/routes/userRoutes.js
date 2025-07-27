const express = require('express');
const UserController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { body } = require('express-validator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

// ✅ Validation for updating profile
const updateProfileValidation = [
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('avatar')
    .optional()
    .isString()
    .withMessage('Avatar must be a string'),
  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be either light or dark'),
];

// ✅ Validation for updating password
const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

// ✅ Routes
router.get('/profile', authMiddleware, UserController.getProfile);

router.put(
  '/profile',
  authMiddleware,
  updateProfileValidation,
  validateRequest,
  UserController.updateProfile
);

router.get('/dashboard', authMiddleware, UserController.getDashboard);

router.put(
  '/password',
  authMiddleware,
  updatePasswordValidation,
  validateRequest,
  UserController.updatePassword
);

module.exports = router;
