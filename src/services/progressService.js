// src/services/progressService.js
const ProgressRepository = require('../repositories/ProgressRepository');
const AppError = require('../utils/errors');

class ProgressService {
  /**
   * Update progress for a user and scenario
   * XP gets awarded when user submits feedback, this just tracks completion.
   */
  async updateProgress (userId, scenarioId, progressData) {
    try {
      const progress = await ProgressRepository.updateProgress(userId, scenarioId, progressData);
      return progress;
    } catch (err) {
      throw new AppError('Failed to update progress', 500);
    }
  }
}

module.exports = new ProgressService();
