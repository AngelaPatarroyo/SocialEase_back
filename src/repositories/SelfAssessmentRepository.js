const SelfAssessment = require('../models/SelfAssessment');

module.exports = {
  // Create inside an optional transaction session
  create (doc, session) {
    // Use array form to reliably attach session in transactions
    return SelfAssessment.create([doc], { session }).then(d => d[0]);
  },

  // 🔧 Update the most recent assessment for this user (used by service.updateAssessment)
  updateLatestByUserId (userId, updates, session) {
    return SelfAssessment.findOneAndUpdate(
      { userId },
      { $set: updates },
      {
        new: true,
        sort: { createdAt: -1 }, // newest doc
        runValidators: true, // respect strict schema
        session
      }
    );
  },

  // Get all assessments for a user (newest first)
  findByUserId (userId, opts = {}) {
    const q = SelfAssessment.find({ userId }).sort({ createdAt: -1 });
    if (opts.session) q.session(opts.session);
    return q.lean().exec();
  },

  // Count assessments for a user
  countByUserId (userId, opts = {}) {
    const q = SelfAssessment.countDocuments({ userId });
    if (opts.session) q.session(opts.session);
    return q.exec();
  }
};
