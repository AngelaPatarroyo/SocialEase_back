// src/repositories/FeedbackRepository.js
const Feedback = require('../models/Feedback');

function findObjectIdField(model, tokenRegex, refNameHint = null) {
  const paths = model.schema.paths;
  const keys = Object.keys(paths);
  for (const k of keys) {
    const p = paths[k];
    const isObjectId =
      (p.instance === 'ObjectId' || p.instance === 'ObjectID') ||
      (p.options && (p.options.type === 'ObjectId' || p.options.type?.name === 'ObjectId'));
    const nameMatches = tokenRegex.test(k); // e.g. /scenario/i or /user/i
    const refMatches = refNameHint ? (p?.options?.ref === refNameHint) : true;
    if (isObjectId && nameMatches && refMatches) return k;
  }
  return null;
}

module.exports = {
  async create({ userId, scenarioId, reflection, rating }) {
    // figure out correct field names in the schema
    const scenarioField =
      findObjectIdField(Feedback, /scenario/i, 'Scenario') ||
      findObjectIdField(Feedback, /scenario/i, null);

    const userField =
      findObjectIdField(Feedback, /user/i, 'User') ||
      findObjectIdField(Feedback, /user/i, null);

    if (!scenarioField) {
      throw new Error('Feedback model is missing a scenario ObjectId field (e.g., "scenario" or "scenarioId").');
    }
    if (!userField) {
      throw new Error('Feedback model is missing a user ObjectId field (e.g., "user" or "userId").');
    }

    const doc = {
      [userField]: userId,
      [scenarioField]: scenarioId,
      reflection,
      rating,
    };

    return Feedback.create(doc);
  },

  async countByUserId(userId) {
    // match whichever user field exists
    const userField =
      findObjectIdField(Feedback, /user/i, 'User') ||
      findObjectIdField(Feedback, /user/i, null) ||
      'userId';
    return Feedback.countDocuments({ [userField]: userId });
  },

  async findByUserId(userId) {
    const userField =
      findObjectIdField(Feedback, /user/i, 'User') ||
      findObjectIdField(Feedback, /user/i, null) ||
      'userId';
    return Feedback.find({ [userField]: userId }).sort({ createdAt: -1 });
  },
};
