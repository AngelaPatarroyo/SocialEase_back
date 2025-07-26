const UserService = require('../services/userService');
const DashboardService = require('../services/dashboardService');
const AppError = require('../utils/errors');

class UserController {
  /**
   * Format user data for consistent API responses
   */
  formatUserResponse(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      theme: user.theme || 'light',
      xp: user.xp || 0,
      level: user.level || 1,
      streak: user.streak || 0,
      badges: user.badges || []
    };
  }

  /**
   * Get logged-in user's profile
   */
  async getProfile(req, res, next) {
    try {
      if (!req.user?.id) throw new AppError('Unauthorized', 401);

      const user = await UserService.getProfile(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      res.status(200).json({
        success: true,
        data: this.formatUserResponse(user)
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res, next) {
    try {
      if (!req.user?.id) throw new AppError('Unauthorized', 401);

      const allowedUpdates = ['name', 'avatar', 'theme'];
      const updates = {};

      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        throw new AppError('No valid fields provided for update', 400);
      }

      const updatedUser = await UserService.updateProfile(req.user.id, updates);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: this.formatUserResponse(updatedUser)
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get personal dashboard (XP, badges, progress)
   */
  async getDashboard(req, res, next) {
    try {
      if (!req.user?.id) throw new AppError('Unauthorized', 401);

      const dashboardData = await DashboardService.getDashboard(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Your personal progress dashboard',
        data: dashboardData
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
