const mongoose = require('mongoose');

const kioskSchema = new mongoose.Schema(
  {
    kioskCode: { type: String, required: true, unique: true },
    locationName: { type: String, required: true }, // e.g. 'OPD Block A - Counter 3'
    department: { type: String, default: 'General OPD' },
    ipAddress: { type: String },
    macAddress: { type: String },
    softwareVersion: { type: String, default: 'v2.4.0' },
    status: { type: String, enum: ['ONLINE', 'WARNING', 'OFFLINE'], default: 'ONLINE' },
    peripherals: {
      camera: { type: Boolean, default: true },
      microphone: { type: Boolean, default: true },
      documentScanner: { type: Boolean, default: true },
      printer: { type: Boolean, default: true },
      touchscreen: { type: Boolean, default: true },
    },
    lastHeartbeat: { type: Date, default: Date.now },
    metrics: {
      totalIntakesToday: { type: Number, default: 0 },
      avgIntakeTimeMinutes: { type: Number, default: 4.2 },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kiosk', kioskSchema);
