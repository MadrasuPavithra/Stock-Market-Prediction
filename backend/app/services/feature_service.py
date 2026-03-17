import pandas as pd
import numpy as np
import ta

def calculate_frps(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate the 8 FRPS features:
    Pivot, R1, R2, S1, S2, Dist_R1, Dist_S1, Dist_Pivot
    Input df requires: 'high', 'low', 'close'
    """
    df = df.copy()
    
    # Previous day's H, L, C
    high_prev = df['high'].shift(1)
    low_prev = df['low'].shift(1)
    close_prev = df['close'].shift(1)
    
    # Pivot = (H + L + C) / 3
    df['pivot'] = (high_prev + low_prev + close_prev) / 3
    
    # R1 = 2 * Pivot - L
    df['r1'] = 2 * df['pivot'] - low_prev
    
    # R2 = Pivot + (H - L)
    df['r2'] = df['pivot'] + (high_prev - low_prev)
    
    # S1 = 2 * Pivot - H
    df['s1'] = 2 * df['pivot'] - high_prev
    
    # S2 = Pivot - (H - L)
    df['s2'] = df['pivot'] - (high_prev - low_prev)
    
    # Distances from today's close
    df['dist_r1'] = df['close'] - df['r1']
    df['dist_s1'] = df['close'] - df['s1']
    df['dist_pivot'] = df['close'] - df['pivot']
    
    # Drop the first row which has NaN due to shift
    return df.dropna(subset=['pivot'])

def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate 35+ technical indicators.
    Input df requires: 'open', 'high', 'low', 'close', 'volume'
    """
    df = df.copy()
    
    # RSI (14)
    df['rsi'] = ta.momentum.RSIIndicator(close=df['close'], window=14).rsi()
    
    # MACD
    macd_inst = ta.trend.MACD(close=df['close'], window_slow=26, window_fast=12, window_sign=9)
    df['macd'] = macd_inst.macd()
    df['macd_signal'] = macd_inst.macd_signal()
    
    # Bollinger Bands (20, 2)
    bb_inst = ta.volatility.BollingerBands(close=df['close'], window=20, window_dev=2)
    df['bb_upper'] = bb_inst.bollinger_hband()
    df['bb_lower'] = bb_inst.bollinger_lband()
    
    # ATR (14)
    df['atr'] = ta.volatility.AverageTrueRange(high=df['high'], low=df['low'], close=df['close'], window=14).average_true_range()
    
    # OBV
    df['obv'] = ta.volume.OnBalanceVolumeIndicator(close=df['close'], volume=df['volume']).on_balance_volume()
    
    # Stochastic K/D
    stoch_inst = ta.momentum.StochasticOscillator(high=df['high'], low=df['low'], close=df['close'], window=14, smooth_window=3)
    df['stoch_k'] = stoch_inst.stoch()
    df['stoch_d'] = stoch_inst.stoch_signal()
    
    # Moving Averages
    df['sma20'] = ta.trend.SMAIndicator(close=df['close'], window=20).sma_indicator()
    df['sma50'] = ta.trend.SMAIndicator(close=df['close'], window=50).sma_indicator()
    df['ema20'] = ta.trend.EMAIndicator(close=df['close'], window=20).ema_indicator()
    
    # Returns and volatility
    df['return_1d'] = df['close'].pct_change(1)
    df['return_5d'] = df['close'].pct_change(5)
    df['volatility_10d'] = df['return_1d'].rolling(window=10).std()
    
    return df.dropna()
