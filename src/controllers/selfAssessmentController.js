const SelfAssessmentService = require('../services/selfAssessmentService');
const AppError = require('../utils/errors');

class SelfAssessmentController {
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body;

      const assessment = await SelfAssessmentService.createAssessment(userId, data);

      res.status(201).json({
        success: true,
        message: 'Self-assessment completed successfully',
        data: assessment
      });
    } catch (err) {
      next(new AppError(err.message, err.statusCode || 400));
    }
  }

  async getUserAssessment(req, res, next) {
    try {
      const { userId } = req.params;
      const assessment = await SelfAssessmentService.getAssessment(userId);
      res.status(200).json({ success: true, data: assessment });
    } catch (err) {
      next(new AppError(err.message, err.statusCode || 400));
    }
  }
}

module.exports = new SelfAssessmentController();
