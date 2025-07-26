const User = require('../models/User');
const calculateLevel = require('../utils/levelCalculator');
const badgeManager = require('../utils/badgeManager');

async function updateUserGamification(userId, xpEarned) {
  const user = await User.findById(userId);
  if (!user) return;

  // Add XP
  user.xp += xpEarned;

  // Calculate Level
  user.level = calculateLevel(user.xp);

  // Update streak
  const today = new Date().setHours(0, 0, 0, 0);
  const lastDate = user.lastCompletedDate ? new Date(user.lastCompletedDate).setHours(0, 0, 0, 0) : null;

  if (lastDate) {
    const diff = (today - lastDate) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      user.streak += 1;
    } else if (diff > 1) {
      user.streak = 1; // reset streak
    }
  } else {
    user.streak = 1; // first activity
  }

  user.lastCompletedDate = new Date();

  // Update badges
  const newBadges = badgeManager.checkAchievements(user);
  user.badges = [...new Set([...user.badges, ...newBadges])];

  await user.save();
}

module.exports = { updateUserGamification };
