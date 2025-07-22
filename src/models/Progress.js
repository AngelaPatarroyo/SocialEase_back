const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  achievements: [{ type: String }], // e.g., "First Scenario Completed"
  completedScenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' }]
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
