// src/services/progressService.js
const ProgressRepository = require('../repositories/ProgressRepository');
const UserRepository = require('../repositories/UserRepository');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const { resolveScenarioObjectId } = require('../utils/resolveScenarioId');
const { addXP } = require('../utils/xpManager');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');

class ProgressService {
  /**
   * Marks scenario complete (slug or ObjectId) and handles achievements.
   * XP gets awarded when user submits feedback, this just tracks completion.
   */
  async updateProgress(userId, scenarioIdOrSlug) {
    try {
      const scenarioId = await resolveScenarioObjectId(scenarioIdOrSlug);

      const [user, scenario] = await Promise.all([
        UserRepository.findById(userId),
        ScenarioRepository.findById(scenarioId),
      ]);
      if (!user) throw new AppError('User not found', 404);
      if (!scenario) throw new AppError('Scenario not found', 404);

      const updatedProgress = await ProgressRepository.addScenario(userId, scenarioId);

      // Ensure user data is refreshed after progress update
      await UserRepository.findById(userId);

      return updatedProgress;
    } catch (err) {
      console.error('[ProgressService.updateProgress] Error:', err);
      throw new AppError(err?.message || 'Could not update progress', err?.statusCode || 500);
    }
  }

  async getProgress(userId) {
    return ProgressRepository.findByUserId(userId);
  }
}

module.exports = new ProgressService();
