from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="FRPS-Enhanced Stock Forecaster",
    version="1.0.0",
    description="Backend API for predicting multi-stock prices and providing technical analysis."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.router import api_router

@app.get("/")
def read_root():
    return {"message": "FRPS-Enhanced Multi-Stock Forecasting API is running"}

app.include_router(api_router)
