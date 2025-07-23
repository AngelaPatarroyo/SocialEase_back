const ProgressRepository = require('../repositories/ProgressRepository');
const UserRepository = require('../repositories/UserRepository');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const AppError = require('../utils/errors');

class ProgressService {
  async updateProgress(userId, scenarioId, status) {
    const user = await UserRepository.findById(userId);
    const scenario = await ScenarioRepository.findById(scenarioId);

    if (!user || !scenario) {
      throw new AppError('User or Scenario not found', 404);
    }

    let progress = await ProgressRepository.findByUserId(userId);
    if (!progress) {
      progress = await ProgressRepository.create({ userId, completedScenarios: [] });
    }

    // Only award XP if scenario is completed and not already counted
    if (status === 'completed' && !progress.completedScenarios.includes(scenarioId)) {
      progress.completedScenarios.push(scenarioId);

      // Add XP from scenario points
      user.xp += scenario.points;

      // Level-up logic
      if (user.xp >= user.level * 100) {
        user.level += 1;
        user.xp = 0; // reset XP or keep carry-over if desired
      }

      // Streak tracking
      const today = new Date().toDateString();
      if (user.lastCompletedDate && user.lastCompletedDate.toDateString() === new Date(Date.now() - 86400000).toDateString()) {
        user.streak += 1;
      } else if (!user.lastCompletedDate || user.lastCompletedDate.toDateString() !== today) {
        user.streak = 1;
      }
      user.lastCompletedDate = new Date();

      // Achievements
      if (progress.completedScenarios.length === 1 && !user.badges.includes('Getting Started')) {
        user.badges.push('Getting Started');
      }

      if (progress.completedScenarios.length === 5 && !user.badges.includes('Consistent Learner')) {
        user.badges.push('Consistent Learner');
      }

      if (user.level >= 5 && !user.badges.includes('Level Master')) {
        user.badges.push('Level Master');
      }

      await user.save();
      await progress.save();
    }

    return { user, progress };
  }

  async getProgress(userId) {
    return await ProgressRepository.findByUserId(userId);
  }
}

module.exports = new ProgressService();
