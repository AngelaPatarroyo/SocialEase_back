const express = require('express');
const UserController = require('../controllers/userController'); // Import instance
const { authMiddleware } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules for updating profile
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
    .withMessage('Avatar must be a string (URL or identifier)'),
  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be either light or dark')
];

// @route   GET /api/user/profile
// @desc    Get logged-in user profile
// @access  Private
router.get('/profile', authMiddleware, UserController.getProfile);

// @route   PUT /api/user/profile
// @desc    Update logged-in user profile
// @access  Private
router.put('/profile', authMiddleware, updateProfileValidation, validateRequest, UserController.updateProfile);

module.exports = router;
