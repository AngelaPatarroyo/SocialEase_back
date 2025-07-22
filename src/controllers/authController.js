const AuthService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const user = await AuthService.register({ name, email, password });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login({ email, password });
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
