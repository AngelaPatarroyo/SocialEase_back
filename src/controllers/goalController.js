const GoalService = require('../services/goalService');

const toISODate = (d) => {
  if (!d) return undefined;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? undefined : dt.toISOString().slice(0, 10);
};

exports.createGoal = async (req, res, next) => {
  try {
    const { title, target, deadline, reminder } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      const err = new Error('Title is required');
      err.status = 400;
      throw err;
    }

    const payload = {
      title: title.trim(),
      target: Number.isFinite(Number(target)) ? Number(target) : 1,
      deadline: toISODate(deadline),
      reminder: reminder ? new Date(reminder) : undefined
    };

    const goals = await GoalService.createGoal(req.user.id, payload);
    res.status(201).json({ success: true, data: goals });
  } catch (err) {
    if (err?.name === 'CastError') {
      err.status = 400;
      err.message = 'Invalid request';
    }
    next(err);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await GoalService.getGoals(req.user.id);
    res.json({ success: true, data: goals });
  } catch (err) {
    next(err);
  }
};

exports.updateGoalProgress = async (req, res, next) => {
  try {
    const goalId = String(req.params.goalId || '').trim();
    const increment = Number(req.body?.increment ?? 1) || 1;
    const goal = await GoalService.updateGoalProgress(req.user.id, goalId, increment);
    res.json({ success: true, data: goal });
  } catch (err) {
    if (err?.name === 'CastError') {
      err.status = 404;
      err.message = 'Goal not found';
    }
    next(err);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const goalId = String(req.params.goalId || '').trim();
    const result = await GoalService.deleteGoal(req.user.id, goalId);
    res.json({ success: true, ...result });
  } catch (err) {
    if (err?.name === 'CastError') {
      err.status = 404;
      err.message = 'Goal not found';
    }
    next(err);
  }
};
