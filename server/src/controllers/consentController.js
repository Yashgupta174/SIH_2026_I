const Consent = require('../models/Consent');
const ClinicalSession = require('../models/ClinicalSession');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

const mongoose = require('mongoose');
const logger = require('../utils/logger');

exports.grantConsent = catchAsync(async (req, res, next) => {
  const { patientId, sessionId, language, method, kioskId } = req.body;

  logger.info(`[POST /api/consents] Granting consent for patientId: ${patientId}, sessionId: ${sessionId || 'N/A'}`);

  if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
    logger.error(`[POST /api/consents] Invalid patientId ObjectId format: ${patientId}`);
    return next(new AppError(`Invalid patient ID format: ${patientId}. Expected a valid 24-character hex MongoDB ObjectId.`, 400));
  }

  if (sessionId && !mongoose.Types.ObjectId.isValid(sessionId)) {
    logger.error(`[POST /api/consents] Invalid sessionId ObjectId format: ${sessionId}`);
    return next(new AppError(`Invalid session ID format: ${sessionId}. Expected a valid 24-character hex MongoDB ObjectId.`, 400));
  }

  const consent = await Consent.create({
    patientId,
    sessionId: sessionId || undefined,
    language: language || 'hi',
    method: method || 'TOUCH',
    kioskId,
    status: 'GRANTED',
  });

  logger.info(`[POST /api/consents] Consent granted successfully (_id: ${consent._id})`);

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
