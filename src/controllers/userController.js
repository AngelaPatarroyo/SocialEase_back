const UserService = require('../services/userService');
const AppError = require('../utils/errors');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await UserService.getProfile(req.user.id);
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
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, avatar, theme } = req.body;
      const updates = { name, avatar, theme };
      const user = await UserService.updateProfile(req.user.id, updates);

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
      next(error);
    }
  }
}

module.exports = new UserController();
