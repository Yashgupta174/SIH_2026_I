from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RedFlagRuleTrigger(BaseModel):
    ruleId: str
    title: str
    category: str
    severity: str = Field("HIGH", description="HIGH, CRITICAL, MODERATE")
    recommendedAction: str
    patientMessage: str
    triggeredAnswers: List[Dict[str, str]] = Field(default_factory=list)


class EvaluateRedFlagsRequest(BaseModel):
    chiefComplaint: Optional[str] = ""
    answers: List[Dict[str, Any]] = Field(default_factory=list)


class EvaluateRedFlagsResponse(BaseModel):
    hasRedFlags: bool
    alerts: List[RedFlagRuleTrigger] = Field(default_factory=list)
