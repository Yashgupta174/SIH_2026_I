const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role, department, phone, abhaId } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User with this email already exists.', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'PATIENT',
    department: department || 'General Medicine',
    phone,
    abhaId,
  });

  const token = generateToken(user);

  await AuditLog.create({
    userId: user._id,
    userName: user.name,
    userRole: user.role,
    action: 'USER_REGISTERED',
    resourceType: 'User',
    resourceId: user._id.toString(),
  });

  user.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid credentials.', 401));
  }

  const token = generateToken(user);

  await AuditLog.create({
    userId: user._id,
    userName: user.name,
    userRole: user.role,
    action: 'USER_LOGIN',
    resourceType: 'User',
    resourceId: user._id.toString(),
  });

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    user,
  });
});
