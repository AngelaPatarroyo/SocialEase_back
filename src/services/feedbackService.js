const FeedbackRepository = require('../repositories/FeedbackRepository');
const AppError = require('../utils/errors');

class FeedbackService {
  /**
   * Submit feedback for a scenario
   * XP is handled in the controller (once).
   */
  async submitFeedback (feedbackData) {
    try {
      const feedback = await FeedbackRepository.create(feedbackData);
      return feedback;
    } catch (err) {
      throw new AppError('Failed to submit feedback', 500);
    }
  }

  async getUserFeedback (userId) {
    try {
      const feedback = await FeedbackRepository.findByUserId(userId);
      return feedback;
    } catch (err) {
      throw new AppError('Failed to fetch user feedback', 500);
    }
  }
}

module.exports = new FeedbackService();
