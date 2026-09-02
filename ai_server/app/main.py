from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.router import master_router
from app.core.exceptions import AIException, ai_exception_handler
from app.core.logging import logger

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="MediKiosk Python FastAPI Backend for OCR Document Parsing, Dynamic Patient Interviewing & Clinical Summaries",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for Node.js Express server and React Kiosk Client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AIException, ai_exception_handler)
app.include_router(master_router)


@app.get("/health", tags=["Health Check"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "aiProvider": settings.AI_PROVIDER,
        "ocrEngine": settings.OCR_ENGINE,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
