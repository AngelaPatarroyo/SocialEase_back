
const User = require('../models/User');
const { calculateLevel } = require('./levelCalculator');

async function addXP(userId, points) {
  if (!Number.isFinite(points)) throw new Error('points must be a number');
  if (points === 0) return await User.findById(userId);

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const currentXp = Number.isFinite(user.xp) ? user.xp : 0;
  const newXp = currentXp + points;
  const newLevel = calculateLevel(newXp);
  
  console.log(`[XPManager] User ${userId}: ${currentXp} + ${points} = ${newXp} XP, Level ${user.level} → ${newLevel}`);
  
  user.xp = newXp;
  user.level = newLevel;

  await user.save();
  console.log(`[XPManager] User ${userId} saved with ${user.xp} XP, Level ${user.level}`);
  return user;
}

module.exports = { addXP };
