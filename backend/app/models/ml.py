from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from datetime import datetime
from app.db.database import Base

class ModelConfig(Base):
    __tablename__ = "model_configs"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    d_model = Column(Integer)
    n_heads = Column(Integer)
    d_ff = Column(Integer)
    n_layers = Column(Integer)
    dropout = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class Hyperparam(Base):
    __tablename__ = "hyperparams"
    id = Column(Integer, primary_key=True, index=True)
    trial_number = Column(Integer)
    params_json = Column(JSON)
    val_loss = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class TrainingLog(Base):
    __tablename__ = "training_logs"
    id = Column(Integer, primary_key=True, index=True)
    epoch = Column(Integer)
    train_loss = Column(Float)
    val_loss = Column(Float)
    learning_rate = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    date = Column(DateTime, index=True)
    actual_price = Column(Float)
    predicted_price = Column(Float)
    error = Column(Float)

class Forecast30D(Base):
    __tablename__ = "forecast_30d"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    forecast_date = Column(DateTime, index=True)
    predicted_price = Column(Float)
    lower_bound = Column(Float)
    upper_bound = Column(Float)

class Signal(Base):
    __tablename__ = "signals"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    date = Column(DateTime, index=True)
    signal_type = Column(String) # BUY, SELL, HOLD
    rsi_value = Column(Float)
    macd_value = Column(Float)
    confidence = Column(Float)
