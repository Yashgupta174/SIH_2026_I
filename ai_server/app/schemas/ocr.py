from typing import List, Optional
from pydantic import BaseModel, Field


class ExtractedEntity(BaseModel):
    field: str = Field(..., description="Field category, e.g., Doctor, Hospital, Date, Medication, Lab Test")
    value: str = Field(..., description="Extracted entity value")
    unit: Optional[str] = Field(None, description="Measurement unit if applicable")
    referenceRange: Optional[str] = Field(None, description="Normal reference range for lab tests")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Extraction confidence score")
    sourceSnippet: Optional[str] = Field(None, description="Bounding text snippet from document for split-screen verification")
    page: Optional[int] = Field(1, description="Page number where entity was located")


class ParsedDocumentResponse(BaseModel):
    docType: str = Field(..., description="Document type: PRESCRIPTION, LAB_REPORT, DISCHARGE_SUMMARY, OTHER")
    qualityScore: float = Field(..., ge=0.0, le=1.0, description="Document image quality and legibility score")
    rawOcrText: str = Field(..., description="Unstructured OCR text")
    extractedEntities: List[ExtractedEntity] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)
    disclaimer: str = "AI-generated draft — requires clinician verification."
