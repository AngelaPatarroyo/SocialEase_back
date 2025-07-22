const Feedback = require('../models/Feedback');

exports.createUserFeedback = async (userId, { scenarioId, comments, rating }) => {
  const feedback = new Feedback({ userId, scenarioId, comments, rating });
  await feedback.save();
  return feedback;
};

exports.getFeedbackForScenario = async (scenarioId) => {
  return await Feedback.find({ scenarioId }).populate('userId', 'name email');
};
