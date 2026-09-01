const logger = require('../../utils/logger');

class ABDMSandboxService {
  async verifyAbhaId(abhaId) {
    logger.info(`[ABDM Mock] Verifying ABHA ID: ${abhaId}`);
    return {
      verified: true,
      abhaId,
      name: 'Ramesh Kumar',
      gender: 'MALE',
      dob: '1985-06-15',
      mobile: '9876543210',
      healthAddress: `${abhaId.replace(/-/g, '')}@abdm`,
      message: 'ABHA record retrieved successfully (Sandbox Mock)',
    };
  }

  async sendMobileOtp(mobileNumber) {
    logger.info(`[ABDM Mock] Sending OTP to mobile: ${mobileNumber}`);
    return {
      transactionId: `TXN_${Date.now()}`,
      otpSent: true,
      message: 'OTP sent to mobile number registered with ABHA.',
    };
  }

  async verifyOtp(transactionId, otp) {
    logger.info(`[ABDM Mock] Verifying OTP: ${otp} for transaction: ${transactionId}`);
    return {
      authenticated: true,
      message: 'ABHA authentication successful.',
    };
  }

  async createConsentArtifact(patient, purpose) {
    return {
      consentId: `ABDM_CONSENT_${Date.now()}`,
      patientAbha: patient.abhaId,
      purpose,
      status: 'GRANTED',
      expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
  }
}

module.exports = new ABDMSandboxService();
