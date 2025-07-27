const UserService = require('../services/userService');
const DashboardService = require('../services/dashboardService');
const AppError = require('../utils/errors');
const bcrypt = require('bcrypt');

// Helper function to format user data
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || null,
  theme: user.theme || 'light',
  xp: user.xp || 0,
  level: user.level || 1,
  streak: user.streak || 0,
  badges: user.badges || []
});

class UserController {
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
        data: formatUserResponse(user)
      });
    } catch (error) {
      console.error('Error in getProfile:', error.message);
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
        data: formatUserResponse(updatedUser)
      });
    } catch (error) {
      console.error('Error in updateProfile:', error.message);
      next(error);
    }
  }

  /**
   * Get personal dashboard (XP, badges, progress)
   */
  async getDashboard(req, res) {
    console.log('DEBUG: Entered getDashboard');
    try {
      console.log('DEBUG: req.user:', req.user);

      if (!req.user?.id) {
        console.error('DEBUG: Missing req.user.id');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await UserService.getProfile(req.user.id);
      console.log('DEBUG: User fetched from DB:', user);

      if (!user) {
        console.error('DEBUG: No user found for ID:', req.user.id);
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const dashboardData = await DashboardService.getDashboard(req.user.id);
      console.log('DEBUG: Dashboard data generated:', dashboardData);

      return res.status(200).json({
        success: true,
        message: 'Your personal progress dashboard',
        data: {
          user: formatUserResponse(user),
          ...dashboardData
        }
      });
    } catch (error) {
      console.error('ERROR in getDashboard:', error.message, error.stack);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      });
    }
  }

  /**
   * Update user password
   */
  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Both fields are required' });
      }

      const user = await UserService.getProfile(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error in updatePassword:', error.message);
      next(error);
    }
  }
}

module.exports = new UserController();
