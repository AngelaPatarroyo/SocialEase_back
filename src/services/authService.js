const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/errors'); // Use your error utility for consistency

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new AppError('Email already in use', 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all required fields
    const user = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
      avatar: 'default-avatar.png',
      provider: 'local',
      role: 'user',
      theme: 'light',
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      goals: [],
      hasCompletedSelfAssessment: false
    });

    // Return safe user data
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  /**
   * Login and return token + user data
   */
  async login({ email, password }) {
    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError('Invalid credentials', 401);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    // Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role }, // ✅ Ensure `id` is in payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token valid for 1 day
    );

    // Return token + safe user data
    return {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = new AuthService();
