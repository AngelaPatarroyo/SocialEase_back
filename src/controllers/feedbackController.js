const { createUserFeedback, getFeedbackForScenario } = require('../services/feedbackService');

exports.createFeedback = async (req, res, next) => {
  try {
    const { scenarioId, comments, rating } = req.body;

    if (!scenarioId || !comments) {
      const err = new Error('Scenario ID and comments are required');
      err.statusCode = 400;
      return next(err);
    }

    const feedback = await createUserFeedback(req.user.id, { scenarioId, comments, rating });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

exports.getScenarioFeedback = async (req, res, next) => {
  try {
    const { scenarioId } = req.params;
    const feedbackList = await getFeedbackForScenario(scenarioId);
    res.json(feedbackList);
  } catch (error) {
    next(error);
  }
};
