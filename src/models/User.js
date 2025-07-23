const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Gamification fields
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }], // Achievements
  streak: { type: Number, default: 0 }, // Daily streak counter
  lastCompletedDate: { type: Date } // Last completed scenario for streak calculation

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
