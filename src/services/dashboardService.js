const UserRepository = require('../repositories/UserRepository');
const ProgressRepository = require('../repositories/ProgressRepository');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const AppError = require('../utils/errors');

class DashboardService {
  /**
   * Get user's dashboard data
   * Includes XP, level, streak, badges, completed scenarios, self-assessments
   * Returns anxiety-safe supportive messages
   */
  async getDashboard(userId) {
    // Fetch user profile
    const user = await UserRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const { xp, level, streak, badges } = user;

    // Fetch completed scenarios
    const progress = await ProgressRepository.findByUserId(userId);
    const completedScenarios = progress ? progress.completedScenarios : [];

    // Fetch self-assessments
    const assessments = await SelfAssessmentRepository.findByUserId(userId);

    // Generate anxiety-safe supportive messages
    const messages = [];
    if (streak >= 5) messages.push(`You're on a ${streak}-day streak! Great consistency.`);
    if (xp > 0) messages.push("Your effort is paying off – keep going at your pace.");
    if (badges.length > 0) messages.push("You've unlocked new achievements. Well done!");
    if (assessments.length > 0) messages.push("Your self-reflection shows steady growth.");

    return {
      stats: { xp, level, streak, badges },
      progress: {
        completedScenariosCount: completedScenarios.length,
        recentScenarios: completedScenarios.slice(-3) // Show last 3
      },
      selfAssessments: assessments.slice(-3), // Show last 3 assessments
      messages
    };
  }
}

module.exports = new DashboardService();
