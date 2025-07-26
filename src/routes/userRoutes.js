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
 *     responses:
 *       200:
 *         description: Dashboard fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Your personal progress dashboard
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         xp:
 *                           type: number
 *                           example: 450
 *                         level:
 *                           type: number
 *                           example: 3
 *                         streak:
 *                           type: number
 *                           example: 5
 *                         badges:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Feedback Champ", "Consistency Hero"]
 *                     progress:
 *                       type: object
 *                       properties:
 *                         completedScenariosCount:
 *                           type: number
 *                           example: 7
 *                         recentScenarios:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["scenarioId1", "scenarioId2"]
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["You're on a 5-day streak! Great consistency."]
 */

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
    .withMessage('Avatar must be a string'),
  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be either light or dark')
];

// Routes
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, validateRequest, UserController.updateProfile);

//  New Dashboard Route
router.get('/dashboard', authMiddleware, UserController.getDashboard);

module.exports = router;
