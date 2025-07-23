const SelfAssessment = require('../models/SelfAssessment');
const User = require('../models/User');
const AppError = require('../utils/errors');

class SelfAssessmentController {
  async create(req, res, next) {
    try {
      const { socialLevel, primaryGoal, comfortZones, preferredScenarios, anxietyTriggers, communicationConfidence, socialFrequency } = req.body;

      // Prevent multiple assessments for now
      const existing = await SelfAssessment.findOne({ userId: req.user.id });
      if (existing) return next(new AppError('Self-assessment already completed', 400));

      const assessment = await SelfAssessment.create({
        userId: req.user.id,
        socialLevel,
        primaryGoal,
        comfortZones,
        preferredScenarios,
        anxietyTriggers,
        communicationConfidence,
        socialFrequency
      });

      // Award badge for completing assessment
      const user = await User.findById(req.user.id);
      if (!user.badges.includes('First Step')) {
        user.badges.push('First Step');
        await user.save();
      }

      res.status(201).json({ message: 'Self-assessment completed', assessment });
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  }

  async getUserAssessment(req, res, next) {
    try {
      const assessment = await SelfAssessment.findOne({ userId: req.params.userId });
      if (!assessment) return next(new AppError('Assessment not found', 404));
      res.status(200).json(assessment);
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  }
}

module.exports = new SelfAssessmentController();
