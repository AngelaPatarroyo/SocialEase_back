const mongoose = require('mongoose');

const selfAssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  socialLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
  primaryGoal: { type: String },
  comfortZones: [{ type: String }],
  preferredScenarios: [{ type: String }],
  anxietyTriggers: [{ type: String }],
  communicationConfidence: { type: Number, min: 1, max: 10 },
  socialFrequency: { type: String }, // e.g., "daily", "weekly", "rarely"

  //  Add these:
  confidenceBefore: { type: Number, min: 1, max: 10 },
  confidenceAfter: { type: Number, min: 1, max: 10 },
  reflectionPositive: { type: String },
  reflectionNegative: { type: String },
  reflectionNegativeThoughts: { type: String },
  reflectionAlternativeThoughts: { type: String },
  reflectionActionPlan: { type: String },
  reflectionCompassion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SelfAssessment', selfAssessmentSchema);
