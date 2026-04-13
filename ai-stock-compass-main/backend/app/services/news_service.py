"""News API service for stock news."""
import httpx
from typing import List, Dict, Any
from datetime import datetime, timedelta
import logging

from ..core.config import settings

logger = logging.getLogger(__name__)


class NewsService:
    """Service for fetching stock news from News API."""

    def __init__(self):
        self.api_key = settings.NEWS_API_KEY
        self.base_url = "https://newsapi.org/v2"

    async def get_stock_news(
        self,
        ticker: str,
        days_back: int = 7,
        max_articles: int = 20
    ) -> List[Dict[str, Any]]:
        """Get news articles for a stock ticker."""
        try:
            from_date = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/everything",
                    params={
                        "q": f"{ticker} stock OR {ticker} shares",
                        "from": from_date,
                        "sortBy": "publishedAt",
                        "language": "en",
                        "pageSize": max_articles,
                        "apiKey": self.api_key
                    },
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()

                articles = []
                for article in data.get("articles", []):
                    try:
                        published_at = datetime.strptime(
                            article.get("publishedAt", ""),
                            "%Y-%m-%dT%H:%M:%SZ"
                        )
                    except:
                        published_at = datetime.now()

                    articles.append({
                        "title": article.get("title", ""),
                        "description": article.get("description", ""),
                        "url": article.get("url", ""),
                        "source": article.get("source", {}).get("name", "Unknown"),
                        "published_at": published_at,
                        "image_url": article.get("urlToImage", ""),
                    })

                return articles

        except Exception as e:
            logger.error(f"Error fetching news for {ticker}: {e}")
            return []

    async def get_general_market_news(self, max_articles: int = 20) -> List[Dict[str, Any]]:
        """Get general market news."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/everything",
                    params={
                        "q": "stock market OR Wall Street OR NASDAQ OR S&P 500",
                        "sortBy": "publishedAt",
                        "language": "en",
                        "pageSize": max_articles,
                        "apiKey": self.api_key
                    },
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()

                articles = []
                for article in data.get("articles", []):
                    try:
                        published_at = datetime.strptime(
                            article.get("publishedAt", ""),
                            "%Y-%m-%dT%H:%M:%SZ"
                        )
                    except:
                        published_at = datetime.now()

                    articles.append({
                        "title": article.get("title", ""),
                        "description": article.get("description", ""),
                        "url": article.get("url", ""),
                        "source": article.get("source", {}).get("name", "Unknown"),
                        "published_at": published_at,
                        "image_url": article.get("urlToImage", ""),
                    })

                return articles

        except Exception as e:
            logger.error(f"Error fetching general market news: {e}")
            return []


news_service = NewsService()
