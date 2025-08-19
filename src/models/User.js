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

// Add database indexes for better query performance
userSchema.index({ email: 1 }); // Already unique, but explicit index
userSchema.index({ provider: 1 }); // For filtering by auth provider
userSchema.index({ role: 1 }); // For admin queries
userSchema.index({ xp: -1 }); // For leaderboards (descending)
userSchema.index({ level: -1 }); // For level-based queries
userSchema.index({ streak: -1 }); // For streak leaderboards
userSchema.index({ createdAt: -1 }); // For recent users
userSchema.index({ lastCompletedDate: -1 }); // For activity tracking
userSchema.index({ hasCompletedSelfAssessment: 1 }); // For assessment queries

// Compound indexes for complex queries
userSchema.index({ role: 1, createdAt: -1 }); // Admin + recent users
userSchema.index({ provider: 1, role: 1 }); // Provider + role filtering
userSchema.index({ xp: -1, level: -1 }); // XP + level leaderboards

module.exports = mongoose.model('User', userSchema);
