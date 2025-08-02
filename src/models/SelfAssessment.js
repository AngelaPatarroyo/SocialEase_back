const mongoose = require('mongoose');

const SelfAssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  confidenceBefore: { type: Number, required: true },
  confidenceAfter: { type: Number, required: true },
  primaryGoal: { type: String, required: true },
  comfortZones: { type: [String], required: true },
  preferredScenarios: { type: [String], required: true },
  anxietyTriggers: { type: [String], required: true },
  socialFrequency: { type: String, required: true },
  communicationConfidence: { type: String, required: true },
  socialLevel: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SelfAssessment', SelfAssessmentSchema);
