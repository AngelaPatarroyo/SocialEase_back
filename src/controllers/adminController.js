const User = require('../models/User');
const AppError = require('../utils/errors');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (err) {
      next(new AppError('Failed to fetch users', 500));
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');

      if (!user) return next(new AppError('User not found', 404));

      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (err) {
      next(new AppError('Failed to update user role', 400));
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return next(new AppError('User not found', 404));

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      next(new AppError('Failed to delete user', 400));
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const totalUsers = await User.countDocuments();
      const totalScenarios = await require('../models/Scenario').countDocuments();
      const totalFeedback = await require('../models/Feedback').countDocuments();
      const totalProgress = await require('../models/Progress').countDocuments();

      const roleStats = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
      const avgRatingData = await require('../models/Feedback').aggregate([{ $group: { _id: null, avgRating: { $avg: "$rating" } } }]);
      const avgRating = avgRatingData.length > 0 ? avgRatingData[0].avgRating : 0;

      res.status(200).json({ totalUsers, totalScenarios, totalFeedback, totalProgress, roleStats, avgRating: avgRating.toFixed(2) });
    } catch (err) {
      next(new AppError('Failed to fetch analytics', 500));
    }
  }
}

module.exports = new AdminController();
