function checkAchievements(user) {
  const newBadges = [];

  if (user.streak >= 5) newBadges.push('Streak Master');
  if (user.level >= 10) newBadges.push('Level 10 Achiever');
  if (user.xp >= 100) newBadges.push('XP Warrior');

  return newBadges;
}

module.exports = {
  checkAchievements,
};
