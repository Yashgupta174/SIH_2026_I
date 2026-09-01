const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', patientController.createPatient);
router.post('/verify-abha', patientController.verifyAbha);
router.get('/:id', protect, patientController.getPatientById);
router.get('/:id/timeline', protect, patientController.getPatientTimeline);

module.exports = router;
