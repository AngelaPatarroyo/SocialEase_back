const mongoose = require('mongoose');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const { updateUserGamification } = require('./gamificationService');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');

class SelfAssessmentService {
  async createAssessment(userId, data) {
    this.validateAssessmentData(data);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const assessment = await SelfAssessmentRepository.create({ userId, ...data }, session);

      // Award XP inside the same transaction for consistency
      await updateUserGamification(userId, xpRewards.selfAssessment, session);

      await session.commitTransaction();
      session.endSession();

      return {
        message: `Self-assessment completed successfully. ${xpRewards.selfAssessment} XP added.`,
        data: assessment
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(error.message, 500);
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
    if (data.score && (isNaN(data.score) || data.score < 0)) {
      throw new AppError('Score must be a positive number', 400);
    }
  }
}

module.exports = new SelfAssessmentService();
