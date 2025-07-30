const bcrypt = require('bcrypt');
const User = require('../models/User');

const UserController = {
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('❌ Error fetching profile:', error.message);
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { name, avatar, theme } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name !== undefined) user.name = name;
      if (avatar !== undefined) user.avatar = avatar;
      if (theme !== undefined) user.theme = theme;

      await user.save();

      res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
    } catch (error) {
      console.error('❌ Error updating profile:', error.message);
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (!user.password) {
        return res.status(400).json({ success: false, message: 'This account uses Google login and has no password set.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ success: false, message: 'New password must be different from current password' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('❌ Error updating password:', error.message);
      next(error);
    }
  },

  async getDashboard(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const stats = {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        badges: user.badges,
        nextLevelXP: user.level * 100, // example logic
      };
  
      res.status(200).json({
        success: true,
        data: {
          user,
          stats,
          goals: user.goals || []
        }
      });
    } catch (error) {
      console.error('❌ Error in getDashboard:', error.message);
      res.status(500).json({ success: false, message: 'Dashboard error' });
    }
  }
};
  

module.exports = UserController;
