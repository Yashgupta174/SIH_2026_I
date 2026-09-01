const express = require('express');
const router = express.Router();
const kioskController = require('../controllers/kioskController');

router.get('/', kioskController.getAllKiosks);
router.post('/heartbeat', kioskController.kioskHeartbeat);

module.exports = router;
