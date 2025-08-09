// services/SelfAssessmentService.js
const mongoose = require('mongoose');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const { updateUserGamification } = require('./gamificationService');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');
const calculateSocialLevel = require('../utils/calculateSocialLevel');
const User = require('../models/User');

const FIRST_BADGE_KEY = 'first_self_assessment';

class SelfAssessmentService {
  async createAssessment(userId, data) {
    this.validateAssessmentData(data);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Count BEFORE create inside the same session
      const countBefore = await SelfAssessmentRepository.countByUserId(userId, { session });

      const socialLevel = calculateSocialLevel({
        communicationConfidence: data.communicationConfidence,
        socialFrequency: data.socialFrequency,
        anxietyTriggers: data.anxietyTriggers,
      });

      const assessment = await SelfAssessmentRepository.create(
        { userId, ...data, socialLevel },
        session
      );

      // Award FIRST badge if truly first
      let earnedBadge = null;
      if (countBefore === 0) {
        earnedBadge = FIRST_BADGE_KEY;
        await User.updateOne(
          { _id: userId },
          { $addToSet: { badges: FIRST_BADGE_KEY } },
          { session }
        );
      }

      await updateUserGamification(userId, xpRewards.selfAssessment, session);

      await session.commitTransaction();
      session.endSession();

      return {
        message: `Self-assessment completed successfully. ${xpRewards.selfAssessment} XP added.`,
        data: assessment,
        badge: earnedBadge,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
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
        throw new AppError(`Missing required field: ${key}`, 400);
      }
    }
  }
}

module.exports = new SelfAssessmentService();
