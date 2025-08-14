const UserRepository = require('../repositories/UserRepository');
const ProgressRepository = require('../repositories/ProgressRepository');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const badgeManager = require('../utils/badgeManager');
const AppError = require('../utils/errors');

class DashboardService {
  /**
   * Get user's dashboard data
   */
  async getDashboard(userId) {
    console.log('DashboardService: Loading dashboard:', userId);

    try {
      // Fetch user profile
      const user = await UserRepository.findById(userId);
      console.log('DashboardService: Profile loaded');

      if (!user) {
        console.error('DashboardService: User not found:', userId);
        throw new AppError('User not found', 404);
      }

      const { xp = 0, level = 1, streak = 0, badges = [] } = user;
      console.log('DashboardService: Stats loaded');

      // Check for new badges and award them
      const newBadges = await badgeManager.checkAchievements(user);
      if (newBadges && newBadges.length > 0) {
        console.log(`[DashboardService] New badges: ${newBadges.join(', ')}`);
        user.badges = Array.from(new Set([...(user.badges || []), ...newBadges]));
        await user.save();
        console.log(`[DashboardService] Badges updated: ${user.badges.join(', ')}`);
      }

      // Fetch progress safely
      const progress = await ProgressRepository.findByUserId(userId);
      console.log('DashboardService: Progress loaded');

      const completedScenarios = progress?.completedScenarios || [];

      // Fetch self-assessments safely
      const assessments = (await SelfAssessmentRepository.findByUserId(userId)) || [];
      console.log('DashboardService: Assessments loaded');

      // Generate anxiety-safe supportive messages
      const messages = [];
      if (streak >= 5) messages.push(`You're on a ${streak}-day streak! Great consistency.`);
      if (xp > 0) messages.push("Your effort is paying off – keep going at your pace.");
      if (badges.length > 0) messages.push("You've unlocked new achievements. Well done!");
      if (assessments.length > 0) messages.push("Your self-reflection shows steady growth.");

      const response = {
        stats: { xp, level, streak, badges: user.badges || [] },
        progress: {
          completedScenariosCount: completedScenarios.length,
          recentScenarios: completedScenarios.slice(-3) // Show last 3
        },
        selfAssessments: assessments.slice(-3), // Show last 3 assessments
        messages
      };

      console.log('DashboardService: Dashboard loaded');
      return response;
    } catch (error) {
      console.error('ERROR in DashboardService.getDashboard:', error.message, error.stack);
      throw error; // Propagate error to controller
    }
  }
}

module.exports = new DashboardService();
