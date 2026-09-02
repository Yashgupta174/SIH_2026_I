from fastapi import APIRouter, HTTPException, status
from app.schemas.interview import NextQuestionRequest, QuestionResponse
from app.services.interview.adaptive_engine import AdaptiveQuestionEngine

router = APIRouter(prefix="/interview", tags=["Patient Interview"])
adaptive_engine = AdaptiveQuestionEngine()


@router.post("/next-question", response_model=QuestionResponse)
async def get_next_question(payload: NextQuestionRequest):
    """Generates next dynamic clinical intake question based on chief complaint, previous answers, and mode (GENERAL vs AYUSH)."""
    try:
        return await adaptive_engine.get_next_question(payload.sessionState, payload.lastAnswer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate next question: {str(e)}"
        )
