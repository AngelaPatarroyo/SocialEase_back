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
}

module.exports = new AdminController();
