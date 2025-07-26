const ProgressRepository = require('../repositories/ProgressRepository');
const UserRepository = require('../repositories/UserRepository');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const AppError = require('../utils/errors');

class ProgressService {
  /**
   * Update progress when a user completes a scenario
   * - Tracks completed scenarios atomically
   * - Adds achievements based on milestones
   */
  async updateProgress(userId, scenarioId) {
    // Validate user and scenario existence
    const user = await UserRepository.findById(userId);
    const scenario = await ScenarioRepository.findById(scenarioId);

    if (!user || !scenario) {
      throw new AppError('User or Scenario not found', 404);
    }

    // Atomically add scenario to completed list
    const updatedProgress = await ProgressRepository.addScenario(userId, scenarioId);

    // Determine scenario count after atomic update
    const totalScenarios = updatedProgress.completedScenarios.length;

    // Add achievements based on milestones
    if (totalScenarios === 1) {
      await ProgressRepository.addAchievement(userId, 'Getting Started');
    }
    if (totalScenarios === 5) {
      await ProgressRepository.addAchievement(userId, 'Consistent Learner');
    }

    return updatedProgress;
  }

  /**
   * Get user's progress record
   */
  async getProgress(userId) {
    return await ProgressRepository.findByUserId(userId);
  }
}

module.exports = new ProgressService();
