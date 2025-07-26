const Scenario = require('../models/Scenario');

class ScenarioRepository {
  async create(data) {
    return await Scenario.create(data);
  }

  async findAll() {
    return await Scenario.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Scenario.findById(id);
  }

  async update(id, data) {
    return await Scenario.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Scenario.findByIdAndDelete(id);
  }

  async count() {
    return await Scenario.countDocuments();
  }

  async findByDifficulty(difficulty) {
    return await Scenario.find({ difficulty: difficulty });
  }

  //  Fetch all VR-supported scenarios
  async findVRScenarios() {
    return await Scenario.find({ vrSupported: true });
  }
}

module.exports = new ScenarioRepository();
