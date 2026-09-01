const mongoose = require('mongoose');

const consentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClinicalSession' },
    consentType: { type: String, default: 'CLINICAL_INTAKE_AND_DATA_PROCESSING' },
    purpose: { type: String, default: 'Pre-consultation history taking, document extraction, and summary generation for clinical staff review.' },
    language: { type: String, default: 'hi' },
    method: { type: String, enum: ['AUDIO_VOICE', 'TOUCH', 'DIGITAL_SIGNATURE'], default: 'TOUCH' },
    version: { type: String, default: 'v1.0' },
    status: { type: String, enum: ['GRANTED', 'WITHDRAWN', 'DECLINED'], default: 'GRANTED' },
    ipAddress: { type: String },
    kioskId: { type: String },
    grantedAt: { type: Date, default: Date.now },
    withdrawnAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consent', consentSchema);
