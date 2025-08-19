const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  reflection: { type: String, required: true },
  rating: { type: Number }
}, { timestamps: true });

// Add database indexes for better query performance
feedbackSchema.index({ userId: 1 }); // For user-specific feedback queries
feedbackSchema.index({ scenarioId: 1 }); // For scenario-specific feedback
feedbackSchema.index({ rating: -1 }); // For rating-based sorting
feedbackSchema.index({ createdAt: -1 }); // For recent feedback
feedbackSchema.index({ updatedAt: -1 }); // For feedback modifications

// Compound indexes for complex queries
feedbackSchema.index({ userId: 1, createdAt: -1 }); // User feedback over time
feedbackSchema.index({ scenarioId: 1, rating: -1 }); // Scenario feedback by rating
feedbackSchema.index({ userId: 1, scenarioId: 1 }); // User feedback for specific scenario
feedbackSchema.index({ rating: -1, createdAt: -1 }); // High-rated recent feedback

module.exports = mongoose.model('Feedback', feedbackSchema);
