const Scenario = require('../models/Scenario');

// GET all scenarios
exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find();
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE scenario (admin only)
exports.createScenario = async (req, res) => {
  try {
    const { title, description, difficulty, points } = req.body;
    const newScenario = new Scenario({ title, description, difficulty, points });
    await newScenario.save();
    res.status(201).json(newScenario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE scenario
exports.updateScenario = async (req, res) => {
  try {
    const updatedScenario = await Scenario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedScenario) return res.status(404).json({ message: 'Scenario not found' });
    res.json(updatedScenario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE scenario
exports.deleteScenario = async (req, res) => {
  try {
    const deletedScenario = await Scenario.findByIdAndDelete(req.params.id);
    if (!deletedScenario) return res.status(404).json({ message: 'Scenario not found' });
    res.json({ message: 'Scenario deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
