const UserRepository = require('../repositories/UserRepository');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const FeedbackRepository = require('../repositories/FeedbackRepository');
const ProgressRepository = require('../repositories/ProgressRepository');
const AppError = require('../utils/errors');

class AdminService {
  async getAllUsers() {
    return await UserRepository.findAll();
  }

  async updateUserRole(userId, role) {
    const user = await UserRepository.updateRole(userId, role);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async deleteUser(userId) {
    const user = await UserRepository.delete(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async getAnalytics() {
    const totalUsers = await UserRepository.count();
    const totalScenarios = await ScenarioRepository.count();
    const totalFeedback = await FeedbackRepository.count();
    const totalProgress = await ProgressRepository.count();

    const roleStats = await UserRepository.getRoleStats();
    const avgRating = await FeedbackRepository.getAverageRating();

    return { totalUsers, totalScenarios, totalFeedback, totalProgress, roleStats, avgRating };
  }
}

module.exports = new AdminService();
