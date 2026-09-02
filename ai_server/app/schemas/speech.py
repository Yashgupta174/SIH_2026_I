from typing import Optional
from pydantic import BaseModel, Field


class STTResponse(BaseModel):
    text: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    languageDetected: str
