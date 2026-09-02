from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from app.schemas.speech import STTResponse
from app.services.providers.factory import get_ai_provider

router = APIRouter(prefix="/speech", tags=["Speech Processing"])
ai_provider = get_ai_provider()


@router.post("/transcribe", response_model=STTResponse)
async def transcribe_speech(
    audio: UploadFile = File(...),
    language: str = Form("hi")
):
    """Transcribes audio file to text with language and confidence scoring."""
    try:
        content = await audio.read()
        return await ai_provider.transcribe_audio(content, language)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech transcription failed: {str(e)}"
        )
