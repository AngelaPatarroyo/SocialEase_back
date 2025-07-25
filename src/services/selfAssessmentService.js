const SelfAssessment = require('../models/SelfAssessment');
const User = require('../models/User');
const AppError = require('../utils/errors');

class SelfAssessmentService {
  /**
   * Create a new self-assessment for a user
   */
  async createAssessment(userId, data) {
    // Check if assessment already exists
    const existing = await SelfAssessment.findOne({ userId });
    if (existing) {
      throw new AppError('Self-assessment already completed', 400);
    }

    // Create new assessment
    const assessment = await SelfAssessment.create({
      userId,
      socialLevel: data.socialLevel,
      primaryGoal: data.primaryGoal,
      comfortZones: data.comfortZones,
      preferredScenarios: data.preferredScenarios,
      anxietyTriggers: data.anxietyTriggers,
      communicationConfidence: data.communicationConfidence,
      socialFrequency: data.socialFrequency
    });

    // Award badge for completing assessment
    const user = await User.findById(userId);
    if (user && !user.badges.includes('First Step')) {
      user.badges.push('First Step');
      await user.save();
    }

    return assessment;
  }

  /**
   * Get a user's self-assessment
   */
  async getAssessment(userId) {
    const assessment = await SelfAssessment.findOne({ userId });
    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }
    return assessment;
  }
}

module.exports = new SelfAssessmentService();
