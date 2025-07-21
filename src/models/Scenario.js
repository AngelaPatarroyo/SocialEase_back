const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  points: { type: Number, default: 10 },
}, { timestamps: true });

module.exports = mongoose.model('Scenario', scenarioSchema);
