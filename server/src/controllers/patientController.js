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

exports.loginPortal = catchAsync(async (req, res, next) => {
  const { mobileNumber, dob } = req.body;

  if (!mobileNumber) {
    return next(new AppError('Mobile number is required to access patient portal', 400));
  }

  // Find existing patient by mobile number
  let patient = await Patient.findOne({ mobileNumber });

  if (!patient) {
    // For demo/presentation fallback, create a sample patient record if not found
    const hospitalId = `HOSP-${Math.floor(100000 + Math.random() * 900000)}`;
    patient = await Patient.create({
      hospitalId,
      fullName: 'Ramesh Kumar',
      dob: dob || new Date('1988-05-14'),
      gender: 'MALE',
      mobileNumber,
      abhaId: `91-${mobileNumber.slice(-4)}-4321-1001`,
      preferredLanguage: 'hi',
      medicalHistorySummary: {
        knownAllergies: ['Penicillin'],
        chronicConditions: ['Hypertension', 'Type-2 Diabetes'],
        pastSurgeries: ['Appendectomy (2018)'],
        currentMedications: ['Tab Metformin 500mg BD', 'Tab Amlodipine 5mg OD']
      }
    });
  }

  res.status(200).json({
    status: 'success',
    patient,
  });
});

exports.uploadPatientReport = catchAsync(async (req, res, next) => {
  const patientId = req.params.id;
  const { documentType, fileUrl, notes, extractedEntities } = req.body;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    return next(new AppError('Patient record not found', 404));
  }

  const doc = await Document.create({
    patientId,
    documentType: documentType || 'PRESCRIPTION',
    fileUrl: fileUrl || 'https://via.placeholder.com/600x800.png?text=Medical+Report',
    ocrRawText: notes || 'Uploaded via Patient Portal',
    extractedEntities: extractedEntities || [
      { type: 'MEDICATION', text: 'Tab Paracetamol 650mg', confidence: 0.95 },
      { type: 'DOSAGE', text: 'TDS after meals', confidence: 0.92 }
    ],
    qualityScore: 92
  });

  // Update patient's current medications summary if new medications were found
  if (extractedEntities && Array.isArray(extractedEntities)) {
    const meds = extractedEntities.filter(e => e.type === 'MEDICATION').map(e => e.text);
    if (meds.length > 0) {
      patient.medicalHistorySummary.currentMedications = [
        ...new Set([...(patient.medicalHistorySummary.currentMedications || []), ...meds])
      ];
      await patient.save();
    }
  }

  res.status(201).json({
    status: 'success',
    document: doc,
    patient
  });
});

