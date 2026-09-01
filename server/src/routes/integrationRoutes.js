const express = require('express');
const router = express.Router();
const abdmSandboxService = require('../services/integrations/abdmSandboxService');
const hisAdapterService = require('../services/integrations/hisAdapterService');

router.post('/abdm/verify-abha', async (req, res, next) => {
  try {
    const result = await abdmSandboxService.verifyAbhaId(req.body.abhaId);
    res.json({ status: 'success', data: result });
  } catch (e) {
    next(e);
  }
});

router.post('/abdm/send-otp', async (req, res, next) => {
  try {
    const result = await abdmSandboxService.sendMobileOtp(req.body.mobileNumber);
    res.json({ status: 'success', data: result });
  } catch (e) {
    next(e);
  }
});

router.get('/his/appointments/:patientId', async (req, res, next) => {
  try {
    const appointments = await hisAdapterService.getAppointments(req.params.patientId);
    res.json({ status: 'success', appointments });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
