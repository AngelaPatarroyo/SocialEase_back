const Progress = require('../models/Progress');

class ProgressRepository {
  async findByUserId(userId) {
    return Progress.findOne({ userId });
  }

  /**
   * Add scenario to completedScenarios (no duplicates).
   * Returns the updated progress doc.
   */
  async addScenario(userId, scenarioId) {
    return Progress.findOneAndUpdate(
      { userId },
      { $addToSet: { completedScenarios: scenarioId } },
      { new: true, upsert: true }
    );
  }

  async addAchievement(userId, achievement) {
    return Progress.findOneAndUpdate(
      { userId },
      { $addToSet: { achievements: achievement } },
      { new: true, upsert: true }
    );
  }
}

module.exports = new ProgressRepository();
