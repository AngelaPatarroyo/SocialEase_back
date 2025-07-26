const FeedbackRepository = require('../repositories/FeedbackRepository');
const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/errors');
const { addXP } = require('../utils/xpManager');
const { awardBadge } = require('../utils/badgeManager');

class FeedbackService {
  async submitFeedback({ userId, scenarioId, reflection, rating }) {
    // Save feedback
    const feedback = await FeedbackRepository.create({ userId, scenarioId, reflection, rating });
    // ✅ Add XP for feedback
    await addXP(userId, 10); // +10 XP for submitting feedback

    // Check feedback count for achievements
    const feedbackCount = await FeedbackRepository.countByUserId(userId);
    const user = await UserRepository.findById(userId);

    //  Award badge for feedback milestone
    if (feedbackCount === 10) {
      await awardBadge(user, 'Feedback Champ');
    }

    return feedback;
  }

  async getUserFeedback(userId) {
    return await FeedbackRepository.findByUserId(userId);
  }
}

module.exports = new FeedbackService();
