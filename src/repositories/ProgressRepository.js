const Progress = require('../models/Progress');

class ProgressRepository {
  async create(data) {
    return await Progress.create(data);
  }

  async findByUserId(userId) {
    return await Progress.findOne({ userId });
  }

  /**
   * Add a scenario to completedScenarios atomically
   * Prevents duplicates using $addToSet
   */
  async addScenario(userId, scenarioId) {
    return await Progress.findOneAndUpdate(
      { userId },
      { $addToSet: { completedScenarios: scenarioId } }, // Atomic + no duplicates
      { new: true, upsert: true }
    );
  }

  /**
   * Add an achievement atomically
   * Prevents duplicates using $addToSet
   */
  async addAchievement(userId, achievement) {
    return await Progress.findOneAndUpdate(
      { userId },
      { $addToSet: { achievements: achievement } }, // Atomic + no duplicates
      { new: true, upsert: true }
    );
  }

  /**
   * Generic update for other fields if needed
   */
  async update(userId, data) {
    return await Progress.findOneAndUpdate({ userId }, data, { new: true, upsert: true });
  }
}

module.exports = new ProgressRepository();
