const mongoose = require('mongoose');

const ScenarioPreparationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  fear: String,
  anxiety: Number,
  support: String,
  visualization: String,
  goal: String,
  step: { type: String, default: 'preparation' },
  createdAt: { type: Date, default: Date.now }
});

// Add database indexes for better query performance
ScenarioPreparationSchema.index({ user: 1 }); // For user-specific preparations
ScenarioPreparationSchema.index({ scenario: 1 }); // For scenario-specific preparations
ScenarioPreparationSchema.index({ step: 1 }); // For step-based filtering
ScenarioPreparationSchema.index({ anxiety: -1 }); // For anxiety level sorting
ScenarioPreparationSchema.index({ createdAt: -1 }); // For recent preparations

// Compound indexes for complex queries
ScenarioPreparationSchema.index({ user: 1, scenario: 1 }); // User preparation for specific scenario
ScenarioPreparationSchema.index({ user: 1, createdAt: -1 }); // User preparations over time
ScenarioPreparationSchema.index({ scenario: 1, step: 1 }); // Scenario preparations by step
ScenarioPreparationSchema.index({ user: 1, step: 1 }); // User preparations by step

module.exports = mongoose.model('ScenarioPreparation', ScenarioPreparationSchema);
