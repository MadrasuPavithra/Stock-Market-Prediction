from fastapi import APIRouter
from app.api.endpoints import pipeline, ml

api_router = APIRouter()
api_router.include_router(pipeline.router)
api_router.include_router(ml.router)
