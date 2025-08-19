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

// Add additional database indexes for better query performance
selfAssessmentSchema.index({ confidenceBefore: -1 }); // For confidence level queries
selfAssessmentSchema.index({ confidenceAfter: -1 }); // For confidence improvement tracking
selfAssessmentSchema.index({ socialLevel: 1 }); // For social level filtering
selfAssessmentSchema.index({ socialFrequency: 1 }); // For frequency-based queries
selfAssessmentSchema.index({ communicationConfidence: -1 }); // For confidence sorting
selfAssessmentSchema.index({ createdAt: -1 }); // For recent assessments
selfAssessmentSchema.index({ updatedAt: -1 }); // For assessment modifications

// Compound indexes for complex queries
selfAssessmentSchema.index({ userId: 1, createdAt: -1 }); // User assessments over time
selfAssessmentSchema.index({ socialLevel: 1, confidenceAfter: -1 }); // Level + confidence
selfAssessmentSchema.index({ socialFrequency: 1, communicationConfidence: -1 }); // Frequency + confidence
selfAssessmentSchema.index({ confidenceBefore: -1, confidenceAfter: -1 }); // Confidence improvement

module.exports = mongoose.model('SelfAssessment', selfAssessmentSchema);
