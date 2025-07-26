const User = require('../models/User');
const AppError = require('../utils/errors');

class UserController {
  /**
   * @desc Get logged-in user profile
   * @route GET /api/user/profile
   * @access Private
   */
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          theme: user.theme,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          badges: user.badges
        }
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  /**
   * @desc Update logged-in user profile
   * @route PUT /api/user/profile
   * @access Private
   */
  async updateProfile(req, res, next) {
    try {
      const { name, avatar, theme } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      if (name) user.name = name;
      if (avatar) user.avatar = avatar;
      if (theme) user.theme = theme;

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          theme: user.theme,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          badges: user.badges
        }
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }
}

module.exports = new UserController();
