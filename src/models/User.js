const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Goal description
  target: { type: Number, required: true }, // Target count (e.g., 5 scenarios)
  progress: { type: Number, default: 0 }, // Current progress
  deadline: { type: Date }, // Optional deadline
  reminder: { type: Date }, // Reminder time
  completed: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Profile fields
  avatar: { type: String, default: 'default-avatar.png' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },

  // Gamification fields
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }],
  streak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },

  // NEW: Goals
  goals: [goalSchema]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
