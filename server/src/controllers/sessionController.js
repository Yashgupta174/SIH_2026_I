const ClinicalSession = require('../models/ClinicalSession');
const Patient = require('../models/Patient');
const RedFlagAlert = require('../models/RedFlagAlert');
const ClinicalSummary = require('../models/ClinicalSummary');
const conversationService = require('../services/ai/conversationService');
const redFlagService = require('../services/ai/redFlagService');
const summaryService = require('../services/ai/summaryService');
const speechService = require('../services/ai/speechService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getSocketIO } = require('../sockets/socketManager');

exports.createSession = catchAsync(async (req, res, next) => {
  const { patientId, department, intakeMode, language, chiefComplaint, kioskId } = req.body;

  const patient = await Patient.findById(patientId);
  if (!patient) return next(new AppError('Patient not found.', 404));

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

  // Fetch first dynamic question
  const nextQuestion = await conversationService.getNextQuestion(session, null);

  res.status(201).json({
    status: 'success',
    session,
    nextQuestion,
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

  // Add answer
  session.answers.push({
    questionId,
    questionText,
    answerValue,
    source: source || 'TOUCH',
    confidence: confidence || 0.95,
    category: category || 'General',
    audioSnippetUrl,
  });

  // If first answer and chief complaint not set, set it
  if (!session.chiefComplaint && questionId.includes('cc')) {
    session.chiefComplaint = answerValue;
  }

  await session.save();

  // Check Red Flag Safety Rules
  const redFlagsTriggered = await redFlagService.evaluate(session.answers, session.chiefComplaint);
  let redFlagDoc = null;

  if (redFlagsTriggered && redFlagsTriggered.length > 0) {
    const alertData = redFlagsTriggered[0];
    redFlagDoc = await RedFlagAlert.create({
      sessionId: session._id,
      patientId: session.patientId,
      ruleId: alertData.ruleId,
      title: alertData.title,
      category: alertData.category,
      severity: alertData.severity,
      triggeredAnswers: alertData.triggeredAnswers,
      recommendedAction: alertData.recommendedAction,
      patientMessage: alertData.patientMessage,
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
      console.log('Socket emit info:', e.message);
    }
  }

  // Get Next Question
  const nextQuestion = await conversationService.getNextQuestion(session, answerValue);

  res.status(200).json({
    status: 'success',
    session,
    nextQuestion,
    redFlagDetected: !!redFlagDoc,
    redFlagAlert: redFlagDoc,
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

  const summaryData = await summaryService.generate(session, session.answers, [], session.intakeMode);

  let summary = await ClinicalSummary.findOne({ sessionId: session._id });

  if (summary) {
    summary.chiefComplaint = summaryData.chiefComplaint;
    summary.historyOfPresentIllness = summaryData.historyOfPresentIllness;
    summary.pastMedicalHistory = summaryData.pastMedicalHistory;
    summary.currentMedications = summaryData.currentMedications;
    summary.allergies = summaryData.allergies;
    summary.provenance = summaryData.provenance;
    summary.ayushAssessment = summaryData.ayushAssessment;
    summary.redFlags = summaryData.redFlags;
    summary.missingOrUnclearInfo = summaryData.missingOrUnclearInfo;
    await summary.save();
  } else {
    summary = await ClinicalSummary.create({
      sessionId: session._id,
      patientId: session.patientId._id,
      chiefComplaint: summaryData.chiefComplaint,
      historyOfPresentIllness: summaryData.historyOfPresentIllness,
      pastMedicalHistory: summaryData.pastMedicalHistory,
      pastSurgicalHistory: summaryData.pastSurgicalHistory,
      currentMedications: summaryData.currentMedications,
      allergies: summaryData.allergies,
      familyHistory: summaryData.familyHistory,
      personalHistory: summaryData.personalHistory,
      reviewOfSystems: summaryData.reviewOfSystems,
      ayushAssessment: summaryData.ayushAssessment,
      redFlags: summaryData.redFlags,
      missingOrUnclearInfo: summaryData.missingOrUnclearInfo,
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
          ayushAssessment: summaryData.ayushAssessment,
        }
      ]
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
