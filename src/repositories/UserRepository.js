const User = require('../models/User');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id).select('-password'); // ✅ Hide password
  }

  async findAll() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateRole(id, role) {
    return await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async count() {
    return await User.countDocuments();
  }

  async getRoleStats() {
    return await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
  }
}

module.exports = new UserRepository();
