
const User = require('../models/User');
const { calculateLevel } = require('./levelCalculator');

async function addXP(userId, points) {
  if (!Number.isFinite(points)) throw new Error('points must be a number');
  if (points === 0) return await User.findById(userId);

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const currentXp = Number.isFinite(user.xp) ? user.xp : 0;
  user.xp = currentXp + points;
  user.level = calculateLevel(user.xp);

  await user.save();
  return user;
}

module.exports = { addXP };
