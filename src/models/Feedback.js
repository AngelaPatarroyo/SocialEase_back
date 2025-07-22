const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  comments: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 }, // optional rating
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
