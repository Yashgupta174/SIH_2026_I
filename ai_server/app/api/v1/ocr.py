from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from typing import Optional
from app.schemas.ocr import ParsedDocumentResponse
from app.services.ocr.parser import ClinicalDocumentParser

router = APIRouter(prefix="/ocr", tags=["Document OCR & Parsing"])
ocr_parser = ClinicalDocumentParser()


@router.post("/parse-document", response_model=ParsedDocumentResponse)
async def parse_document(
    file: UploadFile = File(...),
    documentType: Optional[str] = Form(None)
):
    """Uploads medical document (prescription, lab report, discharge summary), runs OCR & extracts structured entities."""
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    try:
        content = await file.read()
        return ocr_parser.parse_document(
            file_bytes=content,
            file_name=file.filename or "",
            content_type=file.content_type or ""
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR processing failed: {str(e)}"
        )
