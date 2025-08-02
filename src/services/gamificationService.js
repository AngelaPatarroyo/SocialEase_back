const User = require('../models/User');
const calculateLevel = require('../utils/calculateSocialLevel');
const badgeManager = require('../utils/badgeManager');

async function updateUserGamification(userId, xpEarned) {
  const user = await User.findById(userId);
  if (!user) return;

  // Add XP
  user.xp += xpEarned;

  // Calculate level (ensure it's a valid number)
  const level = calculateLevel(user.xp);
  if (isNaN(level)) {
    console.error('🚨 Invalid level calculation result (NaN) for user:', userId);
    user.level = 1; // fallback to level 1
  } else {
    user.level = level;
  }

  // Update streak
  const today = new Date().setHours(0, 0, 0, 0);
  const lastDate = user.lastCompletedDate
    ? new Date(user.lastCompletedDate).setHours(0, 0, 0, 0)
    : null;

  if (lastDate) {
    const diff = (today - lastDate) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      user.streak += 1;
    } else if (diff > 1) {
      user.streak = 1;
    }
  } else {
    user.streak = 1;
  }

  user.lastCompletedDate = new Date();

  // Award badges
  const newBadges = badgeManager.checkAchievements(user);
  user.badges = [...new Set([...user.badges, ...newBadges])];

  await user.save();
}

module.exports = {
  updateUserGamification,
};
