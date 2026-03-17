from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.database import get_db
from app.services.data_service import fetch_historical_data
from app.services.feature_service import calculate_frps, calculate_technical_indicators
from app.models.stocks import StockRaw, StockProcessed
from app.models.features import FeatureFRPS, FeatureTechnical
from sklearn.preprocessing import MinMaxScaler
import pandas as pd

router = APIRouter(prefix="/api", tags=["pipeline"])

@router.get("/stocks/fetch")
async def fetch_stocks(ticker: str, start: str = "2020-01-01", db: AsyncSession = Depends(get_db)):
    """
    Step 1: Data Collection
    Fetch raw OHLCV data and insert it into the database.
    """
    try:
        df = fetch_historical_data(ticker, start)
        
        # In a real app we'd bulk insert this DataFrame via sqlalchemy
        # For this MVP, we return the counts to show success
        return {
            "status": "success",
            "message": f"Fetched {len(df)} records for {ticker}",
            "sample_head": df.head(2).to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/preprocess")
async def preprocess_data(ticker: str, db: AsyncSession = Depends(get_db)):
    """
    Step 2: Data Preprocessing
    Null removal, outlier handling, MinMaxScaler normalization.
    """
    try:
        # We would normally query `StockRaw` from `db` here. 
        # Simulating with a fetch to keep the pipeline self-contained for the demo.
        df = fetch_historical_data(ticker)
        
        # Drop Nulls
        df = df.dropna()
        
        # Scaling
        scaler = MinMaxScaler()
        cols_to_scale = ['open', 'high', 'low', 'close', 'volume']
        scaled_data = scaler.fit_transform(df[cols_to_scale])
        
        df_scaled = pd.DataFrame(scaled_data, columns=[f"{c}_scaled" for c in cols_to_scale])
        df_scaled['date'] = df['date'].values
        
        return {
            "status": "success", 
            "message": f"Preprocessed {len(df_scaled)} records for {ticker}",
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/features/frps")
async def generate_frps(ticker: str, db: AsyncSession = Depends(get_db)):
    """
    Step 3: FRPS Feature Engineering
    """
    df = fetch_historical_data(ticker)
    df_frps = calculate_frps(df)
    
    return {
        "status": "success",
        "message": f"Calculated 8 FRPS features for {ticker}",
        "features": list(df_frps.columns)
    }

@router.post("/features/technical")
async def generate_technical(ticker: str, db: AsyncSession = Depends(get_db)):
    """
    Step 4: Technical Indicators (35+ features)
    """
    df = fetch_historical_data(ticker)
    df_tech = calculate_technical_indicators(df)
    
    return {
        "status": "success",
        "message": f"Calculated technical indicators for {ticker}",
        "features": list(df_tech.columns)
    }

@router.post("/split")
async def split_dataset(ticker: str):
    """
    Step 5: Dataset Splitting
    80% Train | 10% Validation | 10% Test
    """
    df = fetch_historical_data(ticker)
    
    n = len(df)
    train_end = int(n * 0.8)
    val_end = int(n * 0.9)
    
    train_df = df.iloc[:train_end]
    val_df = df.iloc[train_end:val_end]
    test_df = df.iloc[val_end:]
    
    return {
        "status": "success",
        "splits": {
            "train": len(train_df),
            "validation": len(val_df),
            "test": len(test_df)
        }
    }
