const SelfAssessmentService = require('../services/SelfAssessmentService');
const AppError = require('../utils/errors');
const User = require('../models/User');
const { levelMeta, buildLinear } = require('../utils/leveling');

const thresholdFn = buildLinear(100);
const XP_FOR_SELF_ASSESSMENT = 100;

class SelfAssessmentController {
  async create(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('User ID missing from request. Check token decoding.', 401));

      const result = await SelfAssessmentService.createAssessment(userId, req.body);

      // Award XP for self-assessment
      const user = await User.findById(userId);
      if (user) {
        user.xp = Number(user.xp || 0) + XP_FOR_SELF_ASSESSMENT;

        // Recalculate level
        const meta = levelMeta(user.xp, thresholdFn);
        user.level = meta.level;

        // Ensure badge exists
        const newBadge = 'first_self_assessment';
        if (!user.badges.includes(newBadge)) {
          user.badges.push(newBadge);
        }

        await user.save();
      }

      // Fresh updated user stats
      const updatedUser = await User.findById(userId).select('xp level badges');

      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
        xpEarned: XP_FOR_SELF_ASSESSMENT,
        level: updatedUser?.level || 1,
        badges: updatedUser?.badges || [],
        badge: result.badge || 'first_self_assessment',
      });
    } catch (err) {
      console.error('❌ Error in create self-assessment:', err);
      return next(new AppError(err.message || 'Failed to create self-assessment', err.statusCode || 400));
    }
  }

  // GET /api/self-assessment/:userId (admin)
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

  // GET /api/self-assessment
  async getCurrentUserAssessment(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('User ID missing from token', 401));

      const assessment = await SelfAssessmentService.getAssessment(userId);

      return res.status(200).json({
        success: true,
        data: Array.isArray(assessment) ? assessment : [],
      });
    } catch (err) {
      console.error('❌ Error in getCurrentUserAssessment:', err);
      return next(new AppError(err.message || 'Failed to fetch assessments', err.statusCode || 500));
    }
  }
}

module.exports = new SelfAssessmentController();
