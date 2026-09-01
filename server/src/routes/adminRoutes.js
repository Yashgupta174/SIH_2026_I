const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/analytics', adminController.getHospitalAnalytics);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/users', adminController.getUsersList);

module.exports = router;
