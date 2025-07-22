const { getUserProgress, updateUserProgress } = require('../services/progressService');

exports.getProgress = async (req, res, next) => {
  try {
    const progress = await getUserProgress(req.user.id);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { scenarioId, points } = req.body;

    if (!scenarioId || !points) {
      const err = new Error('Scenario ID and points are required');
      err.statusCode = 400;
      return next(err);
    }

    const progress = await updateUserProgress(req.user.id, scenarioId, points);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};
