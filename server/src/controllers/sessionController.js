const ClinicalSession = require('../models/ClinicalSession');
const Patient = require('../models/Patient');
const RedFlagAlert = require('../models/RedFlagAlert');
const ClinicalSummary = require('../models/ClinicalSummary');
const clinicalIntakeAgent = require('../services/ai/clinicalIntakeAgent');
const speechService = require('../services/ai/speechService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getSocketIO } = require('../sockets/socketManager');

const mongoose = require('mongoose');
const logger = require('../utils/logger');

exports.createSession = catchAsync(async (req, res, next) => {
  const { patientId, department, intakeMode, language, chiefComplaint, kioskId } = req.body;

  logger.info(`[POST /api/clinical-sessions] Creating session for patientId: ${patientId}`);

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    logger.error(`[POST /api/clinical-sessions] Invalid patientId ObjectId format: ${patientId}`);
    return next(new AppError(`Invalid patient ID format: ${patientId}. Expected a 24-character hex MongoDB ObjectId.`, 400));
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    logger.warn(`[POST /api/clinical-sessions] Patient not found in DB: ${patientId}`);
    return next(new AppError('Patient record not found.', 404));
  }

  const count = await ClinicalSession.countDocuments();
  const tokenNumber = `TOKEN-${String(count + 1).padStart(3, '0')}`;
  const sessionId = `SESS-${Date.now()}`;

  const session = await ClinicalSession.create({
    sessionId,
    patientId,
    tokenNumber,
    department: department || 'General Medicine',
    intakeMode: intakeMode || 'GENERAL',
    language: language || patient.preferredLanguage || 'hi',
    chiefComplaint,
    kioskId,
    status: 'INTERVIEWING',
  });

  logger.info(`[POST /api/clinical-sessions] Session created successfully (_id: ${session._id}, token: ${tokenNumber})`);

  // Run Unified LangChain Agent to evaluate initial question
  const agentTurn = await clinicalIntakeAgent.processIntakeTurn({
    session,
    answers: [],
    chiefComplaint: chiefComplaint || '',
    intakeMode: session.intakeMode,
    language: session.language,
  });

  res.status(201).json({
    status: 'success',
    session,
    nextQuestion: agentTurn.nextQuestion,
  });
});

exports.getSessionById = catchAsync(async (req, res, next) => {
  const session = await ClinicalSession.findById(req.params.id)
    .populate('patientId')
    .populate('redFlagAlerts')
    .populate('summaryId');

  if (!session) return next(new AppError('Session not found.', 404));

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.submitAnswer = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;
  const { questionId, questionText, answerValue, source, confidence, audioSnippetUrl, category } = req.body;

  const session = await ClinicalSession.findById(sessionId);
  if (!session) return next(new AppError('Clinical session not found.', 404));

  // Add answer to session
  session.answers.push({
    questionId,
    questionText,
    answerValue,
    source: source || 'TOUCH',
    confidence: confidence || 0.95,
    category: category || 'General',
    audioSnippetUrl,
  });

  if (!session.chiefComplaint && (questionId.includes('cc') || questionId.includes('initial'))) {
    session.chiefComplaint = answerValue;
  }

  await session.save();

  // Run Unified LangChain Agent Turn (Evaluates context sufficiency, red flags, next question, & summary)
  const agentTurn = await clinicalIntakeAgent.processIntakeTurn({
    session,
    answers: session.answers,
    chiefComplaint: session.chiefComplaint,
    intakeMode: session.intakeMode,
    language: session.language,
  });

  // Handle Red Flag Alert if triggered
  let redFlagDoc = null;
  if (agentTurn.redFlagAlert) {
    const alertData = agentTurn.redFlagAlert;
    redFlagDoc = await RedFlagAlert.create({
      sessionId: session._id,
      patientId: session.patientId,
      ruleId: alertData.ruleId || 'RF_ALERT',
      title: alertData.title,
      category: alertData.category || 'Triage Alert',
      severity: alertData.severity || 'HIGH',
      triggeredAnswers: alertData.triggeredAnswers || [],
      recommendedAction: alertData.recommendedAction || 'Immediate Nurse Triage Evaluation Required',
      patientMessage: alertData.patientMessage || 'Emergency alert flagged.',
    });

    session.redFlagAlerts.push(redFlagDoc._id);
    await session.save();

    // Broadcast real-time triage alert via Socket.IO
    try {
      const io = getSocketIO();
      if (io) {
        io.emit('red_flag_detected', {
          alertId: redFlagDoc._id,
          patientId: session.patientId,
          title: redFlagDoc.title,
          severity: redFlagDoc.severity,
          timestamp: new Date(),
        });
      }
    } catch (e) {
      logger.warn(`Socket broadcast info: ${e.message}`);
    }
  }

  // Handle Clinical Summary Persistence if context is sufficient for doctor
  let summaryDoc = null;
  if (agentTurn.isSufficientForDoctor && agentTurn.clinicalSummary) {
    const sData = agentTurn.clinicalSummary;
    summaryDoc = await ClinicalSummary.findOne({ sessionId: session._id });

    if (summaryDoc) {
      summaryDoc.chiefComplaint = sData.chiefComplaint || session.chiefComplaint;
      summaryDoc.historyOfPresentIllness = sData.historyOfPresentIllness;
      summaryDoc.pastMedicalHistory = sData.pastMedicalHistory;
      summaryDoc.currentMedications = sData.currentMedications;
      summaryDoc.allergies = sData.allergies;
      summaryDoc.ayushAssessment = sData.ayushAssessment;
      summaryDoc.provenance = sData.provenance;
      await summaryDoc.save();
    } else {
      summaryDoc = await ClinicalSummary.create({
        sessionId: session._id,
        patientId: session.patientId,
        chiefComplaint: sData.chiefComplaint || session.chiefComplaint || 'Clinical Intake',
        historyOfPresentIllness: sData.historyOfPresentIllness || 'Patient intake history gathered.',
        pastMedicalHistory: sData.pastMedicalHistory || 'None reported.',
        currentMedications: sData.currentMedications || 'None reported.',
        allergies: sData.allergies || 'No known drug allergies.',
        ayushAssessment: sData.ayushAssessment,
        provenance: sData.provenance || [],
        versions: [
          {
            versionNumber: 1,
            editedByRole: 'AI_SYSTEM',
            chiefComplaint: sData.chiefComplaint || session.chiefComplaint,
            historyOfPresentIllness: sData.historyOfPresentIllness,
            pastMedicalHistory: sData.pastMedicalHistory,
            currentMedications: sData.currentMedications,
            allergies: sData.allergies,
            ayushAssessment: sData.ayushAssessment,
          },
        ],
      });
    }

    session.summaryId = summaryDoc._id;
    session.status = 'READY_FOR_DOCTOR';
    await session.save();
  }

  res.status(200).json({
    status: 'success',
    session,
    isSufficientForDoctor: agentTurn.isSufficientForDoctor,
    nextQuestion: agentTurn.nextQuestion,
    redFlagDetected: !!redFlagDoc,
    redFlagAlert: redFlagDoc,
    summary: summaryDoc,
  });
});

