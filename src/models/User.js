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

  password: { type: String, default: null, select: false },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  avatar: { type: String, default: 'default-avatar.png' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: { type: [String], default: [] },
  streak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },

  hasCompletedSelfAssessment: { type: Boolean, default: false },
  selfAssessmentCompletedAt: { type: Date },
  selfAssessmentUpdatedAt: { type: Date },
  lastSelfAssessmentXpAt: { type: Date },

  goals: { type: [goalSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
