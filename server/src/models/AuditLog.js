const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    userRole: { type: String },
    action: { type: String, required: true }, // e.g. 'CONSENT_GRANTED', 'DOCTOR_APPROVAL', 'PATIENT_VIEW'
    resourceType: { type: String, required: true }, // e.g. 'ClinicalSummary', 'Document', 'Patient'
    resourceId: { type: String },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
