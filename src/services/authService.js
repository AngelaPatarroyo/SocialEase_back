const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new Error('Email already in use');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserRepository.create({ name, email, password: hashedPassword });

    return user;
  }

  async login({ email, password }) {
    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token valid for 1 day
    );

    return { token, user };
  }
}

module.exports = new AuthService();
