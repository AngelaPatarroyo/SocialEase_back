const Progress = require('../models/Progress');

class ProgressRepository {
  async create(data) {
    return await Progress.create(data);
  }

  async findByUserId(userId) {
    return await Progress.findOne({ userId });
  }

  async addScenario(userId, scenarioId) {
    return await Progress.findOneAndUpdate(
      { userId },
      { $addToSet: { completedScenarios: scenarioId } },
      { new: true, upsert: true }
    );
  }

  async addAchievement(userId, achievement) {
    return await Progress.findOneAndUpdate(
      { userId },
      { $addToSet: { achievements: achievement } },
      { new: true, upsert: true }
    );
  }

  async update(userId, data) {
    return await Progress.findOneAndUpdate({ userId }, data, { new: true, upsert: true });
  }

  async count() {
    return await Progress.countDocuments();
  }
}

module.exports = new ProgressRepository();
