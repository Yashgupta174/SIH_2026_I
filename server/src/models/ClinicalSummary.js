const mongoose = require('mongoose');

const factProvenanceSchema = new mongoose.Schema({
  field: { type: String, required: true },
  value: { type: String, required: true },
  sourceType: { type: String, enum: ['PATIENT_REPORTED', 'DOCUMENT_EXTRACTED', 'AI_INFERRED'], required: true },
  sourceId: { type: String }, // document ID or session answer ID
  confidence: { type: Number, default: 0.95 },
});

const summaryVersionSchema = new mongoose.Schema({
  versionNumber: { type: Number, required: true },
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  editedByRole: { type: String },
  chiefComplaint: String,
  historyOfPresentIllness: String,
  pastMedicalHistory: String,
  pastSurgicalHistory: String,
  currentMedications: String,
  allergies: String,
  familyHistory: String,
  personalHistory: String,
  reviewOfSystems: String,
  ayushAssessment: {
    prakriti: String,
    vikriti: String,
    agni: String,
    koshtha: String,
    aharaVihara: String,
  },
  redFlags: String,
  missingOrUnclearInfo: String,
  doctorNotes: String,
  updatedAt: { type: Date, default: Date.now }
});

const clinicalSummarySchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClinicalSession', required: true, unique: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    disclaimer: { 
      type: String, 
      default: 'AI-generated draft — requires clinician verification.' 
    },
    status: { type: String, enum: ['DRAFT_AI', 'EDITED_DOCTOR', 'APPROVED', 'REJECTED'], default: 'DRAFT_AI' },
    currentVersion: { type: Number, default: 1 },
    provenance: [factProvenanceSchema],
    versions: [summaryVersionSchema],
    verifiedByDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    pushedToHIS: { type: Boolean, default: false },
    pushedToABDM: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClinicalSummary', clinicalSummarySchema);
