const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Lista de escenarios completados
  completedScenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' }],

  // Logros o hitos específicos alcanzados
  achievements: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
