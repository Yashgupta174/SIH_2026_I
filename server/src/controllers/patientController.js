const Patient = require('../models/Patient');
const ClinicalSession = require('../models/ClinicalSession');
const Document = require('../models/Document');
const ClinicalSummary = require('../models/ClinicalSummary');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const abdmSandboxService = require('../services/integrations/abdmSandboxService');

exports.createPatient = catchAsync(async (req, res, next) => {
  const { fullName, dob, gender, mobileNumber, abhaId, emergencyContact, preferredLanguage, preferredCommunication } = req.body;

  const hospitalId = `HOSP-${Math.floor(100000 + Math.random() * 900000)}`;

  const patient = await Patient.create({
    userId: req.user?._id,
    hospitalId,
    abhaId,
    fullName,
    dob,
    gender,
    mobileNumber,
    emergencyContact,
    preferredLanguage: preferredLanguage || 'hi',
    preferredCommunication: preferredCommunication || 'HYBRID',
  });

  res.status(201).json({
    status: 'success',
    patient,
  });
});

exports.getPatientById = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return next(new AppError('Patient record not found.', 404));
  }
  res.status(200).json({
    status: 'success',
    patient,
  });
});

exports.getPatientTimeline = catchAsync(async (req, res, next) => {
  const patientId = req.params.id;

  const sessions = await ClinicalSession.find({ patientId }).sort({ createdAt: -1 });
  const documents = await Document.find({ patientId }).sort({ createdAt: -1 });
  const summaries = await ClinicalSummary.find({ patientId }).sort({ createdAt: -1 });

  // Merge events into a single chronological timeline
  const timelineEvents = [];

  sessions.forEach(s => {
    timelineEvents.push({
      id: s._id,
      type: 'CLINICAL_SESSION',
      title: `Intake Session (${s.intakeMode} Mode)`,
      date: s.createdAt,
      status: s.status,
      description: `Chief Complaint: ${s.chiefComplaint || 'N/A'}`,
      details: { token: s.tokenNumber, department: s.department }
    });
  });

  documents.forEach(d => {
    timelineEvents.push({
      id: d._id,
      type: 'DOCUMENT_UPLOAD',
      title: `Uploaded Document: ${d.documentType}`,
      date: d.createdAt,
      description: `Extracted ${d.extractedEntities.length} medical items`,
      fileUrl: d.fileUrl,
    });
  });

  summaries.forEach(sm => {
    timelineEvents.push({
      id: sm._id,
      type: 'DOCTOR_APPROVAL',
      title: `Clinical History (${sm.status})`,
      date: sm.approvedAt || sm.updatedAt,
      description: sm.disclaimer,
      summaryText: sm.historyOfPresentIllness,
    });
  });

  timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({
    status: 'success',
    timeline: timelineEvents,
  });
});

exports.verifyAbha = catchAsync(async (req, res, next) => {
  const { abhaId } = req.body;
  if (!abhaId) return next(new AppError('ABHA ID required', 400));

  const abhaProfile = await abdmSandboxService.verifyAbhaId(abhaId);
  res.status(200).json({
    status: 'success',
    data: abhaProfile,
  });
});
