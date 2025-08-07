const ScenarioService = require('../services/scenarioService');

class ScenarioController {
  /** ------------------------
   *   GET ALL SCENARIOS
   * ------------------------ */
  async getScenarios(req, res, next) {
    try {
      const scenarios = await ScenarioService.getAllScenarios();
      res.status(200).json({ success: true, data: scenarios });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   GET SCENARIO BY ID
   * ------------------------ */
  async getScenarioById(req, res, next) {
    try {
      const scenario = await ScenarioService.getScenarioById(req.params.id);
      res.status(200).json({ success: true, data: scenario });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   CREATE SCENARIO
   * ------------------------ */
  async createScenario(req, res, next) {
    try {
      const scenario = await ScenarioService.createScenario(req.body);
      res.status(201).json({
        success: true,
        message: 'Scenario created successfully',
        data: scenario
      });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   UPDATE SCENARIO
   * ------------------------ */
  async updateScenario(req, res, next) {
    try {
      const scenario = await ScenarioService.updateScenario(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Scenario updated successfully',
        data: scenario
      });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   DELETE SCENARIO
   * ------------------------ */
  async deleteScenario(req, res, next) {
    try {
      await ScenarioService.deleteScenario(req.params.id);
      res.status(200).json({ success: true, message: 'Scenario deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   COMPLETE SCENARIO
   * ------------------------ */
  async completeScenario(req, res, next) {
    try {
      const message = await ScenarioService.completeScenario(req.user.id, req.params.scenarioId);
      res.status(200).json({ success: true, message });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   ADAPTIVE DIFFICULTY (FR4)
   * ------------------------ */
  async getAdaptiveScenario(req, res, next) {
    try {
      const scenario = await ScenarioService.getAdaptiveScenario(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Next recommended scenario based on your progress',
        data: scenario
      });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   REPLAY SCENARIO (DR2)
   * ------------------------ */
  async replayScenario(req, res, next) {
    try {
      const message = await ScenarioService.replayScenario(req.user.id, req.params.scenarioId);
      res.status(200).json({ success: true, message });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   SKIP SCENARIO (DR2)
   * ------------------------ */
  async skipScenario(req, res, next) {
    try {
      const { currentId, difficulty } = req.query;
      const scenario = await ScenarioService.skipScenario(currentId, difficulty);
      res.status(200).json({
        success: true,
        message: 'Alternative scenario fetched successfully',
        data: scenario
      });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   GET VR SCENARIOS (Luxury Feature)
   * ------------------------ */
  async getVRScenarios(req, res, next) {
    try {
      const scenarios = await ScenarioService.getVRScenarios();
      res.status(200).json({
        success: true,
        message: 'VR-compatible scenarios fetched successfully',
        data: scenarios
      });
    } catch (err) {
      next(err);
    }
  }

  /** ------------------------
   *   SAVE SCENARIO PREPARATION DATA (NEW)
   * ------------------------ */
  async savePreparation(req, res, next) {
    try {
      const { scenarioId, fear, anxiety, support, visualization, goal } = req.body;
      const userId = req.user.id;

      if (!scenarioId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required scenarioId or userId',
        });
      }

      const data = {
        user: userId,              
        scenario: scenarioId,      
        fear,
        anxiety,
        support,
        visualization,
        goal,
      };

      const saved = await ScenarioService.savePreparationData(data);
      res.status(201).json({
        success: true,
        message: 'Preparation saved',
        data: saved
      });
    } catch (err) {
      console.error('❌ Error in savePreparation:', err.message);
      res.status(500).json({
        success: false,
        message: 'Failed to save preparation data',
        error: err.message
      });
    }
  }
}

module.exports = new ScenarioController();
