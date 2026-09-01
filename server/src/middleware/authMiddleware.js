const { verifyToken } = require('../config/jwt');
const AppError = require('../utils/appError');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in to access this resource.', 401));
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError('User belonging to this token no longer exists or is disabled.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired authentication token.', 401));
  }
};

module.exports = { protect };
