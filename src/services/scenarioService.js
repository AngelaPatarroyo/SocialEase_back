const mongoose = require('mongoose');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const FeedbackRepository = require('../repositories/FeedbackRepository');
const { updateUserGamification } = require('./gamificationService');
const ProgressService = require('./progressService');
const GoalService = require('./goalService');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');

class ScenarioService {
  /** ------------------------
   *    BASIC CRUD
   * ------------------------ */
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
    this.validateScenarioData(data, false);
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

  /** ------------------------
   *   COMPLETE SCENARIO
   * ------------------------ */
  async completeScenario(userId, scenarioId) {
    this.validateObjectId(scenarioId, 'Scenario');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const scenario = await ScenarioRepository.findById(scenarioId);
      if (!scenario) throw new AppError('Scenario not found', 404);

      const xpEarned = scenario.points || xpRewards.scenarioCompletion;

      // Update XP & Progress
      await updateUserGamification(userId, xpEarned, session);
      await ProgressService.updateProgress(userId, scenarioId, session);

      // Update user goals
      await GoalService.updateGoalsOnScenarioCompletion(userId);

      await session.commitTransaction();
      session.endSession();

      return `Scenario completed! You earned ${xpEarned} XP and your progress has been updated.`;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(error.message, 500);
    }
  }

  /** ------------------------
   *   ADAPTIVE DIFFICULTY (FR4)
   * ------------------------ */
  async getAdaptiveScenario(userId) {
    const feedbacks = await FeedbackRepository.findRecentByUser(userId, 3);
    const ratings = feedbacks.map(f => f.rating);

    let currentDifficulty = 'easy';
    if (feedbacks.length > 0 && feedbacks[0].scenarioDifficulty) {
      currentDifficulty = feedbacks[0].scenarioDifficulty;
    }

    const nextDifficulty = this.calculateNextDifficulty(ratings, currentDifficulty);
    const scenarios = await ScenarioRepository.findByDifficulty(nextDifficulty);

    if (!scenarios || scenarios.length === 0) {
      throw new AppError(`No scenarios found for difficulty: ${nextDifficulty}`, 404);
    }

    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  calculateNextDifficulty(ratings, currentDifficulty) {
    if (ratings.length === 0) return currentDifficulty;

    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const levels = ['easy', 'medium', 'hard'];
    let index = levels.indexOf(currentDifficulty);

    if (avgRating >= 4 && index < levels.length - 1) return levels[index + 1];
    if (avgRating <= 2 && index > 0) return levels[index - 1];
    return currentDifficulty;
  }

  /** ------------------------
   *   REPLAY SCENARIO (DR2)
   * ------------------------ */
  async replayScenario(userId, scenarioId) {
    this.validateObjectId(scenarioId, 'Scenario');
    const scenario = await ScenarioRepository.findById(scenarioId);
    if (!scenario) throw new AppError('Scenario not found', 404);

    const xpEarned = Math.floor((scenario.points || xpRewards.scenarioCompletion) / 2);
    await updateUserGamification(userId, xpEarned);
    await GoalService.updateGoalsOnScenarioCompletion(userId);

    return `Scenario replayed! You earned ${xpEarned} XP for practice.`;
  }

  /** ------------------------
   *   SKIP SCENARIO (DR2)
   * ------------------------ */
  async skipScenario(currentId, difficulty) {
    if (!difficulty) throw new AppError('Difficulty is required to skip scenario', 400);

    const scenarios = await ScenarioRepository.findByDifficulty(difficulty);
    const filtered = scenarios.filter(s => s._id.toString() !== currentId);

    if (filtered.length === 0) throw new AppError('No alternative scenarios found', 404);

    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  /** ------------------------
   *   VR SCENARIOS (Luxury Feature)
   * ------------------------ */
  async getVRScenarios() {
    const vrScenarios = await ScenarioRepository.findVRScenarios();
    if (!vrScenarios || vrScenarios.length === 0) {
      throw new AppError('No VR scenarios available', 404);
    }
    return vrScenarios;
  }

  /** ------------------------
   *   VALIDATION HELPERS
   * ------------------------ */
  validateObjectId(id, resourceName) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`${resourceName} ID is invalid`, 400);
    }
  }

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
