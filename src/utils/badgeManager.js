/**
 * Badge Management System
 * Handles awarding, cleaning, and managing user badges
 */

class BadgeManager {
  constructor () {
    // List of valid badges in the current system
    this.VALID_BADGES = new Set([
      // XP Milestones
      'XP Explorer', 'Momentum Builder', 'Consistent Learner', 'Dedicated Practitioner',
      'Halfway Hero', 'Strong Commitment', 'Excellence Seeker', 'Mastery Approach',
      'Almost Legendary', 'XP Master',
      // Special XP
      'XP Legend', 'XP God',
      // Streaks
      'Streak Master', 'Streak Champion', 'Streak Legend',
      // Self Assessment
      'First Steps'
    ]);
  }

  // Normalize badge names to keys for consistent comparison
  normalizeKey (badgeName) {
    return badgeName.toLowerCase().replace(/\s+/g, '_');
  }

  cleanOldBadges (user) {
    if (!user.badges || user.badges.length === 0) {
      return { oldBadges: [], cleanedBadges: [] };
    }

    const oldBadges = user.badges.filter(badge => !this.VALID_BADGES.has(badge));
    const cleanedBadges = user.badges.filter(badge => this.VALID_BADGES.has(badge));

    if (oldBadges.length > 0) {
      user.badges = cleanedBadges;
    }

    return { oldBadges, cleanedBadges };
  }

  async checkAchievements (user) {
    const current = new Set((user.badges || []).map(this.normalizeKey));
    const newBadges = [];

    // Streak-based badges
    if ((user.streak || 0) >= 5 && !current.has('streak_master')) {
      newBadges.push('Streak Master');
    }

    if ((user.streak || 0) >= 10 && !current.has('streak_champion')) {
      newBadges.push('Streak Champion');
    }

    if ((user.streak || 0) >= 30 && !current.has('streak_legend')) {
      newBadges.push('Streak Legend');
    }

    // XP milestone badges (every 100 XP) with meaningful names
    const xp = user.xp || 0;
    const milestoneNames = {
      100: 'XP Explorer',
      200: 'Momentum Builder',
      300: 'Consistent Learner',
      400: 'Dedicated Practitioner',
      500: 'Halfway Hero',
      600: 'Strong Commitment',
      700: 'Excellence Seeker',
      800: 'Mastery Approach',
      900: 'Almost Legendary',
      1000: 'XP Master'
    };

    for (let milestone = 100; milestone <= xp; milestone += 100) {
      const badgeName = milestoneNames[milestone] || `${milestone} XP Milestone`;
      const badgeKey = this.normalizeKey(badgeName);

      if (!current.has(badgeKey)) {
        newBadges.push(badgeName);
      }
    }

    // Special achievement badges
    if ((user.xp || 0) >= 5000 && !current.has('xp_legend')) {
      newBadges.push('XP Legend');
    }

    if ((user.xp || 0) >= 10000 && !current.has('xp_god')) {
      newBadges.push('XP God');
    }

    // Self-assessment completion badge
    if (user.hasCompletedSelfAssessment && !current.has('first_steps')) {
      newBadges.push('First Steps');
    }

    return newBadges;
  }

  // Legacy method for backward compatibility - fetches user and calls checkAchievements
  async checkForNewBadges (userId) {
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.checkAchievements(user);
  }

