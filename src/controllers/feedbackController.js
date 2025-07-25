const FeedbackService = require('../services/feedbackService');
const { updateUserGamification } = require('../services/gamificationService');
const xpRewards = require('../config/xpRewards'); //  Import XP config
const AppError = require('../utils/errors');

class FeedbackController {
  /**
   * @desc Submit feedback and award XP
   * @route POST /api/feedback
   * @access Private
   */
  async submit(req, res, next) {
    try {
      const userId = req.user.id; // JWT provides user ID
      const { scenarioId, reflection, rating } = req.body;

      const feedback = await FeedbackService.submitFeedback({ userId, scenarioId, reflection, rating });
      if (!feedback) return next(new AppError('Failed to submit feedback', 400));

      //  Award XP using centralized config
      await updateUserGamification(userId, xpRewards.feedback);

      res.status(201).json({
        success: true,
        message: `Feedback submitted successfully. ${xpRewards.feedback} XP added.`,
        data: feedback
      });
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  }

  /**
   * @desc Get all feedback by user
   * @route GET /api/feedback/:userId
   * @access Private/Admin
   */
  async getUserFeedback(req, res, next) {
    try {
      const { userId } = req.params;
      const feedbackList = await FeedbackService.getUserFeedback(userId);

      if (!feedbackList || feedbackList.length === 0)
        return next(new AppError('No feedback found for this user', 404));

      res.status(200).json({
        success: true,
        data: feedbackList
      });
    } catch (err) {
      next(new AppError(err.message, 500));
    }
  }
}

module.exports = new FeedbackController();
