const ScenarioService = require('../services/scenarioService');

class ScenarioController {
  async getScenarios(req, res, next) {
    try {
      const scenarios = await ScenarioService.getAllScenarios();
      res.status(200).json({ success: true, data: scenarios });
    } catch (err) {
      next(err);
    }
  }

  async getScenarioById(req, res, next) {
    try {
      const scenario = await ScenarioService.getScenarioById(req.params.id);
      res.status(200).json({ success: true, data: scenario });
    } catch (err) {
      next(err);
    }
  }

  async createScenario(req, res, next) {
    try {
      const scenario = await ScenarioService.createScenario(req.body);
      res.status(201).json({ success: true, message: 'Scenario created successfully', data: scenario });
    } catch (err) {
      next(err);
    }
  }

  async updateScenario(req, res, next) {
    try {
      const scenario = await ScenarioService.updateScenario(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Scenario updated successfully', data: scenario });
    } catch (err) {
      next(err);
    }
  }

  async deleteScenario(req, res, next) {
    try {
      await ScenarioService.deleteScenario(req.params.id);
      res.status(200).json({ success: true, message: 'Scenario deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async completeScenario(req, res, next) {
    try {
      const message = await ScenarioService.completeScenario(req.user.id, req.params.scenarioId);
      res.status(200).json({ success: true, message });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ScenarioController();
