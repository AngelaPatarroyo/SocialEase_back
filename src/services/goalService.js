const User = require('../models/User');
const AppError = require('../utils/errors');

class GoalService {
  /**
   * Create a new goal for the user
   */
  async createGoal(userId, { title, target, deadline, reminder }) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    user.goals.push({ title, target, deadline, reminder, progress: 0, completed: false });
    await user.save();

    return user.goals;
  }

  /**
   * Get all goals for a user
   */
  async getGoals(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    return user.goals;
  }

  /**
   * Update goal progress (called when completing/replaying scenarios)
   */
  async updateGoalProgress(userId, goalId, increment = 1) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const goal = user.goals.id(goalId);
    if (!goal) throw new AppError('Goal not found', 404);

    goal.progress += increment;
    if (goal.progress >= goal.target) goal.completed = true;

    await user.save();
    return goal;
  }

  /**
   * Delete a goal
   */
  async deleteGoal(userId, goalId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const goal = user.goals.id(goalId);
    if (!goal) throw new AppError('Goal not found', 404);

    goal.remove();
    await user.save();

    return { message: 'Goal deleted successfully' };
  }
}

module.exports = new GoalService();
