const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  target: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  deadline: { type: Date },
  reminder: { type: Date },
  completed: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // Secure password
  password: { type: String, default: null, select: false },

  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Profile
  avatar: { type: String, default: 'default-avatar.png' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },

  // Gamification
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: { type: [String], default: [] },
  streak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },

  // Goals
  goals: { type: [goalSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
