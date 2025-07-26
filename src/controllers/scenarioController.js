const Scenario = require('../models/Scenario');
const AppError = require('../utils/errors');
const { updateUserGamification } = require('../services/gamificationService');
const ProgressService = require('../services/progressService');

class ScenarioController {
  /**
   * @desc Get all scenarios
   * @route GET /api/scenarios
   * @access Private
   */
  async getScenarios(req, res, next) {
    try {
      const scenarios = await Scenario.find();
      res.status(200).json({
        success: true,
        data: scenarios
      });
    } catch (err) {
      next(new AppError('Failed to fetch scenarios', 500));
    }
  }

  /**
   * @desc Get scenario by ID
   * @route GET /api/scenarios/:id
   * @access Private
   */
  async getScenarioById(req, res, next) {
    try {
      const { id } = req.params;
      const scenario = await Scenario.findById(id);
      if (!scenario) return next(new AppError('Scenario not found', 404));

      res.status(200).json({
        success: true,
        data: scenario
      });
    } catch (err) {
      next(new AppError('Failed to fetch scenario details', 500));
    }
  }

  /**
   * @desc Create a new scenario
   * @route POST /api/scenarios
   * @access Admin
   */
  async createScenario(req, res, next) {
    try {
      const { title, description, difficulty, points } = req.body;
      const scenario = new Scenario({ title, description, difficulty, points });
      await scenario.save();

      res.status(201).json({
        success: true,
        message: 'Scenario created successfully',
        data: scenario
      });
    } catch (err) {
      next(new AppError('Failed to create scenario', 400));
    }
  }

  /**
   * @desc Update scenario details
   * @route PUT /api/scenarios/:id
   * @access Admin
   */
  async updateScenario(req, res, next) {
    try {
      const scenario = await Scenario.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!scenario) return next(new AppError('Scenario not found', 404));

      res.status(200).json({
        success: true,
        message: 'Scenario updated successfully',
        data: scenario
      });
    } catch (err) {
      next(new AppError('Failed to update scenario', 400));
    }
  }

  /**
   * @desc Delete a scenario
   * @route DELETE /api/scenarios/:id
   * @access Admin
   */
  async deleteScenario(req, res, next) {
    try {
      const scenario = await Scenario.findByIdAndDelete(req.params.id);
      if (!scenario) return next(new AppError('Scenario not found', 404));

      res.status(200).json({
        success: true,
        message: 'Scenario deleted successfully'
      });
    } catch (err) {
      next(new AppError('Failed to delete scenario', 400));
    }
  }

  /**
   * @desc Mark scenario as completed by user, update gamification & progress
   * @route POST /api/scenarios/:scenarioId/complete
   * @access Private
   */
  async completeScenario(req, res, next) {
    try {
      const { scenarioId } = req.params;
      const scenario = await Scenario.findById(scenarioId);
      if (!scenario) return next(new AppError('Scenario not found', 404));

      const xpEarned = scenario.points || 50;

      // ✅ Update user gamification (XP, level, streak, badges)
      await updateUserGamification(req.user.id, xpEarned);

      // ✅ Update progress (track completed scenarios)
      await ProgressService.updateProgress(req.user.id, scenarioId);

      res.status(200).json({
        success: true,
        message: `Scenario completed! You earned ${xpEarned} XP and your progress has been updated.`
      });
    } catch (err) {
      console.error(err);
      next(new AppError('Failed to complete scenario', 500));
    }
  }
}

module.exports = new ScenarioController();
