const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users',
  authMiddleware,
  isAdmin,
  (req, res, next) => AdminController.getAllUsers(req, res, next)
);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: User's password
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *                 description: User's role
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/users',
  authMiddleware,
  isAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin')
  ],
  validateRequest,
  (req, res, next) => AdminController.createUser(req, res, next)
);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Validation error
 */
router.patch('/users/:id/role',
  authMiddleware,
  isAdmin,
  [
    param('id').isMongoId().withMessage('Valid userId is required'),
    body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin')
  ],
  validateRequest,
  (req, res, next) => AdminController.updateUserRole(req, res, next)
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Validation error
 */
router.delete('/users/:id',
  authMiddleware,
  isAdmin,
  [
    param('id').isMongoId().withMessage('Valid userId is required')
  ],
  validateRequest,
  (req, res, next) => AdminController.deleteUser(req, res, next)
);

/**
 * @swagger
 * /api/admin/badges/cleanup:
 *   post:
 *     summary: Clean up old badges from all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Badge cleanup completed successfully
 *       500:
 *         description: Server error during cleanup
 */
router.post('/badges/cleanup',
  authMiddleware,
  isAdmin,
  (req, res, next) => AdminController.cleanupBadges(req, res, next)
);

/**
 * @swagger
 * /api/admin/badges/cleanup/{userId}:
 *   post:
 *     summary: Force clean badges for a specific user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User badges cleaned successfully
 *       500:
 *         description: Server error during cleanup
 */
router.post('/badges/cleanup/:userId',
  authMiddleware,
  isAdmin,
  [
    param('userId').isMongoId().withMessage('Valid userId is required')
  ],
  validateRequest,
  (req, res, next) => AdminController.cleanupUserBadges(req, res, next)
);

/**
 * @swagger
 * /api/admin/badges/remove/{userId}:
 *   post:
 *     summary: Remove specific badges from a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               badges:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of badge names to remove
 *     responses:
 *       200:
 *         description: Badges removed successfully
 *       500:
 *         description: Server error during removal
 */
router.post('/badges/remove/:userId',
  authMiddleware,
  isAdmin,
  [
    param('userId').isMongoId().withMessage('Valid userId is required'),
    body('badges').isArray().withMessage('Badges must be an array')
  ],
  validateRequest,
  (req, res, next) => AdminController.removeUserBadges(req, res, next)
);

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get platform analytics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/analytics',
  authMiddleware,
  isAdmin,
  (req, res, next) => AdminController.getAnalytics(req, res, next)
);

/**
 * @swagger
 * /api/admin/feedback:
 *   get:
 *     summary: Get all feedback from all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All feedback retrieved successfully
 */
router.get('/feedback',
  authMiddleware,
  isAdmin,
  (req, res, next) => AdminController.getAllFeedback(req, res, next)
);

/**
 * @swagger
 * /api/admin/feedback/{id}:
 *   delete:
 *     summary: Delete a specific feedback entry (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error during deletion
 */
router.delete('/feedback/:id',
  authMiddleware,
  isAdmin,
  [
    param('id').isMongoId().withMessage('Valid feedback ID is required')
  ],
  validateRequest,
  (req, res, next) => AdminController.deleteFeedback(req, res, next)
);

module.exports = router;
