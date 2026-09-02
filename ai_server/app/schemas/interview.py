from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class AnswerItem(BaseModel):
    questionId: str
    questionText: Optional[str] = ""
    answerValue: str
    category: Optional[str] = None


class SessionState(BaseModel):
    sessionId: Optional[str] = None
    chiefComplaint: Optional[str] = ""
    intakeMode: str = Field("GENERAL", description="Intake mode: GENERAL or AYUSH")
    language: str = Field("hi", description="Language code: hi, en, hinglish")
    answers: List[AnswerItem] = Field(default_factory=list)
    patientAge: Optional[int] = None
    patientGender: Optional[str] = None


class NextQuestionRequest(BaseModel):
    sessionState: SessionState
    lastAnswer: Optional[AnswerItem] = None


class QuestionOption(BaseModel):
    text: str
    value: Optional[str] = None


class QuestionResponse(BaseModel):
    questionId: str
    questionText: str
    category: str
    options: List[str] = Field(default_factory=list)
    progressPercent: int = Field(..., ge=0, le=100)
    isFinal: bool = False
    redFlagsTriggered: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
