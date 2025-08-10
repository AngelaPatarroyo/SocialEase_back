const mongoose = require('mongoose');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const { updateUserGamification } = require('./gamificationService');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');
const calculateSocialLevel = require('../utils/calculateSocialLevel');
const User = require('../models/User');

const FIRST_BADGE_KEY = 'first_self_assessment';

function coerceCommConfidence(v, fallbackFromAfter) {
  if (v === '' || v == null) return undefined;
  const n = Number(v);
  if (Number.isFinite(n)) return Math.max(0, Math.min(10, n));
  const s = String(v).toLowerCase().trim();
  if (['very low', 'very_low', 'vlow'].includes(s)) return 2;
  if (['low'].includes(s)) return 3;
  if (['med', 'medium', 'avg', 'average'].includes(s)) return 5;
  if (['high'].includes(s)) return 8;
  if (['very high', 'very_high', 'vhigh'].includes(s)) return 9;
  // fallback from confidenceAfter (0..100 -> 0..10)
  if (Number.isFinite(fallbackFromAfter)) return Math.round(Math.max(0, Math.min(100, fallbackFromAfter)) / 10);
  return 5;
}

class SelfAssessmentService {
  async createAssessment(userId, data) {
    this.validateAssessmentData(data);

    // Defensive coercion so it always matches the model schema
    if (data) {
      data.communicationConfidence = coerceCommConfidence(
        data.communicationConfidence,
        data.confidenceAfter
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
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
