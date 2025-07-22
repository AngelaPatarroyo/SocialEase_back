const ProgressService = require('../services/progressService');

class ProgressController {
  async updateProgress(req, res) {
    try {
      const { userId, xpGained } = req.body;
      const progress = await ProgressService.updateProgress(userId, xpGained);
      res.status(200).json(progress);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getProgress(req, res) {
    try {
      const { userId } = req.params;
      const progress = await ProgressService.getProgress(userId);
      res.status(200).json(progress);
    } catch (err) {
      res.status(404).json({ error: 'Progress not found' });
    }
  }
}

module.exports = new ProgressController();
