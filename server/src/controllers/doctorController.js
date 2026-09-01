const ClinicalSession = require('../models/ClinicalSession');
const ClinicalSummary = require('../models/ClinicalSummary');
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const hisAdapterService = require('../services/integrations/hisAdapterService');
const fhirMapperService = require('../services/integrations/fhirMapperService');

exports.getDoctorQueue = catchAsync(async (req, res, next) => {
  const sessions = await ClinicalSession.find({
    status: { $in: ['READY_FOR_DOCTOR', 'DOCTOR_REVIEW', 'APPROVED', 'SUMMARY_GENERATING'] }
  })
    .populate('patientId')
    .populate('redFlagAlerts')
    .populate('summaryId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: sessions.length,
    queue: sessions,
  });
});

exports.updateSummaryByDoctor = catchAsync(async (req, res, next) => {
  const { summaryId } = req.params;
  const { 
    chiefComplaint, 
    historyOfPresentIllness, 
    pastMedicalHistory, 
    currentMedications, 
    allergies,
    ayushAssessment,
    doctorNotes 
  } = req.body;

  const summary = await ClinicalSummary.findById(summaryId);
  if (!summary) return next(new AppError('Clinical summary not found.', 404));

  const newVersionNum = (summary.versions.length || 1) + 1;

  if (chiefComplaint) summary.chiefComplaint = chiefComplaint;
  if (historyOfPresentIllness) summary.historyOfPresentIllness = historyOfPresentIllness;
  if (pastMedicalHistory) summary.pastMedicalHistory = pastMedicalHistory;
  if (currentMedications) summary.currentMedications = currentMedications;
  if (allergies) summary.allergies = allergies;
  if (ayushAssessment) summary.ayushAssessment = ayushAssessment;

  summary.status = 'EDITED_DOCTOR';
  summary.currentVersion = newVersionNum;

  summary.versions.push({
    versionNumber: newVersionNum,
    editedBy: req.user._id,
    editedByRole: 'DOCTOR',
    chiefComplaint: summary.chiefComplaint,
    historyOfPresentIllness: summary.historyOfPresentIllness,
    pastMedicalHistory: summary.pastMedicalHistory,
    currentMedications: summary.currentMedications,
    allergies: summary.allergies,
    ayushAssessment: summary.ayushAssessment,
    doctorNotes,
  });

  await summary.save();

  await AuditLog.create({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'SUMMARY_EDITED_BY_DOCTOR',
    resourceType: 'ClinicalSummary',
    resourceId: summary._id.toString(),
    patientId: summary.patientId,
    details: { version: newVersionNum },
  });

  res.status(200).json({
    status: 'success',
    summary,
  });
});

exports.approveClinicalHistory = catchAsync(async (req, res, next) => {
  const { summaryId } = req.params;

  const summary = await ClinicalSummary.findById(summaryId);
  if (!summary) return next(new AppError('Clinical summary not found.', 404));

  summary.status = 'APPROVED';
  summary.verifiedByDoctor = req.user._id;
  summary.approvedAt = new Date();
  summary.disclaimer = 'Clinical record verified and approved by physician.';
  await summary.save();

  // Update ClinicalSession status to APPROVED
  const session = await ClinicalSession.findById(summary.sessionId);
  if (session) {
    session.status = 'APPROVED';
    await session.save();
  }

  // Push to HIS Adapter & Generate FHIR Payload
  const patient = await Patient.findById(summary.patientId);
  const hisResult = await hisAdapterService.submitClinicalSummary(summary.patientId, summary);
  const fhirBundle = fhirMapperService.toFHIRBundle(patient, session, summary);

  summary.pushedToHIS = true;
  summary.pushedToABDM = true;
  await summary.save();

  await AuditLog.create({
    userId: req.user._id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'CLINICAL_HISTORY_APPROVED',
    resourceType: 'ClinicalSummary',
    resourceId: summary._id.toString(),
    patientId: summary.patientId,
  });

  res.status(200).json({
    status: 'success',
    message: 'Clinical History successfully verified and approved by doctor.',
    summary,
    hisIntegration: hisResult,
    fhirPayload: fhirBundle,
  });
});
