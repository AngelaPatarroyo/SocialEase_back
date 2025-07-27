const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/errors');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth environment variables');
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.API_BASE_URL}/api/auth/google/callback` // Dynamic redirect URI
);

class AuthController {
  /**
   *  Redirect user to Google OAuth Consent Screen
   */
  async googleOAuth(req, res) {
    try {
      const { mode } = req.query; // login or register
      if (!mode || !['login', 'register'].includes(mode)) {
        return res.status(400).json({ message: 'Invalid mode. Use ?mode=login or ?mode=register' });
      }

      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['profile', 'email'],
        state: mode, // pass mode for callback
      });

      return res.redirect(url);
    } catch (error) {
      console.error('Google OAuth Redirect Error:', error);
      return res.status(500).json({ message: 'Failed to initiate Google login.' });
    }
  }

  /**
   * Handle Google OAuth Callback
   */
  async googleCallback(req, res, next) {
    try {
      const { code, state: mode } = req.query; // mode comes from state param
      if (!code) throw new AppError('Authorization code is missing', 400);
      if (!mode || !['login', 'register'].includes(mode)) {
        throw new AppError('Invalid OAuth mode', 400);
      }

      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Fetch user profile
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data } = await oauth2.userinfo.get();
      const { name, email, picture } = data;

      if (!email) throw new AppError('Google login failed: No email found', 400);

      //  Check user existence
      let user = await User.findOne({ email });

      if (mode === 'register') {
        if (user) {
          return res.redirect(`${process.env.FRONTEND_URL}/register?error=User already exists`);
        }
        // Create user
        user = await User.create({
          name,
          email,
          avatar: picture || 'default-avatar.png',
          password: null,
          role: 'user',
          theme: 'light',
          xp: 0,
          level: 1,
          streak: 0,
          badges: [],
          goals: [],
        });
      } else if (mode === 'login') {
        if (!user) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=No account found`);
        }
      }

      //  Issue JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      //  Redirect to success page with token
      return res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
    } catch (error) {
      console.error('Google OAuth Callback Error:', error);
      return next(error);
    }
  }
}

module.exports = new AuthController();
