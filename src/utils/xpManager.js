const User = require('../models/User');
const { calculateLevel } = require('./levelCalculator');

async function addXP (userId, points) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const currentXp = user.xp || 0;
    const newXp = currentXp + points;
    const newLevel = calculateLevel(newXp);

    user.xp = newXp;
    user.level = newLevel;

    await user.save();

    return user;
  } catch (error) {
    throw new Error(`Failed to add XP: ${error.message}`);
  }
}

module.exports = { addXP };
