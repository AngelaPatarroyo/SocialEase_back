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
    console.log('DEBUG: Entered DashboardService.getDashboard with userId:', userId);

    try {
      // Fetch user profile
      const user = await UserRepository.findById(userId);
      console.log('DEBUG: User fetched:', user);

      if (!user) {
        console.error('DEBUG: No user found in DB for ID:', userId);
        throw new AppError('User not found', 404);
      }

      const { xp = 0, level = 1, streak = 0, badges = [] } = user;
      console.log('DEBUG: User XP/Level data:', { xp, level, streak, badgesCount: badges.length });

      // Check for new badges and award them
      const newBadges = badgeManager.checkAchievements(user);
      if (newBadges.length > 0) {
        console.log(`[DashboardService] 🎖️ New badges awarded: ${newBadges.join(', ')}`);
        user.badges = Array.from(new Set([...(user.badges || []), ...newBadges]));
        await user.save();
        console.log(`[DashboardService] User badges updated: ${user.badges.join(', ')}`);
      }

      // Fetch progress safely
      const progress = await ProgressRepository.findByUserId(userId);
      console.log('DEBUG: Progress fetched:', progress);

      const completedScenarios = progress?.completedScenarios || [];

      // Fetch self-assessments safely
      const assessments = (await SelfAssessmentRepository.findByUserId(userId)) || [];
      console.log('DEBUG: Self-assessments fetched:', assessments.length);

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

      console.log('DEBUG: Final dashboard response:', response);
      return response;
    } catch (error) {
      console.error('ERROR in DashboardService.getDashboard:', error.message, error.stack);
      throw error; // Propagate error to controller
    }
  }
}

module.exports = new DashboardService();
