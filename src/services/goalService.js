const mongoose = require('mongoose');
const User = require('../models/User');
const AppError = require('../utils/errors');

class GoalService {
  async createGoal (userId, { title, target, deadline, reminder }) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    user.goals.push({ title, target, deadline, reminder, progress: 0, completed: false });
    await user.save();
    return user.goals;
  }

  async getGoals (userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user.goals;
  }

  async updateGoalProgress (userId, goalId, increment = 1) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const goal = user.goals.id(goalId);
    if (!goal) throw new AppError('Goal not found', 404);

    goal.progress += Number(increment) || 1;
    if (goal.progress >= goal.target) goal.completed = true;

    await user.save();
    return goal;
  }

  async deleteGoal (userId, goalId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const cleanId = String(goalId || '').trim();
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      throw new AppError('Goal not found', 404);
    }

    const before = user.goals.length;
    user.goals = user.goals.filter(g => String(g._id) !== cleanId);
    if (user.goals.length === before) throw new AppError('Goal not found', 404);

    await user.save();
    return { message: 'Goal deleted successfully' };
  }
}

module.exports = new GoalService();
