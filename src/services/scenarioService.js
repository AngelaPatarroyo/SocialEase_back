const Scenario = require('../models/Scenario');

// Get all scenarios
exports.getAllScenarios = async () => {
  return await Scenario.find();
};

// Create a new scenario
exports.createScenario = async ({ title, description, difficulty, points }) => {
  const scenario = new Scenario({ title, description, difficulty, points });
  await scenario.save();
  return scenario;
};

// Update scenario
exports.updateScenario = async (id, data) => {
  const updatedScenario = await Scenario.findByIdAndUpdate(id, data, { new: true });
  if (!updatedScenario) {
    const err = new Error('Scenario not found');
    err.statusCode = 404;
    throw err;
  }
  return updatedScenario;
};

// Delete scenario
exports.deleteScenario = async (id) => {
  const deletedScenario = await Scenario.findByIdAndDelete(id);
  if (!deletedScenario) {
    const err = new Error('Scenario not found');
    err.statusCode = 404;
    throw err;
  }
  return deletedScenario;
};
