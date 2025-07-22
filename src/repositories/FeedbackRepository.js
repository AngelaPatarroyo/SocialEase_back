const Feedback = require('../models/Feedback');

class FeedbackRepository {
  async create(data) {
    return await Feedback.create(data);
  }

  async findByUserId(userId) {
    return await Feedback.find({ userId });
  }
}

module.exports = new FeedbackRepository();
