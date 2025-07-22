const User = require('../models/User');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new UserRepository();
