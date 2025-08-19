const UserRepository = require('../repositories/UserRepository');
const ProgressRepository = require('../repositories/ProgressRepository');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const ActivityRepository = require('../repositories/ActivityRepository');
const GoalRepository = require('../repositories/GoalRepository');
const badgeManager = require('../utils/badgeManager');
const AppError = require('../utils/errors');

class DashboardService {
  /**
   * Get user's dashboard data
   */
  async getDashboard (userId) {
    try {
      // Load user profile
      const profile = await UserRepository.findById(userId);

      // Load user stats
      const stats = await this.getUserStats(userId);

      // Check for new badges
      const newBadges = await badgeManager.checkForNewBadges(userId);
      if (newBadges.length > 0) {
        const user = await UserRepository.findById(userId);
        user.badges = [...new Set([...user.badges, ...newBadges])];
        await user.save();
      }

      // Load recent progress
      const progress = await ProgressRepository.findRecentByUserId(userId);

      // Load recent assessments
      const assessments = await SelfAssessmentRepository.findRecentByUserId(userId);

      // Load recent activities
      const activities = await ActivityRepository.getRecentActivities(userId);

      // Load goals
      const goals = await GoalRepository.findByUserId(userId);

      return {
        profile,
        stats,
        progress,
        assessments,
        activities,
        goals
      };
    } catch (error) {
      throw new AppError('Failed to load dashboard', 500);
    }
  }
}

module.exports = new DashboardService();
