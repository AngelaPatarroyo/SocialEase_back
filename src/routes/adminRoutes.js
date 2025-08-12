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
  (req, res) => AdminController.getAllUsers(req, res)
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
  (req, res) => AdminController.updateUserRole(req, res)
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
  (req, res) => AdminController.deleteUser(req, res)
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
  (req, res) => AdminController.cleanupBadges(req, res)
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
  (req, res) => AdminController.cleanupUserBadges(req, res)
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
  (req, res) => AdminController.getAnalytics(req, res)
);

module.exports = router;
