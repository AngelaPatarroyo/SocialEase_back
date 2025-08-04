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
 * /api/user/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update the current user's profile
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
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *     responses:
 *       200:
 *         description: Successfully updated profile
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Update the current user's password
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
 *       400:
 *         description: Validation or update error
 */

/**
 * @swagger
 * /api/user/dashboard:
 *   get:
 *     summary: Get user's dashboard data
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Delete user account and all associated data
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User and related data deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

// 🔒 Middleware validations
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

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
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

//  Delete account
router.delete(
  '/delete',
  authMiddleware,
  UserController.deleteAccount
);

module.exports = router;
