const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const sessionController = require('../controllers/sessionController');

router.post('/', sessionController.createSession);
router.get('/:id', sessionController.getSessionById);
router.post('/:sessionId/answers', sessionController.submitAnswer);
router.post('/transcribe', upload.single('audio'), sessionController.transcribeVoice);
router.post('/:id/generate-summary', sessionController.generateSummaryForSession);

module.exports = router;
