const AdminService = require('../services/adminService');
const AppError = require('../utils/errors');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const users = await AdminService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await AdminService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const user = await AdminService.updateUserRole(req.params.id, req.body.role);
      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await AdminService.deleteUser(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const analytics = await AdminService.getAnalytics();
      res.status(200).json(analytics);
    } catch (err) {
      next(err);
    }
  }

  async getAllFeedback(req, res, next) {
    try {
      console.log('🔍 [AdminController] getAllFeedback called');
      const feedback = await AdminService.getAllFeedback();
      console.log('📊 [AdminController] Feedback from service:', {
        type: typeof feedback,
        isArray: Array.isArray(feedback),
        length: feedback ? feedback.length : 'null/undefined',
        sample: feedback && feedback.length > 0 ? feedback[0] : 'no data'
      });
      res.status(200).json(feedback); // Send array directly for consistency
    } catch (err) {
      console.error('❌ [AdminController] Error in getAllFeedback:', err);
      next(err);
    }
  }

  async deleteFeedback(req, res, next) {
    try {
      const { id } = req.params;
      console.log('🗑️ [AdminController] deleteFeedback called with ID:', id);
      
      const result = await AdminService.deleteFeedback(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
      
      console.log('✅ [AdminController] Feedback deleted successfully:', { id });
      res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (err) {
      console.error('❌ [AdminController] Error in deleteFeedback:', err);
      next(err);
    }
  }

  async cleanupBadges(req, res, next) {
    try {
      const result = await AdminService.cleanupBadges();
      res.status(200).json({
        success: true,
        message: 'Badge cleanup completed successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async cleanupUserBadges(req, res, next) {
    try {
      const result = await AdminService.cleanupUserBadges(req.params.userId);
      res.status(200).json({
        success: true,
        message: 'User badges cleaned successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async removeUserBadges(req, res, next) {
    try {
      const result = await AdminService.removeUserBadges(req.params.userId, req.body.badges);
      res.status(200).json({
        success: true,
        message: 'Badges removed successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
