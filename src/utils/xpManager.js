const User = require('../models/User');
const { calculateLevel } = require('./levelCalculator');

async function addXP(userId, points) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Add XP
  user.xp += points;

  // Recalculate level
  user.level = calculateLevel(user.xp);

  await user.save();
  return user;
}

module.exports = { addXP };
