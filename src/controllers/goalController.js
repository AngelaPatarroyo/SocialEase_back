const GoalService = require('../services/goalService');

class GoalController {
  async createGoal(req, res, next) {
    try {
      const goals = await GoalService.createGoal(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: goals
      });
    } catch (err) {
      next(err);
    }
  }

  async getGoals(req, res, next) {
    try {
      const goals = await GoalService.getGoals(req.user.id);
      res.status(200).json({ success: true, data: goals });
    } catch (err) {
      next(err);
    }
  }

  async updateGoalProgress(req, res, next) {
    try {
      const goal = await GoalService.updateGoalProgress(req.user.id, req.params.goalId, req.body.increment || 1);
      res.status(200).json({
        success: true,
        message: 'Goal progress updated successfully',
        data: goal
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteGoal(req, res, next) {
    try {
      const result = await GoalService.deleteGoal(req.user.id, req.params.goalId);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GoalController();