  // Get all available badges with their requirements
  getAllBadges () {
    return {
      xpMilestones: [
        { name: 'XP Explorer', requirement: 'Reach 100 XP' },
        { name: 'Momentum Builder', requirement: 'Reach 200 XP' },
        { name: 'Consistent Learner', requirement: 'Reach 300 XP' },
        { name: 'Dedicated Practitioner', requirement: 'Reach 400 XP' },
        { name: 'Halfway Hero', requirement: 'Reach 500 XP' },
        { name: 'Strong Commitment', requirement: 'Reach 600 XP' },
        { name: 'Excellence Seeker', requirement: 'Reach 700 XP' },
        { name: 'Mastery Approach', requirement: 'Reach 800 XP' },
        { name: 'Almost Legendary', requirement: 'Reach 900 XP' },
        { name: 'XP Master', requirement: 'Reach 1000 XP' }
      ],
      specialXP: [
        { name: 'XP Legend', requirement: 'Reach 5,000 XP' },
        { name: 'XP God', requirement: 'Reach 10,000 XP' }
      ],
      streaks: [
        { name: 'Streak Master', requirement: '5-day streak' },
        { name: 'Streak Champion', requirement: '10-day streak' },
        { name: 'Streak Legend', requirement: '30-day streak' }
      ],
      selfAssessment: [
        { name: 'First Steps', requirement: 'Complete first self-assessment' }
      ]
    };
  }

  // Clean up old badges from all users (admin function)
  async cleanAllUsersBadges (UserModel) {
    try {
      const users = await UserModel.find({ badges: { $exists: true, $ne: [] } });
      let totalCleaned = 0;
      let totalUsers = 0;

      for (const user of users) {
        const { oldBadges, cleanedBadges } = this.cleanOldBadges(user);
        if (oldBadges.length > 0) {
          await UserModel.findByIdAndUpdate(user._id, { badges: cleanedBadges });
          totalCleaned += oldBadges.length;
          totalUsers++;
        }
      }

      return { totalCleaned, totalUsers };
    } catch (error) {
      throw new Error(`Failed to clean all users badges: ${error.message}`);
    }
  }

  // Force cleanup for a specific user - more aggressive approach
  async forceCleanUserBadges (UserModel, userId) {
    try {
      if (!UserModel || !userId) {
        throw new Error('Invalid parameters for forceCleanUserBadges');
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return { oldBadges: [], validBadges: [], cleaned: false };
      }

      // Define what we consider old/invalid badges
      const OLD_BADGE_PATTERNS = [
        'Feedback', 'Scenario', 'Level', 'Getting Started', 'Consistent Learner'
      ];

      const oldBadges = (user.badges || []).filter(badge =>
        OLD_BADGE_PATTERNS.some(pattern => badge.includes(pattern))
      );

      const validBadges = (user.badges || []).filter(badge =>
        !OLD_BADGE_PATTERNS.some(pattern => badge.includes(pattern))
      );

      if (oldBadges.length > 0) {
        try {
          await UserModel.findByIdAndUpdate(userId, { badges: validBadges });
          return { oldBadges, validBadges, cleaned: true };
        } catch (dbError) {
          throw new Error(`Failed to update user ${userId} badges: ${dbError.message}`);
        }
      }

      return { oldBadges: [], validBadges: user.badges || [], cleaned: false };
    } catch (error) {
      throw new Error(`Error force cleaning user badges: ${error.message}`);
    }
  }

  // Remove specific badges from a user
  async removeSpecificBadges (UserModel, userId, badgesToRemove) {
    try {
      if (!UserModel || !userId || !badgesToRemove || !Array.isArray(badgesToRemove)) {
        throw new Error('Invalid parameters for removeSpecificBadges');
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const currentBadges = user.badges || [];
      const removedBadges = [];
      const remainingBadges = [];

      currentBadges.forEach(badge => {
        if (badgesToRemove.includes(badge)) {
          removedBadges.push(badge);
        } else {
          remainingBadges.push(badge);
        }
      });

      if (removedBadges.length === 0) {
        return { success: true, message: 'No badges to remove', removedBadges: [], remainingBadges };
      }

      try {
        await UserModel.findByIdAndUpdate(userId, { badges: remainingBadges });
        return {
          success: true,
          message: 'Badges removed successfully',
          removedBadges,
          remainingBadges
        };
      } catch (dbError) {
        throw new Error(`Failed to update user ${userId} badges: ${dbError.message}`);
      }
    } catch (error) {
      throw new Error(`Error removing specific badges: ${error.message}`);
    }
  }
}

module.exports = new BadgeManager();
