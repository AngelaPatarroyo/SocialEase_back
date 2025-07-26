const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

class FeedbackRepository {
  async create(data) {
    return await Feedback.create(data);
  }

  async findByUserId(userId) {
    return await Feedback.find({ userId: new mongoose.Types.ObjectId(userId) });
  }

  async count() {
    return await Feedback.countDocuments();
  }

  async getAverageRating() {
    const result = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    return result.length > 0 ? result[0].avgRating : 0;
  }
}

module.exports = new FeedbackRepository();
