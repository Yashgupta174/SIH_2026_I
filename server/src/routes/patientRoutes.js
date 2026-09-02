const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', patientController.createPatient);
router.post('/login-portal', patientController.loginPortal);
router.post('/verify-abha', patientController.verifyAbha);
router.get('/:id', protect, patientController.getPatientById);
router.get('/:id/timeline', patientController.getPatientTimeline);
router.post('/:id/upload-report', patientController.uploadPatientReport);

module.exports = router;
