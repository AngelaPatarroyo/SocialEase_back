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
  async updateProgress(userId, scenarioId, progressData) {
    try {
      const progress = await ProgressRepository.updateProgress(userId, scenarioId, progressData);
      return progress;
    } catch (err) {
      throw new AppError('Failed to update progress', 500);
    }
  }

  async getProgress(userId) {
    return ProgressRepository.findByUserId(userId);
  }
}

module.exports = new ProgressService();
