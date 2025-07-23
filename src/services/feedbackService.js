const FeedbackRepository = require('../repositories/FeedbackRepository');
const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/errors');

class FeedbackService {
  async submitFeedback({ userId, scenarioId, reflection, rating }) {
    // Save feedback
    const feedback = await FeedbackRepository.create({ userId, scenarioId, reflection, rating });

    // Check feedback count for achievements
    const feedbackCount = await FeedbackRepository.countByUserId(userId);
    const user = await UserRepository.findById(userId);

    if (feedbackCount === 10 && !user.badges.includes('Feedback Champ')) {
      user.badges.push('Feedback Champ');
      await user.save();
    }

    return feedback;
  }

  async getUserFeedback(userId) {
    return await FeedbackRepository.findByUserId(userId);
  }
}

module.exports = new FeedbackService();
