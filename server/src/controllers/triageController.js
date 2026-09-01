const RedFlagAlert = require('../models/RedFlagAlert');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getTriageAlerts = catchAsync(async (req, res, next) => {
  const alerts = await RedFlagAlert.find()
    .populate('patientId')
    .populate('sessionId')
    .populate('acknowledgedBy', 'name role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: alerts.length,
    alerts,
  });
});

exports.updateAlertStatus = catchAsync(async (req, res, next) => {
  const { alertId } = req.params;
  const { status, resolutionNotes } = req.body; // 'ACKNOWLEDGED', 'ESCALATED', 'RESOLVED'

  const alert = await RedFlagAlert.findById(alertId);
  if (!alert) return next(new AppError('Alert not found.', 404));

  alert.status = status;
  alert.acknowledgedBy = req.user._id;
  alert.acknowledgedAt = new Date();
  if (resolutionNotes) alert.resolutionNotes = resolutionNotes;

  await alert.save();

  await AuditLog.create({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    action: `TRIAGE_ALERT_${status}`,
    resourceType: 'RedFlagAlert',
    resourceId: alert._id.toString(),
    patientId: alert.patientId,
  });

  res.status(200).json({
    status: 'success',
    alert,
  });
});
