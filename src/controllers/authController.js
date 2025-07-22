const { registerUser, loginUser } = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation at controller level
    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are required');
      err.statusCode = 400;
      return next(err);
    }

    // Call the service
    const { token, user } = await registerUser({ name, email, password });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      return next(err);
    }

    // Call the service
    const { token, user } = await loginUser({ email, password });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
