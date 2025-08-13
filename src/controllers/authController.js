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
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Use authService instead of duplicating logic
      const user = await authService.register({ name, email, password });

      return res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
      if (err.message === 'Email already in use') {
        return res.status(409).json({ message: 'User already exists' });
      }
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      console.log('[AuthController] Login request received');
      const { email, password } = req.body;

      console.log('[AuthController] Searching for user:', email);
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        console.log('[AuthController] No user with email:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

              console.log('[AuthController] User found, checking password');
      // Check if user has a password (Google users might not have one)
      if (!user.password) {
                  console.log('[AuthController] Google user without password');
        return res.status(401).json({ 
          message: 'This account was created with Google. Please use Google Sign-In or set a password in your profile.' 
        });
      }

              console.log('[AuthController] Checking password match');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
                  console.log('[AuthController] Password mismatch');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

              console.log('[AuthController] Password correct, generating token');
      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

              console.log('[AuthController] Login successful');
      return res.status(200).json({ token, user: userWithoutPassword }); //  return both
    } catch (err) {
      console.error('❌ [AuthController] Login error:', err);
      next(err);
    }
  },

  async logout(req, res) {
    return res.status(200).json({ message: 'Logged out successfully' });
  },

  async googleOAuth(req, res) {
    try {
      const { mode } = req.query;
      console.log(`[GoogleOAuth] Initiating ${mode} flow`);
      
      if (!mode || !['login', 'register'].includes(mode)) {
        console.error(`[GoogleOAuth] Invalid mode: ${mode}`);
        return res.status(400).json({ message: 'Invalid mode. Use ?mode=login or ?mode=register' });
      }

      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['profile', 'email'],
        state: mode,
      });

      console.log(`[GoogleOAuth] Redirecting to Google OAuth for ${mode}`);
      return res.redirect(url);
    } catch (error) {
      console.error('Google OAuth Redirect Error:', error);
      return res.status(500).json({ message: 'Failed to initiate Google login.' });
    }
  },

  async googleCallback(req, res, next) {
    try {
      const { code, state: mode } = req.query;
      console.log(`[GoogleOAuth] Callback received for mode: ${mode}`);
      
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
          provider: 'google',
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
      console.error('Google OAuth Callback Error:', error);
      return next(error);
    }
  },
};

module.exports = AuthController;
