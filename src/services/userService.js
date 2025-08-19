const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/errors');

class UserService {
  /**
   * Fetch user profile by ID
   */
  async getProfile (userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile (userId, updates) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    // Only update fields that are provided
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    if (updates.theme !== undefined) user.theme = updates.theme;

    return await user.save();
  }
}

module.exports = new UserService();
