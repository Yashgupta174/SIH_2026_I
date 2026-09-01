const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hospitalId: { type: String, required: true, unique: true },
    abhaId: { type: String, unique: true, sparse: true },
    abhaAddress: { type: String },
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
    mobileNumber: { type: String, required: true },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    preferredLanguage: { type: String, default: 'hi' },
    preferredCommunication: { type: String, enum: ['VOICE', 'TOUCH', 'HYBRID'], default: 'HYBRID' },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    medicalHistorySummary: {
      knownAllergies: [String],
      chronicConditions: [String],
      pastSurgeries: [String],
      currentMedications: [String],
    },
    registeredAtKiosk: { type: mongoose.Schema.Types.ObjectId, ref: 'Kiosk' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
