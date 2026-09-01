const logger = require('../../utils/logger');

class HISAdapterService {
  async submitClinicalSummary(patientId, summaryData) {
    logger.info(`[HIS Adapter Mock] Pushing verified summary to Hospital Information System for patient ${patientId}`);
    return {
      success: true,
      hisRecordId: `HIS_REC_${Date.now()}`,
      syncedAt: new Date().toISOString(),
      status: 'ACCEPTED_BY_EMR',
    };
  }

  async getAppointments(patientId) {
    return [
      {
        appointmentId: 'APT_101',
        department: 'Cardiology',
        doctorName: 'Dr. Vikram Seth',
        date: new Date(Date.now() + 86400000 * 2).toISOString(),
        token: 'CARD-04',
      }
    ];
  }
}

module.exports = new HISAdapterService();
