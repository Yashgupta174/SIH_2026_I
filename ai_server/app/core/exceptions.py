from fastapi import HTTPException, status
from fastapi.responses import JSONResponse


class AIException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


async def ai_exception_handler(request, exc: AIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message, "status": "error"}
    )
