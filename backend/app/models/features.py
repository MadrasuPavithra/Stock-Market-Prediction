from sqlalchemy import Column, Integer, String, Float, DateTime
from app.db.database import Base

class FeatureFRPS(Base):
    __tablename__ = "features_frps"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    date = Column(DateTime, index=True)
    pivot = Column(Float)
    r1 = Column(Float)
    r2 = Column(Float)
    s1 = Column(Float)
    s2 = Column(Float)
    dist_r1 = Column(Float)
    dist_s1 = Column(Float)
    dist_pivot = Column(Float)

class FeatureTechnical(Base):
    __tablename__ = "features_technical"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    date = Column(DateTime, index=True)
    rsi = Column(Float)
    macd = Column(Float)
    macd_signal = Column(Float)
    bb_upper = Column(Float)
    bb_lower = Column(Float)
    atr = Column(Float)
    obv = Column(Float)
    stoch_k = Column(Float)
    stoch_d = Column(Float)
    sma20 = Column(Float)
    sma50 = Column(Float)
    ema20 = Column(Float)
