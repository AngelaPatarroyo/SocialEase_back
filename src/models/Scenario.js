const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  points: { type: Number, required: true },

  // field for VR support
  vrSupported: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Scenario', scenarioSchema);
