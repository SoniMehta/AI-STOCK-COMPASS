"""History model."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship

from ..core.database import Base


class History(Base):
    """Analysis history model."""

    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ticker = Column(String, nullable=False, index=True)
    analysis_type = Column(String, nullable=False)  # full, market, sentiment, risk, beginner
    recommendation = Column(String)  # BUY, SELL, HOLD
    confidence = Column(Float)
    market_trend = Column(String)
    sentiment = Column(String)
    risk_level = Column(String)
    summary = Column(Text)
    full_analysis = Column(Text)  # Store complete analysis as JSON
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="history")
