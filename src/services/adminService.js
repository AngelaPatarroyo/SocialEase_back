const UserRepository = require('../repositories/UserRepository');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const FeedbackRepository = require('../repositories/FeedbackRepository');
const ProgressRepository = require('../repositories/ProgressRepository');
const AppError = require('../utils/errors');
const badgeManager = require('../utils/badgeManager');

class AdminService {
  async getAllUsers () {
    return await UserRepository.findAll();
  }

  async createUser (userData) {
    const { name, email, password, role = 'user' } = userData;

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with admin-provided data
    const newUser = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      avatar: 'default-avatar.png',
      provider: 'local',
      theme: 'light',
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      goals: [],
      hasCompletedSelfAssessment: false
    });

    // Return user without password
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
  }

  async updateUserRole (userId, role) {
    const user = await UserRepository.updateRole(userId, role);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async deleteUser (userId) {
    const user = await UserRepository.delete(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async getAnalytics () {
    const totalUsers = await UserRepository.count();
    const totalScenarios = await ScenarioRepository.count();
    const totalFeedback = await FeedbackRepository.count();
    const totalProgress = await ProgressRepository.count();

    const roleStats = await UserRepository.getRoleStats();
    const avgRating = await FeedbackRepository.getAverageRating();

    return { totalUsers, totalScenarios, totalFeedback, totalProgress, roleStats, avgRating };
  }

  async getAllFeedback () {
    try {
      const feedback = await FeedbackRepository.findAll();
      return feedback;
    } catch (error) {
      throw new AppError('Failed to fetch feedback', 500);
    }
  }

  async deleteFeedback (feedbackId) {
    try {
      const result = await FeedbackRepository.delete(feedbackId);
      return result;
    } catch (error) {
      throw new AppError('Failed to delete feedback', 500);
    }
  }

  async cleanupBadges () {
    const User = require('../models/User');
    return await badgeManager.cleanAllUsersBadges(User);
  }

  async cleanupUserBadges (userId) {
    const User = require('../models/User');
    return await badgeManager.forceCleanUserBadges(User, userId);
  }

  async removeUserBadges (userId, badgesToRemove) {
    const User = require('../models/User');
    return await badgeManager.removeSpecificBadges(User, userId, badgesToRemove);
  }
}

module.exports = new AdminService();
