const {
  getAllScenarios,
  createScenario,
  updateScenario,
  deleteScenario
} = require('../services/scenarioService');

exports.getScenarios = async (req, res, next) => {
  try {
    const scenarios = await getAllScenarios();
    res.json(scenarios);
  } catch (error) {
    next(error);
  }
};

exports.createScenario = async (req, res, next) => {
  try {
    const { title, description, difficulty, points } = req.body;

    if (!title || !description) {
      const err = new Error('Title and description are required');
      err.statusCode = 400;
      return next(err);
    }

    const scenario = await createScenario({ title, description, difficulty, points });
    res.status(201).json(scenario);
  } catch (error) {
    next(error);
  }
};

exports.updateScenario = async (req, res, next) => {
  try {
    const updatedScenario = await updateScenario(req.params.id, req.body);
    res.json(updatedScenario);
  } catch (error) {
    next(error);
  }
};

exports.deleteScenario = async (req, res, next) => {
  try {
    await deleteScenario(req.params.id);
    res.json({ message: 'Scenario deleted' });
  } catch (error) {
    next(error);
  }
};
