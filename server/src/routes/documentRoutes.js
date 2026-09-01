const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const documentController = require('../controllers/documentController');

router.post('/upload', upload.single('document'), documentController.uploadAndProcessDocument);
router.get('/:id', documentController.getDocumentById);
router.patch('/:documentId/entities/:entityId', documentController.updateExtractedEntity);

module.exports = router;
