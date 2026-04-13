"""Stock analysis routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import json
import logging

from ...core.database import get_db
from ...core.security import get_current_active_user
from ...models.user import User
from ...models.history import History
from ...schemas.stock import (
    StockQuote,
    StockAnalysisRequest,
    StockAnalysisResponse,
    MarketAnalysis,
    SentimentAnalysis,
    RiskAnalysis,
    DecisionSynthesis,
)
from ...services.polygon_service import polygon_service
from ...services.news_service import news_service
from ...services.ai_service import ai_service

router = APIRouter(prefix="/stocks", tags=["stocks"])
logger = logging.getLogger(__name__)


@router.get("/{ticker}/quote")
async def get_stock_quote(
    ticker: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get real-time stock quote from Polygon.io."""
    try:
        quote = await polygon_service.get_quote(ticker.upper())

        if not quote:
            raise HTTPException(status_code=404, detail=f"Stock {ticker} not found")

        # Get company profile for additional data
        profile = await polygon_service.get_company_profile(ticker.upper())

        if profile:
            quote.update({
                "name": profile.get("name", ""),
                "marketCapitalization": profile.get("marketCapitalization", 0),
                "52WeekHigh": profile.get("52WeekHigh", 0),
                "52WeekLow": profile.get("52WeekLow", 0),
            })

        return quote
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching quote for {ticker}: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching stock data: {str(e)}")


@router.get("/{ticker}/candles")
async def get_stock_candles(
    ticker: str,
    resolution: str = Query("D", description="Candle resolution (1, 5, 15, 30, 60, D, W, M)"),
    from_timestamp: int = Query(alias="from"),
    to_timestamp: int = Query(alias="to"),
    current_user: User = Depends(get_current_active_user)
):
    """Get historical candlestick data for charts from Polygon.io."""
    try:
        from datetime import datetime

        # Determine which Polygon.io function to use
        if resolution in ["1", "5", "15", "30", "60"]:
            # Intraday data
            interval_map = {
                "1": "1min",
                "5": "5min",
                "15": "15min",
                "30": "30min",
                "60": "60min"
            }
            interval = interval_map.get(resolution, "5min")
            candles = await polygon_service.get_intraday_candles(ticker.upper(), interval)
        else:
            # Daily, weekly, or monthly data
            candles = await polygon_service.get_daily_candles(ticker.upper(), outputsize="compact")

        if not candles:
            raise HTTPException(
                status_code=404,
                detail=f"No candle data available for {ticker}"
            )

        # Filter data based on from_timestamp and to_timestamp
        if candles.get("t"):
            filtered_indices = [
                i for i, t in enumerate(candles["t"])
                if from_timestamp <= t <= to_timestamp
            ]

            if filtered_indices:
                candles = {
                    "s": "ok",
                    "t": [candles["t"][i] for i in filtered_indices],
                    "o": [candles["o"][i] for i in filtered_indices],
                    "h": [candles["h"][i] for i in filtered_indices],
                    "l": [candles["l"][i] for i in filtered_indices],
                    "c": [candles["c"][i] for i in filtered_indices],
                    "v": [candles["v"][i] for i in filtered_indices]
                }

        return candles
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching candles for {ticker}: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching candle data: {str(e)}")


@router.get("/search")
async def search_stocks(
    q: str = Query(..., description="Search query"),
    current_user: User = Depends(get_current_active_user)
):
    """Search for stock symbols."""
    try:
        results = await polygon_service.search_symbol(q)
        return results
    except Exception as e:
        logger.error(f"Error searching stocks: {e}")
        raise HTTPException(status_code=500, detail=f"Error searching stocks: {str(e)}")


@router.get("/{ticker}/simple-insights")
async def get_simple_insights(
    ticker: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get AI-generated insights using only the stock ticker (no real-time data)."""
    try:
        insights = await ai_service.simple_stock_insights(ticker.upper())
        return insights
    except Exception as e:
        logger.error(f"Error getting simple insights for {ticker}: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")


@router.post("/analyze", response_model=StockAnalysisResponse)
async def analyze_stock(
    request: StockAnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Perform comprehensive AI stock analysis."""
    ticker = request.ticker.upper()
    analysis_type = request.analysis_type

    # Fetch stock data from Polygon.io
    quote = await polygon_service.get_quote(ticker)
    if not quote:
        raise HTTPException(status_code=404, detail=f"Stock {ticker} not found")

    profile = await polygon_service.get_company_profile(ticker)

    response_data = {"ticker": ticker}

    # Perform requested analyses
    if analysis_type in ["full", "market"]:
        market_analysis = await ai_service.analyze_market_data(ticker, quote, profile)
        response_data["market"] = MarketAnalysis(**market_analysis)

    if analysis_type in ["full", "sentiment"]:
        news_articles = await news_service.get_stock_news(ticker, days_back=7, max_articles=20)
        sentiment_analysis = await ai_service.analyze_sentiment(ticker, news_articles)
        response_data["sentiment"] = SentimentAnalysis(**sentiment_analysis)

    if analysis_type in ["full", "risk"]:
        risk_analysis = await ai_service.analyze_risk(ticker, quote, profile)
        response_data["risk"] = RiskAnalysis(**risk_analysis)

    if analysis_type == "full":
        decision = await ai_service.generate_decision(
            ticker,
            response_data.get("market"),
            response_data.get("sentiment"),
            response_data.get("risk")
        )
        response_data["decision"] = DecisionSynthesis(**decision)

    # Store analysis in history
    try:
        full_analysis_json = json.dumps({
            "market": response_data.get("market").model_dump() if response_data.get("market") else None,
            "sentiment": response_data.get("sentiment").model_dump() if response_data.get("sentiment") else None,
            "risk": response_data.get("risk").model_dump() if response_data.get("risk") else None,
            "decision": response_data.get("decision").model_dump() if response_data.get("decision") else None,
        })

        history_entry = History(
            user_id=current_user.id,
            ticker=ticker,
            analysis_type=analysis_type,
            recommendation=response_data.get("decision").recommendation if response_data.get("decision") else "N/A",
            confidence=response_data.get("decision").confidence if response_data.get("decision") else 0.0,
            market_trend=response_data.get("market").trend if response_data.get("market") else None,
            sentiment=response_data.get("sentiment").overall if response_data.get("sentiment") else None,
            risk_level=response_data.get("risk").level if response_data.get("risk") else None,
            summary=response_data.get("decision").summary if response_data.get("decision") else "Analysis completed",
            full_analysis=full_analysis_json
        )

        db.add(history_entry)
        await db.commit()
    except Exception as e:
        logger.error(f"Error saving analysis to history: {e}")
        await db.rollback()

    return StockAnalysisResponse(**response_data)
