const ScenarioService = require('../services/scenarioService');

class ScenarioController {
  async create(req, res) {
    try {
      const scenario = await ScenarioService.createScenario(req.body);
      res.status(201).json(scenario);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const scenarios = await ScenarioService.getAllScenarios();
      res.status(200).json(scenarios);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedScenario = await ScenarioService.updateScenario(id, req.body);
      res.status(200).json(updatedScenario);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await ScenarioService.deleteScenario(id);
      res.status(200).json({ message: 'Scenario deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new ScenarioController();
