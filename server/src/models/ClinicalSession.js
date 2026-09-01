const mongoose = require('mongoose');
const { SESSION_STATES, INTAKE_MODES } = require('../constants/sessionStates');

const answerItemSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  answerValue: { type: String, required: true },
  source: { type: String, enum: ['VOICE', 'TOUCH', 'HYBRID', 'DOCUMENT'], default: 'TOUCH' },
  confidence: { type: Number, default: 0.95 },
  category: { type: String, default: 'General' },
  audioSnippetUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const clinicalSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    tokenNumber: { type: String, required: true },
    department: { type: String, default: 'General Medicine' },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: Object.values(SESSION_STATES), default: SESSION_STATES.CREATED },
    intakeMode: { type: String, enum: Object.values(INTAKE_MODES), default: INTAKE_MODES.GENERAL },
    language: { type: String, default: 'hi' },
    chiefComplaint: { type: String },
    answers: [answerItemSchema],
    kioskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kiosk' },
    redFlagAlerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RedFlagAlert' }],
    documentsUploaded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    summaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClinicalSummary' },
    consentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consent' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClinicalSession', clinicalSessionSchema);
