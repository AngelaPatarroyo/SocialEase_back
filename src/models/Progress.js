const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Lista de escenarios completados
  completedScenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' }],

  // Logros o hitos específicos alcanzados
  achievements: [{ type: String }]
}, { timestamps: true });

// Add database indexes for better query performance
progressSchema.index({ userId: 1 }); // For user-specific progress queries
progressSchema.index({ 'completedScenarios': 1 }); // For scenario completion queries
progressSchema.index({ createdAt: -1 }); // For recent progress updates
progressSchema.index({ updatedAt: -1 }); // For progress modification tracking

// Compound indexes for complex queries
progressSchema.index({ userId: 1, createdAt: -1 }); // User progress over time
progressSchema.index({ userId: 1, updatedAt: -1 }); // User progress modifications

module.exports = mongoose.model('Progress', progressSchema);
