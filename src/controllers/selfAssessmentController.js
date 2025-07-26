const SelfAssessmentService = require('../services/selfAssessmentService');
const { updateUserGamification } = require('../services/gamificationService');
const xpRewards = require('../config/xpRewards'); //  Import XP rewards config
const AppError = require('../utils/errors');

class SelfAssessmentController {
  /**
   * @desc Create self-assessment and award XP
   * @route POST /api/self-assessment
   * @access Private
   */
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body;

      const assessment = await SelfAssessmentService.createAssessment(userId, data);

      //  Award XP using config value
      await updateUserGamification(userId, xpRewards.selfAssessment);

      res.status(201).json({
        success: true,
        message: `Self-assessment completed successfully. ${xpRewards.selfAssessment} XP added.`,
        data: assessment
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
      res.status(200).json({ success: true, data: assessment });
    } catch (err) {
      next(new AppError(err.message, err.statusCode || 400));
    }
  }
}

module.exports = new SelfAssessmentController();
