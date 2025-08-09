// models/SelfAssessment.js
const mongoose = require('mongoose');

const selfAssessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    confidenceBefore: { type: Number, required: true, min: 0, max: 100 },
    confidenceAfter: { type: Number, required: true, min: 0, max: 100 },
    primaryGoal: { type: String, required: true },
    comfortZones: [{ type: String, required: true }],
    preferredScenarios: [{ type: String, required: true }],
    anxietyTriggers: [{ type: String, required: true }],
    socialFrequency: { type: String, enum: ['rarely', 'sometimes', 'often', 'daily'], required: true },
    communicationConfidence: { type: Number, min: 0, max: 10, required: true },
    socialLevel: { type: String, enum: ['beginner', 'developing', 'confident', 'advanced'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SelfAssessment', selfAssessmentSchema);
