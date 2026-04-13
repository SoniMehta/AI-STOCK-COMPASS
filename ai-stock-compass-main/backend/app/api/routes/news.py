"""News routes."""
from fastapi import APIRouter, Depends, Query
from typing import List

from ...core.security import get_current_active_user
from ...models.user import User
from ...schemas.stock import NewsArticle
from ...services.news_service import news_service

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/stock/{ticker}", response_model=List[NewsArticle])
async def get_stock_news(
    ticker: str,
    days_back: int = Query(7, ge=1, le=30),
    max_articles: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_active_user)
):
    """Get news articles for a specific stock."""
    articles = await news_service.get_stock_news(
        ticker.upper(),
        days_back=days_back,
        max_articles=max_articles
    )
    return articles


@router.get("/market", response_model=List[NewsArticle])
async def get_market_news(
    max_articles: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_active_user)
):
    """Get general market news."""
    articles = await news_service.get_general_market_news(max_articles=max_articles)
    return articles
