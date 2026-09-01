const mongoose = require('mongoose');

const redFlagAlertSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClinicalSession', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    ruleId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
    triggeredAnswers: [{ question: String, answer: String }],
    recommendedAction: { type: String, required: true },
    patientMessage: { type: String },
    status: { type: String, enum: ['PENDING', 'ACKNOWLEDGED', 'ESCALATED', 'RESOLVED'], default: 'PENDING' },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    acknowledgedAt: { type: Date },
    resolutionNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RedFlagAlert', redFlagAlertSchema);
