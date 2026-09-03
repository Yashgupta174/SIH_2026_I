const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { z } = require('zod');
const MockAIProvider = require('./mockAIProvider');
const { RED_FLAG_RULES } = require('../../constants/redFlags');
const logger = require('../../utils/logger');

// Concise Zod Schema for Structured Agent Turn Output
const IntakeTurnSchema = z.object({
  isSufficientForDoctor: z.boolean().describe('True if history is complete enough for doctor, false if another question is needed'),
  missingInfoReason: z.string().default('Checking intake history'),
  nextQuestion: z
    .object({
      questionId: z.string().default('ai_q_generated'),
      questionText: z.string().describe('Short targeted question text in requested language'),
      category: z.string().default('Clinical Intake'),
      options: z.array(z.string()).describe('4 short options'),
      progressPercent: z.number().default(40),
      isFinal: z.boolean().default(false),
    })
    .nullable()
    .optional(),
  clinicalSummary: z
    .object({
      disclaimer: z.string().default('AI-generated draft — requires clinician verification.'),
      chiefComplaint: z.string().default('Consultation'),
      historyOfPresentIllness: z.string().default('Symptom history recorded.'),
      pastMedicalHistory: z.string().default('None reported.'),
      currentMedications: z.string().default('None reported.'),
      allergies: z.string().default('No known drug allergies.'),
    })
    .nullable()
    .optional(),
});

class ClinicalIntakeAgent {
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
        // Attach Zod Structured Output parser for 100% reliable JSON generation
        this.structuredModel = baseModel.withStructuredOutput(IntakeTurnSchema);
        logger.info(`[ClinicalIntakeAgent] Initialized Unified LangChain Agent with model: ${this.modelName}`);
      } catch (err) {
        logger.error(`[ClinicalIntakeAgent] Failed to instantiate model: ${err.message}`);
        this.structuredModel = null;
      }
    } else {
      logger.warn('[ClinicalIntakeAgent] GEMINI_API_KEY missing. Agent will operate using rule-based fallback.');
      this.structuredModel = null;
    }
  }

  /**
   * Evaluates Red Flags deterministically against medical rules for safety guarantee
   */
  evaluateRedFlagsDeterministic(answers, chiefComplaint) {
    const combined = [...answers, { questionText: 'Chief Complaint', answerValue: chiefComplaint }];
    for (const rule of RED_FLAG_RULES) {
      if (rule.condition && rule.condition(combined)) {
        return {
          ruleId: rule.id,
          title: rule.title,
          category: rule.category,
          severity: rule.severity,
          recommendedAction: rule.action,
          patientMessage: rule.patientMessage,
          triggeredAnswers: combined.map(a => ({ question: a.questionText || 'Complaint', answer: a.answerValue || '' })),
        };
      }
    }
    return null;
  }

  /**
   * Primary Turn Handler: Evaluates context adequacy, identifies missing info,
   * checks emergency red flags, and generates either next targeted question or final doctor summary.
   */
  async processIntakeTurn({ session, answers = [], chiefComplaint = '', intakeMode = 'GENERAL', language = 'hi' }) {
    const startTime = Date.now();
    const effectiveComplaint = chiefComplaint || (answers[0] ? answers[0].answerValue : 'Health Consultation');

    // 1. Evaluate Deterministic Medical Red Flag Safety Rules
    const redFlagAlert = this.evaluateRedFlagsDeterministic(answers, effectiveComplaint);
    if (redFlagAlert) {
      logger.warn(`[ClinicalIntakeAgent] 🚨 Emergency Red Flag Triggered: ${redFlagAlert.title}`);
    }

    // 2. If no Gemini LLM active, use fallback
    if (!this.structuredModel) {
      logger.info('[ClinicalIntakeAgent] Running Rule Engine fallback turn...');
      const nextQ = await this.mockFallback.getNextQuestion({ answers, chiefComplaint: effectiveComplaint, intakeMode, language }, null);
      const isFinal = nextQ.isFinal || answers.length >= 4;
      
      let summary = null;
      if (isFinal) {
        summary = await this.mockFallback.generateClinicalSummary(session, answers, [], intakeMode);
      }

      return {
        redFlagAlert,
        isSufficientForDoctor: isFinal,
        nextQuestion: isFinal ? null : nextQ,
        clinicalSummary: summary,
      };
    }

    // 3. Unified LangChain Structured Agent Call
    try {
      const historyText = answers.map((a, idx) => `Q${idx + 1}: ${a.questionText} -> A: ${a.answerValue}`).join('; ');
      const questionCount = answers.length;
      const forceFinal = questionCount >= 4;

      const promptText = `Triage Physician AI Agent. Evaluate patient intake.
Mode: ${intakeMode}. Language: ${language === 'hi' ? 'Hindi/Hinglish' : 'English'}. Complaint: ${effectiveComplaint}.
Answer History: ${historyText || 'None'}. Question Count: ${questionCount}.

RULES:
1. "isSufficientForDoctor": set to true IF complaint + duration + severity are answered OR ${forceFinal ? 'ALWAYS TRUE (max 4 reached)' : '4 questions answered'}.
2. If isSufficientForDoctor is FALSE: fill "nextQuestion" (questionText in ${language === 'hi' ? 'Hindi/Hinglish' : 'English'}, 4 options). Set "clinicalSummary" to null.
3. If isSufficientForDoctor is TRUE: set "nextQuestion" to null. Fill "clinicalSummary" with brief SOAP draft.`;

      logger.info('[ClinicalIntakeAgent] Invoking LangChain Structured Agent...');
      const parsed = await this.structuredModel.invoke(promptText);
      const duration = Date.now() - startTime;

      if (parsed) {
        logger.info(`[ClinicalIntakeAgent] Agent turn processed in ${duration}ms (Sufficient: ${parsed.isSufficientForDoctor})`);
        
        if (parsed.nextQuestion && !parsed.nextQuestion.questionId) {
          parsed.nextQuestion.questionId = `ai_q_${Date.now()}`;
        }

        return {
          redFlagAlert,
          isSufficientForDoctor: !!parsed.isSufficientForDoctor,
          missingInfoReason: parsed.missingInfoReason || '',
          nextQuestion: parsed.isSufficientForDoctor ? null : parsed.nextQuestion,
          clinicalSummary: parsed.isSufficientForDoctor ? parsed.clinicalSummary : null,
        };
      }

      logger.warn(`[ClinicalIntakeAgent] Agent invocation returned null after ${duration}ms. Using fallback.`);
      const mockNext = await this.mockFallback.getNextQuestion({ answers, chiefComplaint: effectiveComplaint, intakeMode, language }, null);
      return {
        redFlagAlert,
        isSufficientForDoctor: mockNext.isFinal,
        nextQuestion: mockNext.isFinal ? null : mockNext,
        clinicalSummary: mockNext.isFinal ? await this.mockFallback.generateClinicalSummary(session, answers, [], intakeMode) : null,
      };
    } catch (err) {
      const duration = Date.now() - startTime;
      logger.error(`[ClinicalIntakeAgent] Turn execution error after ${duration}ms: ${err.message}`);
      const mockNext = await this.mockFallback.getNextQuestion({ answers, chiefComplaint: effectiveComplaint, intakeMode, language }, null);
      return {
        redFlagAlert,
        isSufficientForDoctor: mockNext.isFinal,
        nextQuestion: mockNext.isFinal ? null : mockNext,
        clinicalSummary: mockNext.isFinal ? await this.mockFallback.generateClinicalSummary(session, answers, [], intakeMode) : null,
      };
    }
  }
}

module.exports = new ClinicalIntakeAgent();
