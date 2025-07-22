const Progress = require('../models/Progress');

exports.getUserProgress = async (userId) => {
  const progress = await Progress.findOne({ userId }).populate('completedScenarios');
  if (!progress) {
    return { xp: 0, completedScenarios: [] };
  }
  return progress;
};

exports.updateUserProgress = async (userId, scenarioId, points) => {
  let progress = await Progress.findOne({ userId });
  if (!progress) {
    progress = new Progress({ userId, xp: 0, completedScenarios: [] });
  }

  if (!progress.completedScenarios.some(id => id.toString() === scenarioId)) {
    progress.completedScenarios.push(scenarioId);
    progress.xp += points;
    await progress.save();
  }

  return progress;
};
