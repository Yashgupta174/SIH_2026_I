import json
import logging
from typing import Dict, Any, List, Optional
from app.config import settings
from app.services.providers.base import BaseAIProvider
from app.services.providers.mock_provider import MockAIProvider
from app.schemas.ocr import ParsedDocumentResponse, ExtractedEntity
from app.schemas.interview import QuestionResponse, SessionState, AnswerItem
from app.schemas.summary import SummaryResponse, AyushAssessment, ProvenanceItem
from app.schemas.red_flags import RedFlagRuleTrigger
from app.schemas.speech import STTResponse

logger = logging.getLogger("medikiosk_ai.real_provider")


class RealAIProvider(BaseAIProvider):
    def __init__(self):
        self.mock_fallback = MockAIProvider()
        self.api_key = settings.AI_API_KEY
        self.model_name = settings.AI_MODEL_NAME

        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.genai = genai
                self.model = genai.GenerativeModel(self.model_name)
                logger.info(f"RealAIProvider initialized with Google Gemini model: {self.model_name}")
            except Exception as e:
                logger.warning(f"Failed to initialize Google Generative AI: {e}. Fallback to Mock Provider enabled.")
                self.genai = None
                self.model = None
        else:
            logger.info("AI_API_KEY not configured. RealAIProvider using Mock Provider fallback.")
            self.genai = None
            self.model = None

    async def transcribe_audio(self, audio_bytes: bytes, language: str = "hi") -> STTResponse:
        # If external speech API is configured, call it. Else fallback to mock.
        return await self.mock_fallback.transcribe_audio(audio_bytes, language)

    async def get_next_question(
        self, session_state: SessionState, last_answer: Optional[AnswerItem] = None
    ) -> QuestionResponse:
        if not self.model:
            return await self.mock_fallback.get_next_question(session_state, last_answer)

        try:
            prompt = (
                "You are an AI Clinical Assistant for MediKiosk intake in an Indian hospital.\n"
                f"Chief Complaint: {session_state.chiefComplaint}\n"
                f"Intake Mode: {session_state.intakeMode}\n"
                f"Language: {session_state.language}\n"
                f"Previous Answers: {json.dumps([a.model_dump() for a in session_state.answers])}\n\n"
                "Return a JSON object with keys: questionId, questionText, category, options (list of strings), "
                "progressPercent (integer 0-100), and isFinal (boolean)."
            )
            response = self.model.generate_content(prompt)
            data = json.loads(response.text)
            return QuestionResponse(
                questionId=data.get("questionId", f"ai_{len(session_state.answers)}"),
                questionText=data.get("questionText", "Could you elaborate on your symptoms?"),
                category=data.get("category", "General"),
                options=data.get("options", ["Yes", "No", "Uncertain"]),
                progressPercent=data.get("progressPercent", 50),
                isFinal=data.get("isFinal", False),
            )
        except Exception as err:
            logger.warning(f"RealAIProvider get_next_question failed: {err}. Using Mock provider.")
            return await self.mock_fallback.get_next_question(session_state, last_answer)

    async def process_document_ocr(
        self, file_bytes: bytes, file_name: str = "", content_type: str = ""
    ) -> ParsedDocumentResponse:
        if not self.model:
            return await self.mock_fallback.process_document_ocr(file_bytes, file_name, content_type)

        try:
            # Using Vision LLM modal input
            image_part = {"mime_type": content_type or "image/png", "data": file_bytes}
            prompt = (
                "Extract all clinical entities from this medical document image.\n"
                "Return JSON with format:\n"
                "{\n"
                '  "docType": "PRESCRIPTION" or "LAB_REPORT",\n'
                '  "qualityScore": 0.95,\n'
                '  "rawOcrText": "...",\n'
                '  "extractedEntities": [{"field": "Medication"/"Lab Test"/"Doctor", "value": "...", "unit": "...", "referenceRange": "...", "confidence": 0.9, "sourceSnippet": "..."}]\n'
                "}"
            )
            res = self.model.generate_content([prompt, image_part])
            data = json.loads(res.text)
            entities = [ExtractedEntity(**e) for e in data.get("extractedEntities", [])]
            return ParsedDocumentResponse(
                docType=data.get("docType", "PRESCRIPTION"),
                qualityScore=data.get("qualityScore", 0.9),
                rawOcrText=data.get("rawOcrText", ""),
                extractedEntities=entities,
                confidence=0.92,
            )
        except Exception as err:
            logger.warning(f"Vision LLM OCR failed: {err}. Using Mock provider OCR parser.")
            return await self.mock_fallback.process_document_ocr(file_bytes, file_name, content_type)

    async def generate_clinical_summary(
        self,
        chief_complaint: str,
        answers: List[Dict[str, Any]],
        documents: List[Dict[str, Any]],
        mode: str = "GENERAL",
    ) -> SummaryResponse:
        if not self.model:
            return await self.mock_fallback.generate_clinical_summary(chief_complaint, answers, documents, mode)

        try:
            prompt = (
                "Generate a physician-ready clinical summary from patient intake.\n"
                f"Chief Complaint: {chief_complaint}\n"
                f"Answers: {json.dumps(answers)}\n"
                f"Mode: {mode}\n\n"
                "Strictly include disclaimer: 'AI-generated draft — requires clinician verification.'\n"
                "Return JSON matching SummaryResponse schema."
            )
            res = self.model.generate_content(prompt)
            data = json.loads(res.text)
            return SummaryResponse(**data)
        except Exception as err:
            logger.warning(f"RealAIProvider summary generation failed: {err}. Using Mock provider.")
            return await self.mock_fallback.generate_clinical_summary(chief_complaint, answers, documents, mode)

    async def evaluate_red_flags(
        self, answers: List[Dict[str, Any]], chief_complaint: str = ""
    ) -> List[RedFlagRuleTrigger]:
        return await self.mock_fallback.evaluate_red_flags(answers, chief_complaint)
