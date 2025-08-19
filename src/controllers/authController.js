const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const AppError = require('../utils/errors');
const authService = require('../services/authService');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.API_BASE_URL}/api/auth/google/callback`
);

const AuthController = {
  async register (req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Use authService instead of duplicating logic
      await authService.register({ name, email, password });

      return res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
      if (err.message === 'Email already in use') {
        return res.status(409).json({ message: 'User already exists' });
      }
      next(err);
    }
  },

  async login (req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async logout (req, res) {
    return res.status(200).json({ message: 'Logged out successfully' });
  },

  async googleOAuth (req, res) {
    try {
      const { mode } = req.query;

      if (!mode || !['login', 'register'].includes(mode)) {
        return res.status(400).json({ message: 'Invalid mode. Use ?mode=login or ?mode=register' });
      }

      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['profile', 'email'],
        state: mode
      });

      return res.redirect(url);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to initiate Google login.' });
    }
  },

  async googleCallback (req, res, next) {
    try {
      const { code, state: mode } = req.query;

      if (!code) throw new AppError('Authorization code is missing', 400);
      if (!mode || !['login', 'register'].includes(mode)) {
        throw new AppError('Invalid OAuth mode', 400);
      }

      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data } = await oauth2.userinfo.get();
      const { name, email, picture } = data;

      if (!email) throw new AppError('Google login failed: No email found', 400);

      let user = await User.findOne({ email });

      if (mode === 'register') {
        if (user) {
          return res.redirect(`${process.env.FRONTEND_URL}/register?error=User already exists`);
        }

        user = await User.create({
          name,
          email,
          avatar: picture || 'default-avatar.png',
          password: null, // No password initially - user can set one later if desired
          role: 'user',
          theme: 'light',
          xp: 0,
          level: 1,
          streak: 0,
          badges: [],
          goals: [],
          provider: 'google'
        });
      } else if (mode === 'login') {
        if (!user) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=No account found`);
        }
      }

      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = AuthController;
