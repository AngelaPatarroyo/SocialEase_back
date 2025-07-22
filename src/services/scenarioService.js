const ScenarioRepository = require('../repositories/ScenarioRepository');

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
}

module.exports = new ScenarioService();
