const AppError = require('../utils/appError');
const { PERMISSIONS } = require('../constants/roles');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Unauthorized: You do not have permission to perform this action.', 403));
    }
    next();
  };
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    const userPerms = PERMISSIONS[userRole] || [];
    if (!userPerms.includes(permission) && !userPerms.includes('manage_all')) {
      return next(new AppError(`Forbidden: Missing required permission '${permission}'`, 403));
    }
    next();
  };
};

module.exports = { restrictTo, requirePermission };
