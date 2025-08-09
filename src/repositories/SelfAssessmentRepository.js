
const SelfAssessment = require('../models/SelfAssessment');

module.exports = {
  create(doc, session) {
    // Use array form to attach session in transactions
    return SelfAssessment.create([doc], { session }).then(d => d[0]);
  },

  findByUserId(userId, opts = {}) {
    const q = SelfAssessment.find({ userId });
    if (opts.session) q.session(opts.session);
    return q.lean().exec();
  },

  countByUserId(userId, opts = {}) {
    const q = SelfAssessment.countDocuments({ userId });
    if (opts.session) q.session(opts.session);
    return q.exec();
  },
};
