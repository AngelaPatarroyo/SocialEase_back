const ProgressService = require('../services/progressService');
const AppError = require('../utils/errors');

class ProgressController {
  async updateProgress(req, res, next) {
    try {
      const userId = req.user.id; // from auth middleware
      const { scenarioId } = req.body;

      const progress = await ProgressService.updateProgress(userId, scenarioId);

      res.status(200).json({
        success: true,
        message: 'Progress updated successfully',
        data: progress
      });
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  }

  async getUserProgress(req, res, next) {
    try {
      const { userId } = req.params;
      const progress = await ProgressService.getProgress(userId);

      if (!progress) {
        return next(new AppError('Progress not found', 404));
      }

      res.status(200).json({
        success: true,
        data: progress
      });
    } catch (err) {
      next(new AppError(err.message, 500));
    }
  }
}

module.exports = new ProgressController();
