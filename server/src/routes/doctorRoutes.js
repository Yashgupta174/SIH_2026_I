const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { ROLES } = require('../constants/roles');

router.use(protect);
router.use(restrictTo(ROLES.DOCTOR, ROLES.HOSPITAL_ADMIN, ROLES.SUPER_ADMIN));

router.get('/queue', doctorController.getDoctorQueue);
router.patch('/summary/:summaryId', doctorController.updateSummaryByDoctor);
router.post('/summary/:summaryId/approve', doctorController.approveClinicalHistory);

module.exports = router;
