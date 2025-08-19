const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, 
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  points: { type: Number, required: true },
  vrSupported: { type: Boolean, default: false }
}, { timestamps: true });

// Add database indexes for better query performance
scenarioSchema.index({ slug: 1 }); // Already unique, but explicit index
scenarioSchema.index({ difficulty: 1 }); // For filtering by difficulty
scenarioSchema.index({ points: -1 }); // For sorting by points (descending)
scenarioSchema.index({ vrSupported: 1 }); // For VR filter queries
scenarioSchema.index({ createdAt: -1 }); // For recent scenarios
scenarioSchema.index({ title: 'text' }); // Text search on title

// Compound indexes for complex queries
scenarioSchema.index({ difficulty: 1, points: -1 }); // Difficulty + points sorting
scenarioSchema.index({ vrSupported: 1, difficulty: 1 }); // VR + difficulty filtering
scenarioSchema.index({ difficulty: 1, createdAt: -1 }); // Difficulty + recent

module.exports = mongoose.model('Scenario', scenarioSchema);
