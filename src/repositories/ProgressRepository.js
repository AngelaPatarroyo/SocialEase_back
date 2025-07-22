const Progress = require('../models/Progress');

class ProgressRepository {
  async create(data) {
    return await Progress.create(data);
  }

  async findByUserId(userId) {
    return await Progress.findOne({ userId });
  }

  async update(userId, data) {
    return await Progress.findOneAndUpdate({ userId }, data, { new: true, upsert: true });
  }
}

module.exports = new ProgressRepository();
