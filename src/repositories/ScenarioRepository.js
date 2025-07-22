const Scenario = require('../models/Scenario');

class ScenarioRepository {
  async create(data) {
    return await Scenario.create(data);
  }

  async findAll() {
    return await Scenario.find();
  }

  async findById(id) {
    return await Scenario.findById(id);
  }

  async update(id, data) {
    return await Scenario.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Scenario.findByIdAndDelete(id);
  }
}

module.exports = new ScenarioRepository();
