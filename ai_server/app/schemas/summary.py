from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ProvenanceItem(BaseModel):
    field: str
    value: str
    sourceType: str = Field(..., description="PATIENT_REPORTED, DOCUMENT_EXTRACTED, AI_INFERRED")
    confidence: float = Field(..., ge=0.0, le=1.0)


class AyushAssessment(BaseModel):
    prakriti: Optional[str] = None
    vikriti: Optional[str] = None
    agni: Optional[str] = None
    koshtha: Optional[str] = None
    aharaVihara: Optional[str] = None


class SummaryRequest(BaseModel):
    chiefComplaint: Optional[str] = ""
    intakeMode: str = "GENERAL"
    answers: List[Dict[str, Any]] = Field(default_factory=list)
    documents: List[Dict[str, Any]] = Field(default_factory=list)


class SummaryResponse(BaseModel):
    disclaimer: str = "AI-generated draft — requires clinician verification."
    chiefComplaint: str
    historyOfPresentIllness: str
    pastMedicalHistory: Optional[str] = None
    pastSurgicalHistory: Optional[str] = None
    currentMedications: Optional[str] = None
    allergies: Optional[str] = None
    familyHistory: Optional[str] = None
    personalHistory: Optional[str] = None
    reviewOfSystems: Optional[str] = None
    ayushAssessment: Optional[AyushAssessment] = None
    redFlags: Optional[str] = None
    missingOrUnclearInfo: Optional[str] = None
    provenance: List[ProvenanceItem] = Field(default_factory=list)
