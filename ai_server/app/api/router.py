from fastapi import APIRouter
from app.api.v1.router import api_v1_router
from app.config import settings

master_router = APIRouter()
master_router.include_router(api_v1_router, prefix=settings.API_V1_STR)
