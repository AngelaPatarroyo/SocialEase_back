const ProgressRepository = require('../repositories/ProgressRepository');

class ProgressService {
  async updateProgress(userId, xpGained) {
    let progress = await ProgressRepository.findByUserId(userId);
    if (!progress) {
      progress = await ProgressRepository.create({ userId, xp: xpGained });
    } else {
      progress.xp += xpGained;

      // Level up for every 100 XP
      if (progress.xp >= progress.level * 100) {
        progress.level += 1;
        progress.achievements.push(`Reached Level ${progress.level}`);
      }
      await progress.save();
    }
    return progress;
  }

  async getProgress(userId) {
    return await ProgressRepository.findByUserId(userId);
  }
}

module.exports = new ProgressService();
