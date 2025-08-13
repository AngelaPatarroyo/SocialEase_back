const User = require('../models/User');
const badgeManager = require('../utils/badgeManager');
const { levelFromXP, buildLinear } = require('../utils/leveling');

// Level curve: Level 2 at 100 XP, Level 3 at 300, etc.
const thresholdFn = buildLinear(100);

/**
 * Updates XP/level/streak and awards any achievement badges.
 * All writes occur inside the provided transaction session if given.
 *
 * @param {string} userId
 * @param {number} xpEarned
 * @param {import('mongoose').ClientSession|null} session
 * @returns {Promise<{ xp:number, level:number, newBadges:string[] }>}
 */
async function updateUserGamification(userId, xpEarned = 0, session = null) {
  const query = session ? User.findById(userId).session(session) : User.findById(userId);
  const user = await query;
  if (!user) throw new Error('User not found');

  // XP & Level
  const delta = Number(xpEarned || 0);
  user.xp = Number(user.xp || 0) + delta;
  const lvl = levelFromXP(user.xp, thresholdFn);
  user.level = Number.isFinite(lvl) ? lvl : 1;

  // Streak (midnight-based)
  const todayMid = new Date();
  todayMid.setHours(0, 0, 0, 0);

  let lastMid = null;
  if (user.lastCompletedDate) {
    lastMid = new Date(user.lastCompletedDate);
    lastMid.setHours(0, 0, 0, 0);
  }

  if (!lastMid) {
    user.streak = 1;
  } else {
    const diffDays = Math.round((todayMid - lastMid) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      user.streak = (user.streak || 0) + 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    // diffDays === 0 -> already logged today, keep streak as-is
  }
  user.lastCompletedDate = new Date();

  // Badges
  const newBadges = await badgeManager.checkAchievements(user) || [];
  
  // Clean up any old badges first
  const { oldBadges, cleanedBadges } = badgeManager.cleanOldBadges(user);
  if (oldBadges.length > 0) {
    console.log(`[GamificationService] 🧹 Cleaned old badges for user ${user._id}: ${oldBadges.join(', ')}`);
  }
  
  // Combine cleaned badges with new badges
  user.badges = Array.from(new Set([...cleanedBadges, ...newBadges]));

  await user.save(session ? { session } : undefined);

  return { xp: user.xp, level: user.level, newBadges };
}

module.exports = { updateUserGamification };
