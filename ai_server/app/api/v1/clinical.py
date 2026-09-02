from fastapi import APIRouter, HTTPException, status
from app.schemas.red_flags import EvaluateRedFlagsRequest, EvaluateRedFlagsResponse
from app.services.red_flags.evaluator import RedFlagEvaluator

router = APIRouter(prefix="/clinical", tags=["Clinical Safety & Red Flags"])
red_flag_evaluator = RedFlagEvaluator()


@router.post("/evaluate-red-flags", response_model=EvaluateRedFlagsResponse)
async def evaluate_red_flags(payload: EvaluateRedFlagsRequest):
    """Evaluates symptoms and answers against critical emergency rules for immediate nurse triage alerts."""
    try:
        alerts = await red_flag_evaluator.evaluate(payload.answers, payload.chiefComplaint or "")
        return EvaluateRedFlagsResponse(
            hasRedFlags=len(alerts) > 0,
            alerts=alerts
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Red flag evaluation failed: {str(e)}"
        )
