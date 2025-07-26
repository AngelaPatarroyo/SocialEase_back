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
      const userId = req.user.id;
      const assessment = await SelfAssessmentService.createAssessment(userId, req.body);

      res.status(201).json({
        success: true,
        message: assessment.message, // XP and success message from service
        data: assessment.data
      });
    } catch (err) {
      next(new AppError(err.message, err.statusCode || 400));
    }
  }

  /**
   * @desc Get user's self-assessments
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
      next(new AppError(err.message, err.statusCode || 500));
    }
  }
}

module.exports = new SelfAssessmentController();
