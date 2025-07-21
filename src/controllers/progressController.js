const Progress = require('../models/Progress');

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id }).populate('completedScenarios');
    if (!progress) return res.json({ xp: 0, completedScenarios: [] });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { scenarioId, points } = req.body;

    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = new Progress({ userId: req.user.id, xp: 0, completedScenarios: [] });
    }

    if (!progress.completedScenarios.some(id => id.toString() === scenarioId)) {
      progress.completedScenarios.push(scenarioId);
      progress.xp += points;
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
