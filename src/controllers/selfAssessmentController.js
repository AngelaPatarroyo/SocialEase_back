const SelfAssessmentService = require('../services/selfAssessmentService');
const AppError = require('../utils/errors');
const User = require('../models/User');

class SelfAssessmentController {
  async create(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('User ID missing from request. Check token decoding.', 401));

      const user = await User.findById(userId);
      if (!user) return next(new AppError('User not found', 404));

      // If already completed, treat as update without touching the frontend
      if (user.hasCompletedSelfAssessment) {
        return this.update(req, res, next);
      }

      const result = await SelfAssessmentService.createAssessment(userId, req.body);

      user.hasCompletedSelfAssessment = true;
      user.selfAssessmentCompletedAt = new Date();
      await user.save();

      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
        meta: result.meta, // { xp, level }
      });
    } catch (err) {
      console.error('❌ Error in create self-assessment:', err);
      return next(new AppError(err.message || 'Failed to create self-assessment', err.statusCode || err.status || 500));
    }
  }

  async update(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('User ID missing from token', 401));

      const user = await User.findById(userId);
      if (!user) return next(new AppError('User not found', 404));
      if (!user.hasCompletedSelfAssessment) {
        return next(new AppError('Complete the initial self-assessment first.', 409));
      }

      const result = await SelfAssessmentService.updateAssessment(userId, req.body);

      user.selfAssessmentUpdatedAt = new Date();
      await user.save();

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      console.error('❌ Error in update self-assessment:', err);
      return next(new AppError(err.message || 'Failed to update self-assessment', err.statusCode || err.status || 500));
    }
  }

  async getUserAssessment(req, res, next) {
    try {
      const { userId } = req.params;
      const assessment = await SelfAssessmentService.getAssessment(userId);
      if (!assessment || assessment.length === 0) {
        return next(new AppError('No self-assessments found for this user', 404));
      }
      return res.status(200).json({ success: true, data: assessment });
    } catch (err) {
      console.error('❌ Error in getUserAssessment:', err);
      return next(new AppError(err.message || 'Failed to fetch assessments', err.statusCode || 500));
    }
  }

  async getCurrentUserAssessment(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('User ID missing from token', 401));
      const assessment = await SelfAssessmentService.getAssessment(userId);
      return res.status(200).json({
        success: true,
        data: Array.isArray(assessment) ? assessment : (assessment ? [assessment] : []),
      });
    } catch (err) {
      console.error('❌ Error in getCurrentUserAssessment:', err);
      return next(new AppError(err.message || 'Failed to fetch assessments', err.statusCode || 500));
    }
  }
}

module.exports = new SelfAssessmentController();
