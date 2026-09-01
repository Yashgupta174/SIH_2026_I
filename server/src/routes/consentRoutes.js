const express = require('express');
const router = express.Router();
const consentController = require('../controllers/consentController');

router.post('/', consentController.grantConsent);
router.post('/:id/withdraw', consentController.withdrawConsent);

module.exports = router;
