/**
 * Abstract AI Provider Interface
 * All AI providers (Mock, OpenAI, Gemini, Ollama, etc.) must implement these contracts.
 */
class AIProviderInterface {
  async transcribeAudio(audioBuffer, language) {
    throw new Error('transcribeAudio not implemented');
  }

  async getNextQuestion(sessionState, lastAnswer) {
    throw new Error('getNextQuestion not implemented');
  }

  async extractClinicalEntities(rawText, context) {
    throw new Error('extractClinicalEntities not implemented');
  }

  async processDocumentOCR(fileBuffer, fileMetadata) {
    throw new Error('processDocumentOCR not implemented');
  }

  async generateClinicalSummary(session, answers, documents, mode) {
    throw new Error('generateClinicalSummary not implemented');
  }

  async evaluateRedFlags(answers, chiefComplaint) {
    throw new Error('evaluateRedFlags not implemented');
  }

  async translateText(text, targetLanguage) {
    throw new Error('translateText not implemented');
  }
}

module.exports = AIProviderInterface;
