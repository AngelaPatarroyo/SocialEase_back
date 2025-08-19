const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Progress = require('../models/Progress');
const SelfAssessment = require('../models/SelfAssessment');

class ActivityRepository {
  async getRecentActivities(userId, limit = 10) {
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
