from typing import List, Dict, Any
from app.schemas.red_flags import RedFlagRuleTrigger
from app.services.providers.factory import get_ai_provider


class RedFlagEvaluator:
    def __init__(self):
        self.ai_provider = get_ai_provider()

    async def evaluate(self, answers: List[Dict[str, Any]], chief_complaint: str = "") -> List[RedFlagRuleTrigger]:
        return await self.ai_provider.evaluate_red_flags(answers, chief_complaint)
