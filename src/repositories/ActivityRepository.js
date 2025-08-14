const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Progress = require('../models/Progress');
const SelfAssessment = require('../models/SelfAssessment');

class ActivityRepository {
  async getRecentActivities(limit = 50) {
    try {
      console.log('🔍 [ActivityRepository] Getting recent activities...');

      // Get recent feedback submissions
      const recentFeedback = await Feedback.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email')
        .populate('scenarioId', 'title');

      // Get recent user registrations
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(limit);

      // Get recent progress updates (e.g., scenario completions)
      const recentProgress = await Progress.find()
        .sort({ updatedAt: -1 })
        .limit(limit)
        .populate('userId', 'name email')
        .populate('scenarioId', 'title');

      // Get recent self-assessment submissions
      const recentSelfAssessments = await SelfAssessment.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email');

      // Combine and sort all activities by timestamp
      const allActivities = [
        ...recentFeedback.map(f => ({
          type: 'feedback',
          action: 'submitted feedback',
          user: f.userId,
          scenario: f.scenarioId,
          timestamp: f.createdAt,
          details: { reflection: f.reflection, rating: f.rating }
        })),
        ...recentUsers.map(u => ({
          type: 'user',
          action: 'registered',
          user: u,
          timestamp: u.createdAt,
          details: { email: u.email }
        })),
        ...recentProgress.map(p => ({
          type: 'progress',
          action: 'completed scenario',
          user: p.userId,
          scenario: p.scenarioId,
          timestamp: p.updatedAt,
          details: { score: p.score, completedSteps: p.completedSteps }
        })),
        ...recentSelfAssessments.map(sa => ({
          type: 'self-assessment',
          action: 'submitted self-assessment',
          user: sa.userId,
          timestamp: sa.createdAt,
          details: { score: sa.score, totalQuestions: sa.totalQuestions }
        }))
      ].sort((a, b) => b.timestamp - a.timestamp);

      console.log(`📊 [ActivityRepository] Found ${allActivities.length} recent activities.`);
      return allActivities.slice(0, limit); // Ensure limit is applied after combining
    } catch (error) {
      console.error('❌ [ActivityRepository] Error getting recent activities:', error);
      throw error;
    }
  }
}

module.exports = new ActivityRepository();
