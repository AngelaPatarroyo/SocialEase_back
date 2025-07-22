const Feedback = require('../models/Feedback');
const Progress = require('../models/Progress');

// Get all feedback with user and scenario details
exports.getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find()
      .populate('userId', 'name email')
      .populate('scenarioId', 'title difficulty');

    if (!feedback || feedback.length === 0) {
      const err = new Error('No feedback found');
      err.statusCode = 404;
      return next(err);
    }

    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

// Get all user progress with XP
exports.getAllProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find()
      .populate('userId', 'name email')
      .populate('completedScenarios', 'title');

    if (!progress || progress.length === 0) {
      const err = new Error('No progress records found');
      err.statusCode = 404;
      return next(err);
    }

    res.json(progress);
  } catch (error) {
    next(error);
  }
};
