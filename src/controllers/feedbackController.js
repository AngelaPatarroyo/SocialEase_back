const FeedbackService = require('../services/feedbackService');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const { resolveScenarioObjectId } = require('../utils/resolveScenarioId');
const { addXP } = require('../utils/xpManager');
const xpRewards = require('../config/xpRewards'); // optional fallback
const AppError = require('../utils/errors');

class FeedbackController {
  /**
   * @desc Submit feedback and award XP based on scenario.xp
   * @route POST /api/feedback
   * @access Private
   */
  async submit(req, res, next) {
    try {
      if (!req.user?.id) return next(new AppError('Unauthorized', 401));

      const userId = req.user.id;
      const { scenarioId: idOrSlug, reflection, rating } = req.body;

      if (!idOrSlug) return next(new AppError('scenarioId is required', 400));
      if (!reflection?.trim()) return next(new AppError('reflection is required', 400));
      const numRating = Number(rating);
      if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
        return next(new AppError('rating must be an integer between 1 and 5', 400));
      }

      // Resolve slug/ObjectId → ObjectId
      const scenarioObjectId = await resolveScenarioObjectId(idOrSlug);

      // Save feedback
      const feedback = await FeedbackService.submitFeedback({
        userId,
        scenarioId: scenarioObjectId,
        reflection: String(reflection).trim(),
        rating: numRating,
      });
      if (!feedback) return next(new AppError('Failed to submit feedback', 500));

      // 🎯 Award XP based on the scenario's points (fallback to config if missing)
      const scenario = await ScenarioRepository.findById(scenarioObjectId);
      const award = Number(scenario?.points ?? xpRewards?.scenarioCompletion ?? 0);
      
      console.log(`[FeedbackController] Scenario: ${scenario?.title || scenarioObjectId}`);
      console.log(`[FeedbackController] Scenario Points: ${scenario?.points}, Fallback: ${xpRewards?.scenarioCompletion}, Final Award: ${award}`);
      
      if (award > 0) {
        const updatedUser = await addXP(userId, award);
        console.log(`[FeedbackController] User earned ${award} XP. Total: ${updatedUser.xp}`);
      } else {
        console.log(`[FeedbackController] No XP earned - scenario worth 0 points`);
      }

      return res.status(201).json({
        success: true,
        message: `Feedback submitted. +${award} XP.`,
        data: feedback,
      });
    } catch (err) {
      console.error('[FeedbackController.submit] Error:', err);
      next(new AppError(err.message || 'Feedback submission error', 500));
    }
  }

  /**
   * @desc Get all feedback by user
   * @route GET /api/feedback/:userId
   */
  async getUserFeedback(req, res, next) {
    try {
      const { userId } = req.params;
      const feedbackList = await FeedbackService.getUserFeedback(userId);
      if (!feedbackList || feedbackList.length === 0)
        return next(new AppError('No feedback found for this user', 404));
      res.status(200).json({ success: true, data: feedbackList });
    } catch (err) {
      next(new AppError(err.message || 'Failed to fetch feedback', 500));
    }
  }
}

module.exports = new FeedbackController();
