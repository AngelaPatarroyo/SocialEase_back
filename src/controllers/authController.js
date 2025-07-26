const AuthService = require('../services/authService');
const AppError = require('../utils/errors');

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
      next(error); // Let global error handler manage AppError or unexpected errors
    }
  }

  /**
   * Login user and return token
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login({ email, password });

      res.status(200).json(data); // AuthService returns { success, token, user }
    } catch (error) {
      next(error); // Pass to error handler
    }
  }
}

module.exports = new AuthController();
