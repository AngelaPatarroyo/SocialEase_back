const mongoose = require('mongoose');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const { updateUserGamification } = require('./gamificationService');
const ProgressService = require('./progressService');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');

class ScenarioService {
  async getAllScenarios() {
    return await ScenarioRepository.findAll();
  }

  async getScenarioById(id) {
    this.validateObjectId(id, 'Scenario');
    const scenario = await ScenarioRepository.findById(id);
    if (!scenario) throw new AppError('Scenario not found', 404);
    return scenario;
  }

  async createScenario(data) {
    this.validateScenarioData(data);
    return await ScenarioRepository.create(data);
  }

  async updateScenario(id, data) {
    this.validateObjectId(id, 'Scenario');
    this.validateScenarioData(data, false); // Partial validation for update
    const scenario = await ScenarioRepository.update(id, data);
    if (!scenario) throw new AppError('Scenario not found', 404);
    return scenario;
  }

  async deleteScenario(id) {
    this.validateObjectId(id, 'Scenario');
    const scenario = await ScenarioRepository.delete(id);
    if (!scenario) throw new AppError('Scenario not found', 404);
    return scenario;
  }

  /**
   * Mark scenario as completed and update XP + progress in one atomic transaction.
   */
  async completeScenario(userId, scenarioId) {
    this.validateObjectId(scenarioId, 'Scenario');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const scenario = await ScenarioRepository.findById(scenarioId);
      if (!scenario) throw new AppError('Scenario not found', 404);

      const xpEarned = scenario.points || xpRewards.scenarioCompletion;

      // Award XP and update progress atomically
      await updateUserGamification(userId, xpEarned, session);
      await ProgressService.updateProgress(userId, scenarioId, session);

      await session.commitTransaction();
      session.endSession();

      return `Scenario completed! You earned ${xpEarned} XP and your progress has been updated.`;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(error.message, 500);
    }
  }

  /**
   * Validate MongoDB ObjectId
   */
  validateObjectId(id, resourceName) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`${resourceName} ID is invalid`, 400);
    }
  }

  /**
   * Validate scenario data
   * - For create: title, description, difficulty, points required
   * - For update: partial allowed
   */
  validateScenarioData(data, isCreate = true) {
    const { title, description, difficulty, points } = data;
    if (isCreate) {
      if (!title || !description || !difficulty) {
        throw new AppError('Title, description, and difficulty are required', 400);
      }
    }
    if (points && typeof points !== 'number') {
      throw new AppError('Points must be a number', 400);
    }
  }
}

module.exports = new ScenarioService();
