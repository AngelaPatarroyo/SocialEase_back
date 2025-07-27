const AuthService = require('../services/authService');
const AppError = require('../utils/errors');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  /**
   * Register a new user
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await AuthService.register({ name, email, password });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user and return token
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login({ email, password });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Google Login - Create or Update user
   */
  async googleLogin(req, res, next) {
    try {
      const { name, email, avatar } = req.body;

      if (!email) {
        throw new AppError('Email is required', 400);
      }

      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user without password
        user = await User.create({
          name,
          email,
          avatar,
          password: null
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Google login successful',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
