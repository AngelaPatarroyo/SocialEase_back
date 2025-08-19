const { Types } = require('mongoose');
const FeedbackRepository = require('../repositories/FeedbackRepository');
const UserRepository = require('../repositories/UserRepository');
const ScenarioRepository = require('../repositories/ScenarioRepository'); // <-- add this
const AppError = require('../utils/errors');

async function resolveScenarioObjectId(scenarioIdOrSlug) {
  // If it's a valid ObjectId, use it directly
  if (Types.ObjectId.isValid(scenarioIdOrSlug)) {
    return scenarioIdOrSlug;
  }
  // Otherwise treat as slug and resolve to _id
  const scenario = await ScenarioRepository.findBySlug(scenarioIdOrSlug);
  if (!scenario) {
    throw new AppError('Invalid scenarioId or slug', 400);
  }
  return scenario._id;
}

class FeedbackService {
  /**
   * Persist feedback.
   * XP is handled in the controller (once).
   */
  async submitFeedback(feedbackData) {
    try {
      const feedback = await FeedbackRepository.create(feedbackData);
      return feedback;
    } catch (err) {
      throw new AppError('Failed to submit feedback', 500);
    }
  }

  async getUserFeedback(userId) {
    try {
      const feedback = await FeedbackRepository.findByUserId(userId);
      return feedback;
    } catch (err) {
      throw new AppError('Failed to fetch user feedback', 500);
    }
  }
}

module.exports = new FeedbackService();
