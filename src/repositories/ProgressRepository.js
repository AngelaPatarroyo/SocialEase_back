const Progress = require('../models/Progress');

class ProgressRepository {
  async findByUserId(userId, options = {}) {
    const { limit, sort } = options;
    let query = Progress.find({ userId });
    
    if (sort) {
      query = query.sort(sort);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return query.exec();
  }

  async countByUserId(userId) {
    return Progress.countDocuments({ userId });
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

  async count() {
    return Progress.countDocuments();
  }
}

module.exports = new ProgressRepository();
