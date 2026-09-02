from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from app.schemas.ocr import ParsedDocumentResponse
from app.schemas.interview import QuestionResponse, SessionState, AnswerItem
from app.schemas.summary import SummaryResponse
from app.schemas.red_flags import RedFlagRuleTrigger
from app.schemas.speech import STTResponse


class BaseAIProvider(ABC):
    @abstractmethod
    async def transcribe_audio(self, audio_bytes: bytes, language: str = "hi") -> STTResponse:
        pass

    @abstractmethod
    async def get_next_question(
        self, session_state: SessionState, last_answer: Optional[AnswerItem] = None
    ) -> QuestionResponse:
        pass

    @abstractmethod
    async def process_document_ocr(
        self, file_bytes: bytes, file_name: str = "", content_type: str = ""
    ) -> ParsedDocumentResponse:
        pass

    @abstractmethod
    async def generate_clinical_summary(
        self,
        chief_complaint: str,
        answers: List[Dict[str, Any]],
        documents: List[Dict[str, Any]],
        mode: str = "GENERAL",
    ) -> SummaryResponse:
        pass

    @abstractmethod
    async def evaluate_red_flags(
        self, answers: List[Dict[str, Any]], chief_complaint: str = ""
    ) -> List[RedFlagRuleTrigger]:
        pass
