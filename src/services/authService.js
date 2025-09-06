const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/errors'); // Use your error utility for consistency

class AuthService {
  /**
   * Register a new user
   */
  async register ({ name, email, password }) {
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
  async login ({ email, password }) {
    // Find user by email with password
    const user = await UserRepository.findByEmailWithPassword(email);
    if (!user) throw new AppError('Invalid credentials', 401);

    // Check if user has a password (Google users might not have one)
    if (!user.password) {
      throw new AppError('This account was created with Google. Please use Google Sign-In or set a password in your profile.', 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    // Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token valid for 7 days to match controller
    );

    // Return token + safe user data
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        theme: user.theme,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        badges: user.badges
      }
    };
  }
}

module.exports = new AuthService();
