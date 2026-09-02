import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "MediKiosk AI Server"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # AI Provider settings: MOCK or REAL
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "MOCK")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gemini-1.5-flash")
    
    # OCR Settings
    OCR_ENGINE: str = os.getenv("OCR_ENGINE", "tesseract")  # tesseract, easyocr, mock
    
    # Security
    API_KEY_SECRET: str = os.getenv("API_KEY_SECRET", "medikiosk_secret_key_2026")

    model_config = {"case_sensitive": True, "extra": "ignore"}


settings = Settings()
