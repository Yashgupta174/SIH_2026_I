from fastapi import APIRouter
from app.api.v1.ocr import router as ocr_router
from app.api.v1.interview import router as interview_router
from app.api.v1.clinical import router as clinical_router
from app.api.v1.summary import router as summary_router
from app.api.v1.speech import router as speech_router

api_v1_router = APIRouter()
api_v1_router.include_router(ocr_router)
api_v1_router.include_router(interview_router)
api_v1_router.include_router(clinical_router)
api_v1_router.include_router(summary_router)
api_v1_router.include_router(speech_router)
