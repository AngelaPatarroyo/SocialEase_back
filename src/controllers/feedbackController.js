const FeedbackService = require('../services/feedbackService');

class FeedbackController {
  async submit(req, res) {
    try {
      const { userId, scenarioId, reflection, rating } = req.body;
      const feedback = await FeedbackService.submitFeedback({ userId, scenarioId, reflection, rating });
      res.status(201).json(feedback);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getUserFeedback(req, res) {
    try {
      const { userId } = req.params;
      const feedbackList = await FeedbackService.getUserFeedback(userId);
      res.status(200).json(feedbackList);
    } catch (err) {
      res.status(404).json({ error: 'Feedback not found' });
    }
  }
}

module.exports = new FeedbackController();
