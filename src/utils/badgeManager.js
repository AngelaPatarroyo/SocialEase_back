
const User = require('../models/User');

// Normalize badge names to keys for consistent comparison
function normalizeKey(badgeName) {
  return badgeName.toLowerCase().replace(/\s+/g, '_');
}

// List of valid badges in the current system
const VALID_BADGES = new Set([
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

function cleanOldBadges(user) {
  if (!user.badges || user.badges.length === 0) {
    return { oldBadges: [], cleanedBadges: [] };
  }

  const oldBadges = user.badges.filter(badge => !VALID_BADGES.has(badge));
  const cleanedBadges = user.badges.filter(badge => VALID_BADGES.has(badge));

  if (oldBadges.length > 0) {
    console.log(`[BadgeManager] Cleaning old badges for user ${user._id}: ${oldBadges.join(', ')}`);
          console.log(`[BadgeManager] Kept valid badges: ${cleanedBadges.join(', ')}`);
  }

  return { oldBadges, cleanedBadges };
}

async function checkAchievements(user) {
  const current = new Set((user.badges || []).map(normalizeKey));
  const newBadges = [];
  
  console.log(`[BadgeManager] Checking achievements for user ${user._id || 'unknown'}`);
  console.log(`[BadgeManager] Current XP: ${user.xp || 0}, Level: ${user.level || 1}, Streak: ${user.streak || 0}`);
  console.log(`[BadgeManager] Current badges: ${(user.badges || []).join(', ')}`);

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
    const badgeKey = normalizeKey(badgeName);
    
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

  if (newBadges.length > 0) {
    console.log(`[BadgeManager] New badges: ${newBadges.join(', ')}`);
      } else {
      console.log(`[BadgeManager] User already has all badges`);
    }
  
  return newBadges;
}

// Get all available badges with their requirements
function getAllBadges() {
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
async function cleanAllUsersBadges(UserModel) {
  try {
    const users = await UserModel.find({ badges: { $exists: true, $ne: [] } });
    let totalCleaned = 0;
    let totalUsers = 0;

    for (const user of users) {
      const { oldBadges, cleanedBadges } = cleanOldBadges(user);
      if (oldBadges.length > 0) {
        await UserModel.findByIdAndUpdate(user._id, { badges: cleanedBadges });
        totalCleaned += oldBadges.length;
        totalUsers++;
        console.log(`[BadgeManager] Cleaned user ${user._id}: ${oldBadges.join(', ')}`);
      }
    }

    console.log(`[BadgeManager] Cleanup done: ${totalCleaned} old badges removed from ${totalUsers} users`);
    return { totalCleaned, totalUsers };
  } catch (error) {
    console.error('[BadgeManager] ❌ Error cleaning all users badges:', error);
    throw error;
  }
}

// Force cleanup for a specific user - more aggressive approach
async function forceCleanUserBadges(UserModel, userId) {
  try {
    console.log(`[BadgeManager] Starting cleanup for user ${userId}`);
    
    if (!UserModel || !userId) {
      console.error('[BadgeManager] Invalid parameters for forceCleanUserBadges');
      return { oldBadges: [], validBadges: [], cleaned: false };
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      console.log(`[BadgeManager] User ${userId} not found for badge cleanup`);
      return { oldBadges: [], validBadges: [], cleaned: false };
    }

          console.log(`[BadgeManager] User ${userId} badges: ${(user.badges || []).join(', ')}`);
    
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
      console.log(`[BadgeManager] Removing old badges: ${oldBadges.join(', ')}`);
      console.log(`[BadgeManager] Valid badges remain: ${validBadges.join(', ')}`);
      
      try {
        await UserModel.findByIdAndUpdate(userId, { badges: validBadges });
        console.log(`[BadgeManager] User ${userId} badges updated in database`);
        return { oldBadges, validBadges, cleaned: true };
      } catch (dbError) {
        console.error(`[BadgeManager] Failed to update user ${userId} badges:`, dbError);
        return { oldBadges, validBadges, cleaned: false };
      }
    }

    console.log(`[BadgeManager] User ${userId} has no old badges`);
    return { oldBadges: [], validBadges: user.badges || [], cleaned: false };
  } catch (error) {
    console.error('[BadgeManager] Error force cleaning user badges:', error);
    // Return safe defaults instead of throwing
    return { oldBadges: [], validBadges: [], cleaned: false };
  }
}

// Remove specific badges from a user
async function removeSpecificBadges(UserModel, userId, badgesToRemove) {
  try {
    console.log(`[BadgeManager] Removing badges for user ${userId}: ${badgesToRemove.join(', ')}`);
    
    if (!UserModel || !userId || !badgesToRemove || !Array.isArray(badgesToRemove)) {
      console.error('[BadgeManager] Invalid parameters for removeSpecificBadges');
      return { success: false, message: 'Invalid parameters' };
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      console.log(`[BadgeManager] User ${userId} not found for badge removal`);
      return { success: false, message: 'User not found' };
    }

    const currentBadges = user.badges || [];
    const badgesToRemoveSet = new Set(badgesToRemove);
    
    const removedBadges = currentBadges.filter(badge => badgesToRemoveSet.has(badge));
    const remainingBadges = currentBadges.filter(badge => !badgesToRemoveSet.has(badge));

    if (removedBadges.length === 0) {
      console.log(`[BadgeManager] User ${userId} has no badges to remove`);
      return { success: true, message: 'No badges to remove', removedBadges: [], remainingBadges };
    }

    console.log(`[BadgeManager] Badges to remove: ${removedBadges.join(', ')}`);
    console.log(`[BadgeManager] Remaining badges: ${remainingBadges.join(', ')}`);

    try {
      await UserModel.findByIdAndUpdate(userId, { badges: remainingBadges });
      console.log(`[BadgeManager] Removed badges for user ${userId}`);
      return { 
        success: true, 
        message: 'Badges removed successfully',
        removedBadges,
        remainingBadges
      };
    } catch (dbError) {
      console.error(`[BadgeManager] Failed to update user ${userId} badges:`, dbError);
      return { success: false, message: 'Database update failed', error: dbError.message };
    }
  } catch (error) {
    console.error('[BadgeManager] ❌ Error removing specific badges:', error);
    return { success: false, message: 'Internal error', error: error.message };
  }
}

module.exports = {
  checkAchievements,
  getAllBadges,
  cleanOldBadges,
  cleanAllUsersBadges,
  forceCleanUserBadges,
  removeSpecificBadges,
  VALID_BADGES
};
