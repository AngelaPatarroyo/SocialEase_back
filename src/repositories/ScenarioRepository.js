const mongoose = require('mongoose');
const Scenario = require('../models/Scenario');

class ScenarioRepository {
  async create(data) {
    return Scenario.create(data);
  }

  async findAll() {
    return Scenario.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return Scenario.findById(id);
  }

  async findByIds(ids) {
    return Scenario.find({ _id: { $in: ids } });
  }

  async update(id, data) {
    return Scenario.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Scenario.findByIdAndDelete(id);
  }

  async count() {
    return Scenario.countDocuments();
  }

  async findByDifficulty(difficulty) {
    return Scenario.find({ difficulty });
  }

  // Fetch all VR-supported scenarios
  async findVRScenarios() {
    return Scenario.find({ vrSupported: true });
  }

  // NEW: find by slug
  async findBySlug(slug) {
    return Scenario.findOne({ slug });
  }

  // Optional helper: find by Mongo _id or slug transparently
  async findBySlugOrId(identifier) {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      return this.findById(identifier);
    }
    return this.findBySlug(identifier);
  }

  // Optional: quick existence check by slug
  async existsBySlug(slug) {
    return Scenario.exists({ slug });
  }
}

module.exports = new ScenarioRepository();
