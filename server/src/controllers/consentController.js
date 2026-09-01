const Consent = require('../models/Consent');
const ClinicalSession = require('../models/ClinicalSession');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.grantConsent = catchAsync(async (req, res, next) => {
  const { patientId, sessionId, language, method, kioskId } = req.body;

  const consent = await Consent.create({
    patientId,
    sessionId,
    language: language || 'hi',
    method: method || 'TOUCH',
    kioskId,
    status: 'GRANTED',
  });

  if (sessionId) {
    await ClinicalSession.findByIdAndUpdate(sessionId, { consentId: consent._id, status: 'CONSENTED' });
  }

  await AuditLog.create({
    userId: req.user?._id,
    userName: req.user?.name || 'Kiosk Patient',
    userRole: req.user?.role || 'PATIENT',
    action: 'CONSENT_GRANTED',
    resourceType: 'Consent',
    resourceId: consent._id.toString(),
    patientId,
  });

  res.status(201).json({
    status: 'success',
    consent,
  });
});

exports.withdrawConsent = catchAsync(async (req, res, next) => {
  const consent = await Consent.findById(req.params.id);
  if (!consent) return next(new AppError('Consent record not found.', 404));

  consent.status = 'WITHDRAWN';
  consent.withdrawnAt = new Date();
  await consent.save();

  await AuditLog.create({
    userId: req.user?._id,
    action: 'CONSENT_WITHDRAWN',
    resourceType: 'Consent',
    resourceId: consent._id.toString(),
    patientId: consent.patientId,
  });

  res.status(200).json({
    status: 'success',
    consent,
  });
});
