"""Stock-related schemas."""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class StockQuote(BaseModel):
    """Schema for stock quote."""
    ticker: str
    current_price: float
    change: float
    change_percent: float
    open: float
    high: float
    low: float
    volume: int
    timestamp: datetime


class StockAnalysisRequest(BaseModel):
    """Schema for stock analysis request."""
    ticker: str
    analysis_type: str = "full"  # full, market, sentiment, risk, beginner


class MarketAnalysis(BaseModel):
    """Schema for market analysis."""
    trend: str  # bullish, bearish, neutral
    support: Optional[str] = None
    resistance: Optional[str] = None
    confidence: float
    summary: str


class SentimentAnalysis(BaseModel):
    """Schema for sentiment analysis."""
    overall: str  # positive, negative, neutral
    articles_analyzed: int
    confidence: float
    headlines: List[str]


class RiskAnalysis(BaseModel):
    """Schema for risk analysis."""
    level: str  # low, medium, high
    volatility: str
    confidence: float
    factors: List[str]


class DecisionSynthesis(BaseModel):
    """Schema for AI decision."""
    recommendation: str  # BUY, SELL, HOLD
    summary: str
    confidence: float
    reasoning: str


class StockAnalysisResponse(BaseModel):
    """Schema for stock analysis response."""
    ticker: str
    market: Optional[MarketAnalysis] = None
    sentiment: Optional[SentimentAnalysis] = None
    risk: Optional[RiskAnalysis] = None
    decision: Optional[DecisionSynthesis] = None


class NewsArticle(BaseModel):
    """Schema for news article."""
    title: str
    description: Optional[str] = None
    url: str
    source: str
    published_at: datetime
    image_url: Optional[str] = None


class WatchlistItem(BaseModel):
    """Schema for watchlist item."""
    id: int
    ticker: str
    company_name: Optional[str] = None
    added_at: datetime

    class Config:
        from_attributes = True


class HistoryItem(BaseModel):
    """Schema for history item."""
    id: int
    ticker: str
    analysis_type: str
    recommendation: Optional[str] = None
    confidence: Optional[float] = None
    market_trend: Optional[str] = None
    sentiment: Optional[str] = None
    risk_level: Optional[str] = None
    summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BeginnerGuideRequest(BaseModel):
    """Schema for beginner guide request."""
    question: str
    ticker: Optional[str] = None


class BeginnerGuideResponse(BaseModel):
    """Schema for beginner guide response."""
    answer: str
    related_topics: List[str]
