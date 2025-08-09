const User = require('../models/User');
const badgeManager = require('../utils/badgeManager');
const { levelFromXP, buildLinear } = require('../utils/leveling'); 

// Choose your leveling curve (Level 2 at 100 XP, Level 3 at 300, etc.)
const thresholdFn = buildLinear(100);

/**
 * Updates XP/level/streak and awards any achievement badges.
 * If a Mongo session is provided, updates occur inside that transaction.
 *
 * @param {string} userId
 * @param {number} xpEarned
 * @param {import('mongoose').ClientSession|null} session
 */
async function updateUserGamification(userId, xpEarned = 0, session = null) {
  // Load with/without session
  const query = session ? User.findById(userId).session(session) : User.findById(userId);
  const user = await query;
  if (!user) return;

  // XP
  const currentXP = Number(user.xp || 0);
  const delta = Number(xpEarned || 0);
  user.xp = currentXP + delta;

  // Level (via chosen curve)
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
    if (diffDays === 0) {
      // already logged something today; keep streak
    } else if (diffDays === 1) {
      user.streak = (user.streak || 0) + 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
  }
  user.lastCompletedDate = new Date();

  // Badges from your badge manager
  const newBadges = badgeManager.checkAchievements(user) || [];
  user.badges = Array.from(new Set([...(user.badges || []), ...newBadges]));

  // Save with/without session
  await user.save(session ? { session } : undefined);
}

module.exports = {
  updateUserGamification,
};
