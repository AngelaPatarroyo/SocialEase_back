const ScenarioRepository = require('../repositories/ScenarioRepository');
const User = require('../models/User');
const { addXP } = require('../utils/xpManager');
const { awardBadge } = require('../utils/badgeManager');

class ScenarioService {
  async createScenario(data) {
    return await ScenarioRepository.create(data);
  }

  async getAllScenarios() {
    return await ScenarioRepository.findAll();
  }

  async updateScenario(id, data) {
    return await ScenarioRepository.update(id, data);
  }

  async deleteScenario(id) {
    return await ScenarioRepository.delete(id);
  }

  /**
   *  Mark a scenario as completed by a user
   * - Adds XP based on scenario points
   * - Updates user level
   * - Awards badges for milestones
   */
  async completeScenario(userId, scenarioId) {
    const scenario = await ScenarioRepository.findById(scenarioId);
    if (!scenario) throw new Error('Scenario not found');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    //  Add XP (use scenario.points or default to 20)
    await addXP(userId, scenario.points || 20);

    //  Badge logic (example)
    const completedCount = await ScenarioRepository.countCompletedByUser(userId);
    if (completedCount === 1) {
      await awardBadge(user, 'First Scenario');
    }
    if (completedCount === 5) {
      await awardBadge(user, 'Explorer');
    }

    return { message: 'Scenario completed, XP awarded', xpGained: scenario.points || 20 };
  }
}

module.exports = new ScenarioService();
