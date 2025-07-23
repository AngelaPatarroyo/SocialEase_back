const ProgressController = require('../services/progressService');
const AppError = require('../utils/errors');

class ProgressCtrl {
  async updateProgress(req, res, next) {
    try {
      const progress = await ProgressController.updateProgress(req.body);

      if (!progress) return next(new AppError('Failed to update progress', 400));

      res.status(200).json(progress);
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  }

  async getProgress(req, res, next) {
    try {
      const progress = await ProgressController.getProgressByUserId(req.params.userId);

      if (!progress) return next(new AppError('Progress not found', 404));

      res.status(200).json(progress);
    } catch (err) {
      next(new AppError(err.message, 500));
    }
  }
}

module.exports = new ProgressCtrl();
