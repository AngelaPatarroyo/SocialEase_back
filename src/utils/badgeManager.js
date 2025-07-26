// utils/badgeManager.js
async function awardBadge(user, badgeName) {
    if (!user.badges.includes(badgeName)) {
      user.badges.push(badgeName);
      await user.save();
    }
  }
  
  module.exports = { awardBadge };
  