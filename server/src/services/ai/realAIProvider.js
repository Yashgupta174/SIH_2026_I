const AIProviderInterface = require('./aiProviderInterface');
const GeminiLangChainProvider = require('./geminiLangChainProvider');
const MockAIProvider = require('./mockAIProvider');
const logger = require('../../utils/logger');

class RealAIProvider extends AIProviderInterface {
  constructor() {
    super();
    this.geminiProvider = new GeminiLangChainProvider();
    this.mockFallback = new MockAIProvider();
  }

  async transcribeAudio(audioBuffer, language = 'hi') {
    return await this.mockFallback.transcribeAudio(audioBuffer, language);
  }

  async getNextQuestion(sessionState, lastAnswer) {
    return await this.geminiProvider.getNextQuestion(sessionState, lastAnswer);
  }

  async extractClinicalEntities(rawText, context) {
    return await this.geminiProvider.extractClinicalEntities(rawText, context);
  }

  async processDocumentOCR(fileBuffer, fileMetadata) {
    return await this.mockFallback.processDocumentOCR(fileBuffer, fileMetadata);
  }

  async generateClinicalSummary(session, answers, documents, mode) {
    return await this.geminiProvider.generateClinicalSummary(session, answers, documents, mode);
  }

  async evaluateRedFlags(answers, chiefComplaint) {
    return await this.mockFallback.evaluateRedFlags(answers, chiefComplaint);
  }

  async translateText(text, targetLanguage) {
    return await this.mockFallback.translateText(text, targetLanguage);
  }
}

module.exports = RealAIProvider;
