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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScenarioPreparation', ScenarioPreparationSchema);
