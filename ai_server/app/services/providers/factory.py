from app.config import settings
from app.services.providers.base import BaseAIProvider
from app.services.providers.mock_provider import MockAIProvider
from app.services.providers.real_provider import RealAIProvider


def get_ai_provider() -> BaseAIProvider:
    if settings.AI_PROVIDER.upper() == "REAL":
        return RealAIProvider()
    return MockAIProvider()
