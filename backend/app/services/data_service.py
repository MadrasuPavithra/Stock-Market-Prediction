import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

def fetch_historical_data(ticker: str, start_date: str = "2020-01-01", end_date: str = None) -> pd.DataFrame:
    """
    Fetch historical OHLCV data from yfinance.
    Uses caching logic implicitly when we connect this to Redis later.
    """
    if end_date:
        df = yf.download(ticker, start=start_date, end=end_date, progress=False)
    else:
        df = yf.download(ticker, start=start_date, progress=False)
    
    if df.empty:
        raise ValueError(f"No data found for ticker {ticker}")
        
    # Flatten MultiIndex columns if necessary (yfinance sometimes nests)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [col[0].lower() for col in df.columns]
    else:
        df.columns = [col.lower() for col in df.columns]

    df.reset_index(inplace=True)
    df.rename(columns={"index": "date", "date": "date", "Date": "date"}, inplace=True)
    
    # Ensure expected columns
    expected = ["date", "open", "high", "low", "close", "volume"]
    for col in expected:
        if col not in df.columns:
             raise ValueError(f"Missing expected column {col} from yfinance data for {ticker}")

    return df[expected]

def fetch_live_data(ticker: str) -> dict:
    """Fetches exact real-time tick for current price and today's open."""
    df = yf.download(ticker, period="5d", interval="1m", progress=False)
    if df.empty:
        return {"current_price": 0.0, "today_open": 0.0}
    
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [col[0].lower() for col in df.columns]
    else:
        df.columns = [col.lower() for col in df.columns]
        
    current_price = float(df['close'].iloc[-1])
    today_open = float(df['open'].iloc[0])
    return {"current_price": current_price, "today_open": today_open}
