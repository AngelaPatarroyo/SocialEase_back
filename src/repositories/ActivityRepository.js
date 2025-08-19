const Activity = require('../models/Activity');

class ActivityRepository {
  async getRecentActivities (userId, limit = 10) {
    try {
      const allActivities = await Activity.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('scenarioId', 'title category difficulty')
        .populate('selfAssessmentId', 'anxietyLevel socialConfidence')
        .lean();

      return allActivities;
    } catch (error) {
      throw new Error(`Failed to fetch recent activities: ${error.message}`);
    }
  }
}

module.exports = new ActivityRepository();
