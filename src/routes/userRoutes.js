const express = require('express');
const UserController = require('../controllers/userController'); // Import instance
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64ab1d2b9d6b2e987d01f3a5
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     avatar:
 *                       type: string
 *                       example: default-avatar.png
 *                     theme:
 *                       type: string
 *                       example: light
 *                     xp:
 *                       type: number
 *                       example: 120
 *                     level:
 *                       type: number
 *                       example: 2
 *                     streak:
 *                       type: number
 *                       example: 3
 *                     badges:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Getting Started", "Consistent Learner"]
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *
 *   put:
 *     summary: Update logged-in user's profile
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
 *                 example: Jane Doe
 *               avatar:
 *                 type: string
 *                 example: custom-avatar.png
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *                 example: dark
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */

//  Validation rules for updating profile
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

//  Routes
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, validateRequest, UserController.updateProfile);

module.exports = router;
