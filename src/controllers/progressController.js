const ProgressService = require('../services/progressService');
const AppError = require('../utils/errors');

class ProgressController {
  async updateProgress (req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthorized', 401));
      }
      const userId = req.user.id;
      const { scenarioId } = req.body; // may be slug or ObjectId

      if (!scenarioId) return next(new AppError('scenarioId is required', 400));

      const progress = await ProgressService.updateProgress(userId, scenarioId);

      return res.status(200).json({
        success: true,
        message: 'Progress updated successfully',
        data: progress
      });
    } catch (err) {
      next(new AppError(err.message || 'Failed to update progress', err.statusCode || 500));
    }
  }

  async getUserProgress (req, res, next) {
    try {
      const { userId } = req.params;
      const progress = await ProgressService.getProgress(userId);

      if (!progress) {
        return next(new AppError('Progress not found', 404));
      }

      return res.status(200).json({
        success: true,
        data: progress
      });
    } catch (err) {
      next(new AppError(err.message || 'Failed to fetch progress', 500));
    }
  }
}

module.exports = new ProgressController();
