from sqlalchemy import Column, Integer, String, Float, DateTime
from app.db.database import Base

class StockRaw(Base):
    __tablename__ = "stocks_raw"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    date = Column(DateTime, index=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Float)

class StockProcessed(Base):
    __tablename__ = "stocks_processed"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    date = Column(DateTime, index=True)
    open_scaled = Column(Float)
    high_scaled = Column(Float)
    low_scaled = Column(Float)
    close_scaled = Column(Float)
    volume_scaled = Column(Float)
