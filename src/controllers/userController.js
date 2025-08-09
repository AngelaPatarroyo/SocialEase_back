const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SelfAssessment = require('../models/SelfAssessment');
const Scenario = require('../models/Scenario');
const Feedback = require('../models/Feedback');
const { levelMeta, buildLinear } = require('../utils/leveling');
const badgeManager = require('../utils/badgeManager');

const thresholdFn = buildLinear(100);

const UserController = {
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
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

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id).select('+password');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isGoogleUserWithoutPassword = user.provider === 'google' && !user.password;

      if (isGoogleUserWithoutPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
      } else {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
          return res.status(400).json({ success: false, message: 'New password must be different' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        role: user.role,
        provider: user.provider,
      };

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        token,
        user: userData,
      });
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

      // Recalculate level/XP from total XP
      const meta = levelMeta(Number(user.xp || 0), thresholdFn);
      user.level = meta.level;

      // Auto-award badges if missing
      const autoAwarded = badgeManager.checkAchievements(user) || [];
      user.badges = Array.from(new Set([...(user.badges || []), ...autoAwarded]));
      await user.save();

      const stats = {
        xp: Number(user.xp || 0),
        level: meta.level,
        streak: Number(user.streak || 0),
        badges: user.badges,
        nextLevelXP: meta.xpForNextLevel,
        xpIntoLevel: meta.xpIntoLevel,
        xpRemaining: meta.xpRemaining,
      };

      res.status(200).json({
        success: true,
        data: {
          user,
          stats,
          goals: user.goals || [],
        },
      });
    } catch (error) {
      console.error('❌ Dashboard error:', error);
      res.status(500).json({ success: false, message: 'Dashboard error' });
    }
  },

  async deleteAccount(req, res) {
    try {
      const userId = req.user.id;

      await Promise.all([
        SelfAssessment.deleteMany({ userId }),
        Scenario.deleteMany({ userId }),
        Feedback.deleteMany({ userId }),
      ]);

      await User.findByIdAndDelete(userId);

      return res.status(200).json({
        success: true,
        message: 'User and all related data deleted',
      });
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete account. Please try again.',
      });
    }
  }
};

module.exports = UserController;
