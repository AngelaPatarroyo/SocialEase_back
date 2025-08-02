const SelfAssessmentService = require('../services/selfAssessmentService');
const AppError = require('../utils/errors');

class SelfAssessmentController {
  /**
   * @desc Create self-assessment (XP awarded inside service for consistency)
   * @route POST /api/self-assessment
   * @access Private
   */
  async create(req, res, next) {
    try {
      console.log('👤 req.user in controller:', req.user);

      const userId = req.user?.id;
      if (!userId) {
        console.warn('⚠️ Missing user ID from token payload');
        return next(new AppError('User ID missing from request. Check token decoding.', 401));
      }

      const assessment = await SelfAssessmentService.createAssessment(userId, req.body);

      res.status(201).json({
        success: true,
        message: assessment.message,
        data: assessment.data
      });
    } catch (err) {
      console.error('❌ Error in create self-assessment:', err);
      next(new AppError(err.message, err.statusCode || 400));
    }
  }

  /**
   * @desc Get all self-assessments for a given user ID
   * @route GET /api/self-assessment/:userId
   * @access Private/Admin
   */
  async getUserAssessment(req, res, next) {
    try {
      const { userId } = req.params;
      const assessment = await SelfAssessmentService.getAssessment(userId);

      if (!assessment || assessment.length === 0) {
        return next(new AppError('No self-assessments found for this user', 404));
      }

      res.status(200).json({ success: true, data: assessment });
    } catch (err) {
      console.error('❌ Error in getUserAssessment:', err);
      next(new AppError(err.message, err.statusCode || 500));
    }
  }

  /**
   * @desc Get self-assessments for the currently logged-in user
   * @route GET /api/self-assessment
   * @access Private
   */
  async getCurrentUserAssessment(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new AppError('User ID missing from token', 401));
      }

      const assessment = await SelfAssessmentService.getAssessment(userId);

      if (!assessment || assessment.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      res.status(200).json({ success: true, data: assessment });
    } catch (err) {
      console.error('❌ Error in getCurrentUserAssessment:', err);
      next(new AppError(err.message, err.statusCode || 500));
    }
  }
}

module.exports = new SelfAssessmentController();
