const express = require('express');
const router = express.Router();
const triageController = require('../controllers/triageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/alerts', triageController.getTriageAlerts);
router.patch('/alerts/:alertId', triageController.updateAlertStatus);

module.exports = router;
