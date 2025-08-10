const { Types } = require('mongoose');
const ScenarioRepository = require('../repositories/ScenarioRepository');
const AppError = require('../utils/errors');

exports.resolveScenarioObjectId = async (idOrSlug) => {
  const s = String(idOrSlug ?? '').trim();
  if (Types.ObjectId.isValid(s)) return s;
  const doc = await ScenarioRepository.findBySlug(s);
  if (!doc) throw new AppError('Invalid scenarioId or slug', 400);
  return String(doc._id);
};
