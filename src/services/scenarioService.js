const Scenario = require('../models/Scenario');
const Progress = require('../models/Progress');
const ScenarioPreparation = require('../models/ScenarioPreparation');

class ScenarioService {
  /** ------------------------
   *   GET ALL SCENARIOS
   * ------------------------ */
  async getAllScenarios () {
    return Scenario.find().sort({ createdAt: -1 });
  }

  /** ------------------------
   *   GET SCENARIO BY ID
   * ------------------------ */
  async getScenarioById (id) {
    return Scenario.findById(id);
  }

  /** ------------------------
   *   CREATE SCENARIO
   * ------------------------ */
  async createScenario (data) {
    return Scenario.create(data);
  }

  /** ------------------------
   *   UPDATE SCENARIO
   * ------------------------ */
  async updateScenario (id, data) {
    return Scenario.findByIdAndUpdate(id, data, { new: true });
  }

  /** ------------------------
   *   DELETE SCENARIO
   * ------------------------ */
  async deleteScenario (id) {
    return Scenario.findByIdAndDelete(id);
  }

  /** ------------------------
   *   COMPLETE SCENARIO
   * ------------------------ */
  async completeScenario (userId, scenarioId) {
    const existing = await Progress.findOne({ user: userId, scenario: scenarioId });

    if (existing) {
      return 'Scenario already completed previously';
    }

    await Progress.create({ user: userId, scenario: scenarioId, completed: true });
    return 'Scenario marked as completed';
  }

  /** ------------------------
   *   GET ADAPTIVE SCENARIO
   * ------------------------ */
  async getAdaptiveScenario (userId) {
    const completedIds = await Progress.find({ user: userId }).distinct('scenario');
    const next = await Scenario.findOne({ _id: { $nin: completedIds } }).sort({ createdAt: 1 });
    return next;
  }

  /** ------------------------
   *   REPLAY SCENARIO
   * ------------------------ */
  async replayScenario (userId, scenarioId) {
    return `User ${userId} is replaying scenario ${scenarioId}`;
  }

  /** ------------------------
   *   SKIP SCENARIO
   * ------------------------ */
  async skipScenario (currentId, difficulty) {
    return Scenario.findOne({
      _id: { $ne: currentId },
      difficulty
    }).sort({ createdAt: -1 });
  }

  /** ------------------------
   *   GET VR SCENARIOS
   * ------------------------ */
  async getVRScenarios () {
    return Scenario.find({ vrSupported: true });
  }

  /** ------------------------
   *   SAVE SCENARIO PREPARATION
   * ------------------------ */
  async savePreparationData (data) {
    return ScenarioPreparation.create(data);
  }
}

module.exports = new ScenarioService();
