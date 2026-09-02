from typing import List, Dict, Any
from app.schemas.summary import SummaryResponse
from app.services.providers.factory import get_ai_provider


class SummaryEngine:
    def __init__(self):
        self.ai_provider = get_ai_provider()

    async def generate_summary(
        self,
        chief_complaint: str,
        answers: List[Dict[str, Any]],
        documents: List[Dict[str, Any]],
        mode: str = "GENERAL",
    ) -> SummaryResponse:
        return await self.ai_provider.generate_clinical_summary(chief_complaint, answers, documents, mode)
