const mongoose = require('mongoose');

const extractedEntitySchema = new mongoose.Schema({
  field: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String },
  referenceRange: { type: String },
  confidence: { type: Number, default: 0.9 },
  page: { type: Number, default: 1 },
  sourceSnippet: { type: String },
  verificationStatus: { type: String, enum: ['UNVERIFIED', 'CONFIRMED', 'EDITED', 'REJECTED'], default: 'UNVERIFIED' }
});

const documentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClinicalSession' },
    documentType: { 
      type: String, 
      enum: ['PRESCRIPTION', 'LAB_REPORT', 'DISCHARGE_SUMMARY', 'REFERRAL', 'OTHER'], 
      default: 'PRESCRIPTION' 
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number },
    mimeType: { type: String },
    qualityScore: { type: Number, default: 0.95 },
    qualityIssues: [{ type: String }], // e.g. ['BLUR', 'LOW_LIGHT', 'CROPPED']
    ocrStatus: { type: String, enum: ['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'QUEUED' },
    extractedEntities: [extractedEntitySchema],
    rawOcrText: { type: String },
    processedByAI: { type: Boolean, default: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
