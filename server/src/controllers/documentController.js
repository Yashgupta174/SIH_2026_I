const Document = require('../models/Document');
const documentAIService = require('../services/ai/documentAIService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.uploadAndProcessDocument = catchAsync(async (req, res, next) => {
  const { patientId, sessionId, documentType } = req.body;

  let fileName = req.file ? req.file.originalname : `report_${Date.now()}.pdf`;
  let fileUrl = req.file ? `/uploads/${req.file.filename}` : '/assets/sample_prescription.jpg';

  // Run Document Quality Engine & OCR Pipeline
  const ocrResult = await documentAIService.process(req.file?.buffer, { fileName });

  const doc = await Document.create({
    patientId,
    sessionId,
    documentType: documentType || ocrResult.docType || 'PRESCRIPTION',
    fileName,
    fileUrl,
    qualityScore: ocrResult.qualityScore || 0.95,
    ocrStatus: 'COMPLETED',
    extractedEntities: ocrResult.extractedEntities || [],
    rawOcrText: ocrResult.rawOcrText || '',
    uploadedBy: req.user?._id,
  });

  res.status(201).json({
    status: 'success',
    document: doc,
  });
});

exports.getDocumentById = catchAsync(async (req, res, next) => {
  const document = await Document.findById(req.params.id);
  if (!document) return next(new AppError('Document not found.', 404));

  res.status(200).json({
    status: 'success',
    document,
  });
});

exports.updateExtractedEntity = catchAsync(async (req, res, next) => {
  const { documentId, entityId } = req.params;
  const { value, verificationStatus } = req.body;

  const doc = await Document.findById(documentId);
  if (!doc) return next(new AppError('Document not found.', 404));

  const entity = doc.extractedEntities.id(entityId);
  if (!entity) return next(new AppError('Extracted entity not found.', 404));

  if (value !== undefined) entity.value = value;
  if (verificationStatus !== undefined) entity.verificationStatus = verificationStatus;

  await doc.save();

  res.status(200).json({
    status: 'success',
    document: doc,
  });
});
