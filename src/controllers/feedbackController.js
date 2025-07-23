const FeedbackService = require('../services/feedbackService');
const AppError = require('../utils/errors');

class FeedbackController {
  async submit(req, res, next) {
    try {
      const { userId, scenarioId, reflection, rating } = req.body;
      const feedback = await FeedbackService.submitFeedback({ userId, scenarioId, reflection, rating });

      if (!feedback) return next(new AppError('Failed to submit feedback', 400));

      res.status(201).json(feedback);
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  }

  async getUserFeedback(req, res, next) {
    try {
      const { userId } = req.params;
      const feedbackList = await FeedbackService.getUserFeedback(userId);

      if (!feedbackList || feedbackList.length === 0) return next(new AppError('No feedback found for this user', 404));

      res.status(200).json(feedbackList);
    } catch (err) {
      next(new AppError(err.message, 500));
    }
  }
}

module.exports = new FeedbackController();