exports.transcribeVoice = catchAsync(async (req, res, next) => {
  const { language } = req.body;
  const result = await speechService.transcribe(req.file?.buffer, language || 'hi');
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.generateSummaryForSession = catchAsync(async (req, res, next) => {
  const session = await ClinicalSession.findById(req.params.id).populate('patientId');
  if (!session) return next(new AppError('Session not found', 404));

  session.status = 'SUMMARY_GENERATING';
  await session.save();

  const agentTurn = await clinicalIntakeAgent.processIntakeTurn({
    session,
    answers: session.answers,
    chiefComplaint: session.chiefComplaint,
    intakeMode: session.intakeMode,
    language: session.language,
  });

  const summaryData = agentTurn.clinicalSummary || {
    chiefComplaint: session.chiefComplaint || 'Consultation',
    historyOfPresentIllness: 'Intake history compiled.',
    provenance: [],
  };

  let summary = await ClinicalSummary.findOne({ sessionId: session._id });

  if (summary) {
    summary.chiefComplaint = summaryData.chiefComplaint;
    summary.historyOfPresentIllness = summaryData.historyOfPresentIllness;
    summary.pastMedicalHistory = summaryData.pastMedicalHistory;
    summary.currentMedications = summaryData.currentMedications;
    summary.allergies = summaryData.allergies;
    summary.provenance = summaryData.provenance;
    summary.ayushAssessment = summaryData.ayushAssessment;
    await summary.save();
  } else {
    summary = await ClinicalSummary.create({
      sessionId: session._id,
      patientId: session.patientId._id,
      chiefComplaint: summaryData.chiefComplaint,
      historyOfPresentIllness: summaryData.historyOfPresentIllness,
      pastMedicalHistory: summaryData.pastMedicalHistory,
      currentMedications: summaryData.currentMedications,
      allergies: summaryData.allergies,
      ayushAssessment: summaryData.ayushAssessment,
      provenance: summaryData.provenance,
      versions: [
        {
          versionNumber: 1,
          editedByRole: 'AI_SYSTEM',
          chiefComplaint: summaryData.chiefComplaint,
          historyOfPresentIllness: summaryData.historyOfPresentIllness,
          pastMedicalHistory: summaryData.pastMedicalHistory,
          currentMedications: summaryData.currentMedications,
          allergies: summaryData.allergies,
        },
      ],
    });
  }

  session.summaryId = summary._id;
  session.status = 'READY_FOR_DOCTOR';
  await session.save();

  res.status(200).json({
    status: 'success',
    summary,
  });
});
