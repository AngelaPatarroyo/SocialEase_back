const Scenario = require('../models/Scenario');
const AppError = require('../utils/errors');

class ScenarioController {
  // Get all scenarios
  async getScenarios(req, res, next) {
    try {
      const scenarios = await Scenario.find();
      res.status(200).json(scenarios);
    } catch (err) {
      next(new AppError('Failed to fetch scenarios', 500));
    }
  }

  // Get scenario by ID
  async getScenarioById(req, res, next) {
    try {
      const { id } = req.params;
      const scenario = await Scenario.findById(id);
      if (!scenario) return next(new AppError('Scenario not found', 404));
      res.status(200).json(scenario);
    } catch (err) {
      next(new AppError('Failed to fetch scenario details', 500));
    }
  }

  // Create scenario
  async createScenario(req, res, next) {
    try {
      const { title, description, difficulty, points } = req.body;
      const scenario = new Scenario({ title, description, difficulty, points });
      await scenario.save();
      res.status(201).json({ message: 'Scenario created successfully', scenario });
    } catch (err) {
      next(new AppError('Failed to create scenario', 400));
    }
  }

  // Update scenario
  async updateScenario(req, res, next) {
    try {
      const scenario = await Scenario.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!scenario) return next(new AppError('Scenario not found', 404));
      res.status(200).json({ message: 'Scenario updated successfully', scenario });
    } catch (err) {
      next(new AppError('Failed to update scenario', 400));
    }
  }

  // Delete scenario
  async deleteScenario(req, res, next) {
    try {
      const scenario = await Scenario.findByIdAndDelete(req.params.id);
      if (!scenario) return next(new AppError('Scenario not found', 404));
      res.status(200).json({ message: 'Scenario deleted successfully' });
    } catch (err) {
      next(new AppError('Failed to delete scenario', 400));
    }
  }
}

module.exports = new ScenarioController();
