const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: Number, default: 1 }, // 1=easy, 5=hard
  category: { type: String, enum: ['conversation', 'presentation', 'group'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Scenario', scenarioSchema);
