const FeedbackRepository = require('../repositories/FeedbackRepository');

class FeedbackService {
  async submitFeedback({ userId, scenarioId, reflection, rating }) {
    return await FeedbackRepository.create({ userId, scenarioId, reflection, rating });
  }

  async getUserFeedback(userId) {
    return await FeedbackRepository.findByUserId(userId);
  }
}

module.exports = new FeedbackService();
