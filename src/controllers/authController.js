const AuthService = require('../services/authService');
const AppError = require('../utils/errors');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await AuthService.register({ name, email, password });

      if (!user) return next(new AppError('Failed to register user', 400));

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login({ email, password });

      if (!data) return next(new AppError('Invalid credentials', 401));

      res.status(200).json(data);
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  }
}

module.exports = new AuthController();
