from fastapi import APIRouter, HTTPException, status
from app.schemas.summary import SummaryRequest, SummaryResponse
from app.services.summary.summary_engine import SummaryEngine

router = APIRouter(prefix="/summary", tags=["Clinical History Summary"])
summary_engine = SummaryEngine()


@router.post("/generate", response_model=SummaryResponse)
async def generate_summary(payload: SummaryRequest):
    """Synthesizes structured clinical history summary with data provenance and draft disclaimer for physician verification."""
    try:
        return await summary_engine.generate_summary(
            chief_complaint=payload.chiefComplaint or "",
            answers=payload.answers,
            documents=payload.documents,
            mode=payload.intakeMode
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Clinical summary generation failed: {str(e)}"
        )
