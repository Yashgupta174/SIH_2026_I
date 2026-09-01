# MediKiosk AI Layer Architecture & Safety Guidelines

## Service Architecture
All AI interactions route through `server/src/services/ai/aiServiceFactory.js` which returns an instance implementing `AIProviderInterface`.

- **MockAIProvider**: Contains high-accuracy clinical rule trees, speech transcription mappings, document OCR templates, and safety rules for offline and SIH presentation reliability.
- **RealAIProvider**: External LLM adapter supporting OpenAI ChatGPT / Gemini Vision endpoints when `AI_API_KEY` is specified in environment variables.

## Safety & Governance Guidelines
1. **No Autonomous Diagnosis**: The system strictly summarizes patient-reported inputs and OCR-extracted entities.
2. **Draft Disclaimer Mandate**: Every unverified summary displays: `"AI-generated draft — requires clinician verification."`
3. **Data Provenance**: Every clinical fact retains `sourceType` (`PATIENT_REPORTED`, `DOCUMENT_EXTRACTED`, `AI_INFERRED`) and confidence metrics.
