const User = require('../models/User');

class GoalRepository {
  async findByUserId (userId) {
    try {
      const user = await User.findById(userId);
      return user?.goals || [];
    } catch (error) {
      throw new Error(`Failed to fetch user goals: ${error.message}`);
    }
  }
}

module.exports = new GoalRepository();
