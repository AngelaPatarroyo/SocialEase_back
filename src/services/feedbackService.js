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
  async submitFeedback({ userId, scenarioId, reflection, rating }) {
    try {
      const scenarioObjectId = await resolveScenarioObjectId(scenarioId);

      const feedback = await FeedbackRepository.create({
        userId,
        scenarioId: scenarioObjectId,
        reflection,
        rating,
      });

      return feedback;
    } catch (err) {
      console.error('[FeedbackService.submitFeedback] Error:', err);
      // propagate specific 400 from invalid slug/id, otherwise 500
      if (err?.statusCode) throw err;
      throw new AppError('Could not save feedback', 500);
    }
  }

  async getUserFeedback(userId) {
    try {
      return await FeedbackRepository.findByUserId(userId);
    } catch (err) {
      console.error('[FeedbackService.getUserFeedback] Error:', err);
      throw new AppError('Could not fetch feedback', 500);
    }
  }
}

module.exports = new FeedbackService();
