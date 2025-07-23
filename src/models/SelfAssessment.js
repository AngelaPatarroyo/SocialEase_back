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
}, { timestamps: true });

module.exports = mongoose.model('SelfAssessment', selfAssessmentSchema);
