const mongoose = require('mongoose');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const { updateUserGamification } = require('./gamificationService');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');
const calculateSocialLevel = require('../utils/calculateSocialLevel');

class SelfAssessmentService {
  async createAssessment(userId, data) {
    console.log('📥 Incoming assessment data:', data);

    this.validateAssessmentData(data);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const socialLevel = calculateSocialLevel({
        communicationConfidence: data.communicationConfidence,
        socialFrequency: data.socialFrequency,
        anxietyTriggers: data.anxietyTriggers,
      });

      const assessment = await SelfAssessmentRepository.create(
        { userId, ...data, socialLevel },
        session
      );

      await updateUserGamification(userId, xpRewards.selfAssessment, session);
      await session.commitTransaction();
      session.endSession();

      return {
        message: `Self-assessment completed successfully. ${xpRewards.selfAssessment} XP added.`,
        data: assessment,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      // ✅ Show full backend error in the terminal
      console.error('🔥 FULL ERROR:', error);

      throw new AppError(error.message || 'Internal Server Error', 500);
    }
  }

  async getAssessment(userId) {
    return await SelfAssessmentRepository.findByUserId(userId);
  }

  validateAssessmentData(data) {
    const required = [
      'confidenceBefore',
      'confidenceAfter',
      'primaryGoal',
      'comfortZones',
      'preferredScenarios',
      'anxietyTriggers',
      'socialFrequency',
      'communicationConfidence',
    ];

    for (const key of required) {
      if (data[key] === undefined || data[key] === null) {
        console.error('❌ Validation error - missing field:', key);
        throw new AppError(`Missing required field: ${key}`, 400);
      }
    }
  }
}

module.exports = new SelfAssessmentService();
