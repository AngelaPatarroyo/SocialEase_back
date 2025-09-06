const UserRepository = require('../repositories/UserRepository');
const ProgressRepository = require('../repositories/ProgressRepository');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
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
      const stats = {
        xp: profile.xp || 0,
        level: profile.level || 1,
        streak: profile.streak || 0,
        badges: profile.badges || [],
        goalsCompleted: (profile.goals || []).filter(goal => goal.completed).length,
        totalGoals: (profile.goals || []).length
      };

      // Load recent progress (simplified)
      const progress = [];

      // Load recent assessments (simplified)
      const assessments = [];

      // Load goals
      const goals = await GoalRepository.findByUserId(userId);

      return {
        profile,
        stats,
        progress,
        assessments,
        goals
      };
    } catch (error) {
      throw new AppError('Failed to load dashboard', 500);
    }
  }
}

module.exports = new DashboardService();
