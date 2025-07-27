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

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /user/dashboard:
 *   get:
 *     summary: Get user's personal dashboard (XP, streak, badges, progress)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /user/password:
 *   put:
 *     summary: Update user password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 */

//  Validation for updating profile
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
    .withMessage('Theme must be either light or dark')
];

//  Validation for updating password
const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

//  Routes
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
