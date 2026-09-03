const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const AIProviderInterface = require('./aiProviderInterface');
const MockAIProvider = require('./mockAIProvider');
const logger = require('../../utils/logger');

class GeminiLangChainProvider extends AIProviderInterface {
  constructor() {
    super();
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.AI_API_KEY;
    this.mockFallback = new MockAIProvider();
    this.modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

    if (this.apiKey) {
      try {
        // High-speed low-latency configuration for clinical intake
        this.model = new ChatGoogleGenerativeAI({
          apiKey: this.apiKey,
          model: this.modelName,
          temperature: 0.1, // Near-zero temperature for fastest deterministic completion
          maxOutputTokens: 256, // Low token budget for quick response (<2 seconds)
        });
        logger.info(`[GeminiLangChainProvider] Initialized LangChain with model: ${this.modelName}`);
      } catch (err) {
        logger.error(`[GeminiLangChainProvider] Failed to instantiate model: ${err.message}`);
        this.model = null;
      }
    } else {
      logger.warn('[GeminiLangChainProvider] GEMINI_API_KEY missing. Operations will fall back to MockAIProvider.');
      this.model = null;
    }
  }

  /**
   * Helper to parse JSON from LLM response safely
   */
  parseJSON(text) {
    try {
      const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (e) {
      logger.warn(`[GeminiLangChainProvider] Failed to parse JSON from LLM output: ${e.message}`);
      return null;
    }
  }

  async getNextQuestion(sessionState, lastAnswer) {
    if (!this.model) {
      logger.info('[GeminiLangChainProvider] Falling back to MockAIProvider for getNextQuestion');
      return await this.mockFallback.getNextQuestion(sessionState, lastAnswer);
    }

    const startTime = Date.now();
    try {
      const answers = sessionState.answers || [];
      const chiefComplaint = sessionState.chiefComplaint || lastAnswer || 'General Health Consultation';
      const intakeMode = sessionState.intakeMode || 'GENERAL';
      const language = sessionState.language || 'hi';
      const isFinal = answers.length >= 4;
      const progressPercent = Math.min(100, Math.round(((answers.length + 1) / 5) * 100));

      const historySummary = answers.map((a) => `${a.questionText}: ${a.answerValue}`).join('; ');

      // Compact, high-speed prompt for minimal token overhead
      const promptText = `Return STRICT JSON ONLY for clinical intake question.
Context:
- Hospital Intake Mode: ${intakeMode} (${intakeMode === 'AYUSH' ? 'Prakriti, Agni, Koshtha' : 'Duration, Severity, Radiation'})
- Language: ${language === 'hi' ? 'Hindi/Hinglish' : 'English'}
- Chief Complaint: ${chiefComplaint}
- Previous Answers: ${historySummary || 'None'}
- Question Number: ${answers.length + 1}

JSON Schema (No extra markdown text):
{
  "questionId": "ai_q_${Date.now()}",
  "questionText": "${language === 'hi' ? 'Hindi question' : 'English question'}",
  "category": "Category",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "progressPercent": ${progressPercent},
  "isFinal": ${isFinal}
}`;

      logger.info(`[GeminiLangChainProvider] Requesting dynamic question from Gemini API...`);
      const response = await this.model.invoke(promptText);
      const content = response?.content || '';
      const duration = Date.now() - startTime;

      const parsed = this.parseJSON(content);
      if (parsed && parsed.questionText && Array.isArray(parsed.options)) {
        logger.info(`[GeminiLangChainProvider] Question generated in ${duration}ms: "${parsed.questionText}"`);
        return parsed;
      }

      logger.warn(`[GeminiLangChainProvider] Parsing failed in ${duration}ms. Falling back to MockAIProvider.`);
      return await this.mockFallback.getNextQuestion(sessionState, lastAnswer);
    } catch (err) {
      const duration = Date.now() - startTime;
      logger.error(`[GeminiLangChainProvider] getNextQuestion error after ${duration}ms: ${err.message}. Falling back to Mock.`);
      return await this.mockFallback.getNextQuestion(sessionState, lastAnswer);
    }
  }

  async generateClinicalSummary(session, answers = [], documents = [], mode = 'GENERAL') {
    if (!this.model) {
      logger.info('[GeminiLangChainProvider] Falling back to MockAIProvider for generateClinicalSummary');
      return await this.mockFallback.generateClinicalSummary(session, answers, documents, mode);
    }

    try {
      const chiefComplaint = session.chiefComplaint || (answers[0] ? answers[0].answerValue : 'Clinical Consultation');
      const isAyush = mode === 'AYUSH' || session.intakeMode === 'AYUSH';

      const promptText = `Return STRICT JSON ONLY for patient clinical intake summary draft:
Complaint: ${chiefComplaint}
Q&A History: ${JSON.stringify(answers.map((a) => ({ q: a.questionText, a: a.answerValue })))}

JSON Schema:
{
  "disclaimer": "AI-generated draft — requires clinician verification.",
  "chiefComplaint": "${chiefComplaint}",
  "historyOfPresentIllness": "Narrative of reported symptoms and timeline.",
  "pastMedicalHistory": "Chronic conditions reported.",
  "currentMedications": "Medications mentioned.",
  "allergies": "Allergies.",
  "ayushAssessment": ${isAyush ? '{"prakriti": "Pitta-Vata", "agni": "Vishama Agni", "koshtha": "Madhyama Koshtha"}' : 'null'},
  "provenance": [
    { "field": "Chief Complaint", "value": "${chiefComplaint}", "sourceType": "PATIENT_REPORTED", "confidence": 0.98 }
  ]
}`;

      logger.info(`[GeminiLangChainProvider] Invoking Gemini model for clinical summary...`);
      const response = await this.model.invoke(promptText);
      const content = response?.content || '';

      const parsed = this.parseJSON(content);
      if (parsed && parsed.historyOfPresentIllness) {
        logger.info('[GeminiLangChainProvider] Clinical summary generated successfully.');
        return parsed;
      }

      return await this.mockFallback.generateClinicalSummary(session, answers, documents, mode);
    } catch (err) {
      logger.error(`[GeminiLangChainProvider] Summary generation error: ${err.message}. Falling back.`);
      return await this.mockFallback.generateClinicalSummary(session, answers, documents, mode);
    }
  }

  async evaluateRedFlags(answers, chiefComplaint) {
    return await this.mockFallback.evaluateRedFlags(answers, chiefComplaint);
  }

  async transcribeAudio(audioBuffer, language) {
    return await this.mockFallback.transcribeAudio(audioBuffer, language);
  }

  async processDocumentOCR(fileBuffer, fileMetadata) {
    return await this.mockFallback.processDocumentOCR(fileBuffer, fileMetadata);
  }

  async translateText(text, targetLanguage) {
    return await this.mockFallback.translateText(text, targetLanguage);
  }
}

module.exports = GeminiLangChainProvider;
