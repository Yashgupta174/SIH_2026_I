from typing import Optional, List, Dict, Any
from app.schemas.interview import QuestionResponse, SessionState, AnswerItem
from app.services.interview.question_tree import ClinicalQuestionTree
from app.services.providers.factory import get_ai_provider


class AdaptiveQuestionEngine:
    def __init__(self):
        self.ai_provider = get_ai_provider()

    async def get_next_question(
        self, session_state: SessionState, last_answer: Optional[AnswerItem] = None
    ) -> QuestionResponse:
        """Determines the next structured intake question for patient interview."""
        return await self.ai_provider.get_next_question(session_state, last_answer)
