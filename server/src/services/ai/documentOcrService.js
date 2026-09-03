const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage } = require('@langchain/core/messages');
const { z } = require('zod');
const pdfParse = require('pdf-parse');
const { createWorker } = require('tesseract.js');
const MockAIProvider = require('./mockAIProvider');
const logger = require('../../utils/logger');

// Structured Zod Schema for Medical Document Extraction
const DocumentExtractionSchema = z.object({
  docType: z.enum(['PRESCRIPTION', 'LAB_REPORT', 'DISCHARGE_SUMMARY', 'RADIOLOGY_REPORT', 'OTHER']).default('PRESCRIPTION'),
  qualityScore: z.number().default(0.95),
  rawOcrText: z.string().default('Extracted OCR text'),
  extractedEntities: z.array(
    z.object({
      field: z.string().describe('Entity type: Doctor, Hospital, Date, Medication, Lab Test, Diagnosis'),
      value: z.string().describe('Extracted value, e.g. Dr. Sharma, Tab Metformin 500mg, Hemoglobin 10.2 g/dL'),
      unit: z.string().optional().describe('Measurement unit if lab test or dosage'),
      referenceRange: z.string().optional().describe('Reference range if lab report'),
      confidence: z.number().default(0.95),
      sourceSnippet: z.string().optional().describe('Exact text snippet from document'),
    })
  ),
});

class DocumentOcrService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.AI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
    this.mockFallback = new MockAIProvider();

    if (this.apiKey) {
      try {
        const baseModel = new ChatGoogleGenerativeAI({
          apiKey: this.apiKey,
          model: this.modelName,
          temperature: 0.1,
          maxOutputTokens: 2048,
        });
        this.structuredModel = baseModel.withStructuredOutput(DocumentExtractionSchema);
        logger.info(`[DocumentOcrService] Initialized Multimodal Gemini Document AI (${this.modelName})`);
      } catch (err) {
        logger.error(`[DocumentOcrService] Model init error: ${err.message}`);
        this.structuredModel = null;
      }
    } else {
      logger.warn('[DocumentOcrService] GEMINI_API_KEY missing. OCR service will use Tesseract/Mock fallback.');
      this.structuredModel = null;
    }
  }

  /**
   * Extract raw text from PDF buffer using pdf-parse
   */
  async extractTextFromPdf(pdfBuffer) {
    try {
      logger.info('[DocumentOcrService] Extracting text stream from PDF buffer...');
      const parseFn = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
      if (typeof parseFn === 'function') {
        const data = await parseFn(pdfBuffer);
        return data.text || '';
      }
      return '';
    } catch (err) {
      logger.warn(`[DocumentOcrService] PDF text extraction warning: ${err.message}`);
      return '';
    }
  }

  /**
   * Extract raw text from Image buffer using Tesseract.js (Offline fallback)
   */
  async extractTextFromImageTesseract(imageBuffer) {
    try {
      logger.info('[DocumentOcrService] Running Tesseract.js WASM OCR on image buffer...');
      const worker = await createWorker('eng');
      const ret = await worker.recognize(imageBuffer);
      await worker.terminate();
      return ret.data.text || '';
    } catch (err) {
      logger.warn(`[DocumentOcrService] Tesseract OCR error: ${err.message}`);
      return '';
    }
  }

  /**
   * Process Medical Document (PDF or Image)
   */
  async processDocument(fileBuffer, fileMetadata = {}) {
    const startTime = Date.now();
    const fileName = (fileMetadata.fileName || fileMetadata.originalname || '').toLowerCase();
    const mimeType = fileMetadata.mimeType || fileMetadata.mimetype || '';

    const isPdf = mimeType.includes('pdf') || fileName.endsWith('.pdf');
    logger.info(`[DocumentOcrService] Processing document: "${fileName}" (Type: ${isPdf ? 'PDF' : 'IMAGE'})`);

    // 1. PDF Processing Flow
    if (isPdf) {
      const pdfRawText = await this.extractTextFromPdf(fileBuffer);
      if (this.structuredModel && pdfRawText.trim().length > 10) {
        try {
          const prompt = `You are a medical OCR specialist. Extract structured clinical entities from this PDF text:
PDF CONTENT:
${pdfRawText}

Extract document type, quality score (0-1), raw text, and medical entities (Doctor, Hospital, Date, Medications, Lab Tests with values & reference ranges).`;

          logger.info('[DocumentOcrService] Invoking Gemini AI for PDF entity extraction...');
          const result = await this.structuredModel.invoke(prompt);
          if (result && result.extractedEntities) {
            result.rawOcrText = pdfRawText;
            logger.info(`[DocumentOcrService] PDF extracted ${result.extractedEntities.length} medical entities in ${Date.now() - startTime}ms`);
            return result;
          }
        } catch (err) {
          logger.error(`[DocumentOcrService] PDF Gemini extraction error: ${err.message}`);
        }
      }
    }

    // 2. Multimodal Gemini Image Processing Flow (FREE Gemini Vision)
    if (!isPdf && this.apiKey) {
      try {
        const base64Image = fileBuffer.toString('base64');
        const imageMime = mimeType || (fileName.endsWith('.png') ? 'image/png' : 'image/jpeg');

        logger.info('[DocumentOcrService] Invoking Gemini Multimodal Vision API on prescription/lab image...');
        const visionMessage = new HumanMessage({
          content: [
            {
              type: 'text',
              text: 'You are an expert clinical medical OCR AI. Read this medical prescription/lab report image and extract all structured medical entities (Doctor Name, Hospital Name, Date, Medications with dosages, Lab Tests with observed values and reference ranges).',
            },
            {
              type: 'image_url',
              image_url: `data:${imageMime};base64,${base64Image}`,
            },
          ],
        });

        const result = await this.structuredModel.invoke([visionMessage]);
        if (result && result.extractedEntities) {
          logger.info(`[DocumentOcrService] Gemini Vision extracted ${result.extractedEntities.length} medical entities in ${Date.now() - startTime}ms`);
          return result;
        }
      } catch (err) {
        logger.error(`[DocumentOcrService] Gemini Vision extraction error: ${err.message}`);
      }
    }

    // 3. Fallback Flow (Tesseract.js OCR or Mock Rule Template)
    logger.info('[DocumentOcrService] Running fallback document OCR pipeline...');
    let rawText = '';
    if (!isPdf) {
      rawText = await this.extractTextFromImageTesseract(fileBuffer);
    }
    const mockResult = await this.mockFallback.processDocumentOCR(fileBuffer, fileMetadata);
    if (rawText) mockResult.rawOcrText = rawText;
    return mockResult;
  }
}

module.exports = new DocumentOcrService();
