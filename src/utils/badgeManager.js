
const normalizeKey = (s) =>
  String(s || '').trim().toLowerCase().replace(/\s+/g, '_');

function checkAchievements(user) {
  const current = new Set((user.badges || []).map(normalizeKey));
  const newBadges = [];


  if ((user.streak || 0) >= 5 && !current.has('streak_master')) {
    newBadges.push('streak_master');
  }

  if ((user.level || 0) >= 10 && !current.has('level_10_achiever')) {
    newBadges.push('level_10_achiever');
  }

  if ((user.xp || 0) >= 100 && !current.has('xp_warrior')) {
    newBadges.push('xp_warrior');
  }
  return newBadges;
}

module.exports = {
  checkAchievements,
};
