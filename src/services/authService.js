const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  async register({ name, email, password }) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserRepository.create({ name, email, password: hashedPassword });

    return user;
  }

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { token, user };
  }
}

const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' } // Token valid for 1 hour
);

const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);


module.exports = new AuthService();
