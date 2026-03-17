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
    try:
        t = yf.Ticker(ticker)
        fast = t.fast_info
        
        current_price = float(fast.last_price)
        today_open = float(fast.open)
        
        # If fast_info fails to populate, fallback to 1d download
        if not current_price or not today_open:
            raise ValueError("fast_info empty")
            
        return {"current_price": current_price, "today_open": today_open}
        
    except Exception:
        # Fallback to 1m history just for today
        df = yf.download(ticker, period="1d", interval="1m", progress=False)
        if df.empty:
            # Absolute fallback to larger period
            df = yf.download(ticker, period="5d", interval="1m", progress=False)
            if df.empty:
                return {"current_price": 0.0, "today_open": 0.0}
        
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [col[0].lower() for col in df.columns]
        else:
            df.columns = [col.lower() for col in df.columns]
            
        # Group by date to get the ACTUAL open of the latest available day
        df['dt_date'] = df.index.date
        latest_date = df['dt_date'].iloc[-1]
        today_data = df[df['dt_date'] == latest_date]
        
        current_price = float(today_data['close'].iloc[-1])
        today_open = float(today_data['open'].iloc[0])
        return {"current_price": current_price, "today_open": today_open}
