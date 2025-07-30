const mongoose = require('mongoose');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const { updateUserGamification } = require('./gamificationService');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');
const calculateSocialLevel = require('../utils/calculateSocialLevel'); 
class SelfAssessmentService {
  async createAssessment(userId, data) {
    this.validateAssessmentData(data);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Calculate social level from key inputs
      const socialLevel = calculateSocialLevel({
        communicationConfidence: data.communicationConfidence,
        socialFrequency: data.socialFrequency,
        anxietyTriggers: data.anxietyTriggers,
      });

      console.log('📥 Received self-assessment payload:', data);
      console.log('🧠 Calculated socialLevel:', socialLevel);

      const assessment = await SelfAssessmentRepository.create(
        { userId, ...data, socialLevel },
        session
      );

      console.log(`🎯 Awarding ${xpRewards.selfAssessment} XP to user ${userId}`);
      await updateUserGamification(userId, xpRewards.selfAssessment, session);

      await session.commitTransaction();
      session.endSession();

      return {
        message: `Self-assessment completed successfully. ${xpRewards.selfAssessment} XP added.`,
        data: assessment,
      };
    } catch (error) {
      console.error('❌ Self-assessment creation failed:', error);
      await session.abortTransaction();
      session.endSession();
      throw new AppError(error.message || 'Internal Server Error', 500);
    }
  }

  async getAssessment(userId) {
    return await SelfAssessmentRepository.findByUserId(userId);
  }

  /**
   * Validate self-assessment input
   */
  validateAssessmentData(data) {
    if (!data || Object.keys(data).length === 0) {
      throw new AppError('Assessment data cannot be empty', 400);
    }

    const required = [
      'scenarioId',
      'confidenceBefore',
      'confidenceAfter',
      'reflectionPositive',
      'reflectionNegative',
      'reflectionNegativeThoughts',
      'reflectionAlternativeThoughts',
      'reflectionActionPlan',
      'reflectionCompassion',
      'primaryGoal',
      'comfortZones',
      'preferredScenarios',
      'anxietyTriggers',
      'socialFrequency',
      'communicationConfidence',
    ];

    for (const key of required) {
      if (data[key] === undefined || data[key] === null) {
        throw new AppError(`Missing required field: ${key}`, 400);
      }
    }
  }
}

module.exports = new SelfAssessmentService();
