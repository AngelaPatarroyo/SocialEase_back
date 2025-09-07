const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SelfAssessment = require('../models/SelfAssessment');
const Scenario = require('../models/Scenario');
const Feedback = require('../models/Feedback');
const { levelMeta, buildLinear } = require('../utils/leveling');
const badgeManager = require('../utils/badgeManager');
const userService = require('../services/userService');
const dashboardService = require('../services/dashboardService');

const thresholdFn = buildLinear(100);

const UserController = {
  async getProfile (req, res, next) {
    try {
      // Use userService instead of duplicating logic
      const user = await userService.getProfile(req.user.id);

      // Check if user has a password (for Google users)
      const userWithPassword = await User.findById(req.user.id).select('password');
      const hasPassword = !!userWithPassword.password;

      const profileData = {
        ...user.toObject(),
        hasPassword,
        canSetPassword: true, // All users can set/update passwords
        requiresCurrentPassword: hasPassword // Only require current password if they have one
      };

      res.status(200).json({ success: true, data: profileData });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile (req, res, next) {
    try {
      const { name, avatar, theme } = req.body;

      // Use userService instead of duplicating logic
      const user = await userService.updateProfile(req.user.id, { name, avatar, theme });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async getPasswordStatus (req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('provider password email');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const hasPassword = !!user.password;
      const isGoogleUser = user.provider === 'google';

      const passwordStatus = {
        hasPassword,
        isGoogleUser,
        canSetPassword: true, // All users can set/update passwords
        requiresCurrentPassword: hasPassword // Only require current password if they have one
      };

      res.status(200).json({
        success: true,
        data: passwordStatus
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword (req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id).select('+password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Validate new password
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      const isGoogleUserWithoutPassword = user.provider === 'google' && !user.password;

      if (isGoogleUserWithoutPassword) {
        // Google user setting password for the first time
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
      } else if (user.provider === 'google' && user.password) {
        // Google user updating existing password
        if (currentPassword) {
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: 'Current password is incorrect'
            });
          }
        }

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
          return res.status(400).json({
            success: false,
            message: 'New password must be different from current password'
          });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
      } else {
        // Local user updating password
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is required'
          });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
          return res.status(400).json({
            success: false,
            message: 'New password must be different from current password'
          });
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
        hasPassword: true // Now they have a password
      };

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        token,
        user: userData
      });
    } catch (error) {
      next(error);
    }
  },

  async getDashboard (req, res) {
    try {
      // Use dashboardService instead of duplicating logic
      const dashboardData = await dashboardService.getDashboard(req.user.id);

      // Get user for additional data
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Recalculate level/XP from total XP
      const meta = levelMeta(Number(user.xp || 0), thresholdFn);
      user.level = meta.level;

      // Auto-award badges if missing
      const autoAwarded = await badgeManager.checkAchievements(user) || [];
      user.badges = Array.from(new Set([...(user.badges || []), ...autoAwarded]));
      await user.save();

      const stats = {
        xp: Number(user.xp || 0),
        level: meta.level,
        streak: Number(user.streak || 0),
        badges: user.badges,
        nextLevelXP: meta.xpForNextLevel,
        xpIntoLevel: meta.xpIntoLevel,
        xpRemaining: meta.xpRemaining
      };

      res.status(200).json({
        success: true,
        data: {
          user,
          stats,
          goals: user.goals || [],
          // Include dashboard service data
          ...dashboardData
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Dashboard error' });
    }
  },

  async deleteAccount (req, res) {
    try {
      const userId = req.user.id;

      await Promise.all([
        SelfAssessment.deleteMany({ userId }),
        Scenario.deleteMany({ userId }),
        Feedback.deleteMany({ userId })
      ]);

      await User.findByIdAndDelete(userId);

      return res.status(200).json({
        success: true,
        message: 'User and all related data deleted'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete account. Please try again.'
      });
    }
  },

  async getBadges (req, res) {
    try {
      const allBadges = badgeManager.getAllBadges();
      const user = await User.findById(req.user.id).select('badges xp level streak');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Force clean old badges - more aggressive approach
      const { validBadges, cleaned } = await badgeManager.forceCleanUserBadges(User, user._id);

      if (cleaned) {
        user.badges = validBadges;
      }

      // Mark which badges the user has earned
      const userBadges = new Set(user.badges || []);

      const badgesWithStatus = {
        xpMilestones: allBadges.xpMilestones.map(badge => ({
          ...badge,
          earned: userBadges.has(badge.name),
          earnedAt: userBadges.has(badge.name) ? 'Earned' : null
        })),
        specialXP: allBadges.specialXP.map(badge => ({
          ...badge,
          earned: badge.name === 'XP Legend' ? (user.xp >= 5000) : (user.xp >= 10000),
          earnedAt: badge.name === 'XP Legend' ? (user.xp >= 5000 ? 'Earned' : null) : (user.xp >= 10000 ? 'Earned' : null)
        })),
        streaks: allBadges.streaks.map(badge => ({
          ...badge,
          earned: userBadges.has(badge.name),
          earnedAt: userBadges.has(badge.name) ? 'Earned' : null
        })),
        selfAssessment: allBadges.selfAssessment.map(badge => ({
          ...badge,
          earned: userBadges.has(badge.name),
          earnedAt: userBadges.has(badge.name) ? 'Earned' : null
        }))
      };

      res.status(200).json({
        success: true,
        data: {
          userStats: {
            xp: user.xp || 0,
            level: user.level || 1,
            streak: user.streak || 0,
            totalBadges: user.badges ? user.badges.length : 0
          },
          badges: badgesWithStatus
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch badges' });
    }
  }
};

module.exports = UserController;
