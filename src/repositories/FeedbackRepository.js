const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

class FeedbackRepository {
  async create(data) {
    return await Feedback.create(data);
  }

  async findByUserId(userId) {
    return await Feedback.find({ userId: new mongoose.Types.ObjectId(userId) });
  }
}

module.exports = new FeedbackRepository();
