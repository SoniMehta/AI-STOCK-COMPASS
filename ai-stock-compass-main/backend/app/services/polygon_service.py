"""Polygon.io API service for stock data."""
import httpx
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import logging
import asyncio
import time

from ..core.config import settings

logger = logging.getLogger(__name__)


class PolygonService:
    """Service for interacting with Polygon.io API."""

    def __init__(self):
        self.api_key = settings.POLYGON_API_KEY
        self.base_url = "https://api.polygon.io"
        self._last_request_time = 0
        # Free tier: 5 requests/min - using 1 sec interval for better UX
        # Some requests may fail with 429, but most will succeed
        self._min_request_interval = 1.0
        self._lock = asyncio.Lock()  # Ensure serialized access
        logger.info("Polygon.io Service initialized (Free tier: 5 req/min with best-effort rate limiting)")

    async def _rate_limit(self):
        """Apply rate limiting to avoid hitting API limits."""
        async with self._lock:
            current_time = time.time()
            time_since_last = current_time - self._last_request_time
            if time_since_last < self._min_request_interval:
                await asyncio.sleep(self._min_request_interval - time_since_last)
            self._last_request_time = time.time()

    async def get_quote(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Get stock quote from Polygon using previous close data."""
        try:
            await self._rate_limit()

            async with httpx.AsyncClient() as client:
                # Get previous day's close data (available on free tier)
                response_prev = await client.get(
                    f"{self.base_url}/v2/aggs/ticker/{ticker}/prev",
                    params={"apiKey": self.api_key, "adjusted": "true"},
                    timeout=10.0
                )
                response_prev.raise_for_status()
                prev_data = response_prev.json()

                # Free tier returns "DELAYED" status (15-min delayed data)
                status = prev_data.get("status")
                if status not in ["OK", "DELAYED"] or not prev_data.get("results"):
                    logger.warning(f"No data for {ticker}. Status: {status}, Response: {prev_data}")
                    return None

                result = prev_data["results"][0]

                # For most recent data, use the previous close as current
                current_price = float(result["c"])
                open_price = float(result["o"])
                high_price = float(result["h"])
                low_price = float(result["l"])
                volume = int(result["v"])

                # Get even older data for comparison (if available)
                # We'll use open as "previous close" for calculating change
                previous_close = open_price
                change = current_price - previous_close
                change_percent = (change / previous_close * 100) if previous_close else 0

                return {
                    "c": current_price,
                    "d": change,
                    "dp": change_percent,
                    "h": high_price,
                    "l": low_price,
                    "o": open_price,
                    "pc": previous_close,
                    "t": int(result["t"] / 1000),  # Convert ms to seconds
                    "volume": volume
                }

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.error(f"Polygon API rate limit exceeded for {ticker}")
            elif e.response.status_code == 403:
                logger.error(f"Polygon API access forbidden for {ticker} - endpoint may require paid tier")
            else:
                logger.error(f"HTTP error fetching quote for {ticker}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error fetching quote for {ticker}: {e}")
            return None

    async def get_company_profile(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Get company overview information from Polygon."""
        try:
            await self._rate_limit()

            async with httpx.AsyncClient() as client:
                # Get ticker details
                response = await client.get(
                    f"{self.base_url}/v3/reference/tickers/{ticker}",
                    params={"apiKey": self.api_key},
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()

                status = data.get("status")
                if status not in ["OK", "DELAYED"] or not data.get("results"):
                    logger.warning(f"No company profile for {ticker}. Status: {status}")
                    return None

                results = data["results"]

                # Get market cap in millions
                market_cap = results.get("market_cap", 0)
                market_cap_millions = float(market_cap) / 1e6 if market_cap else 0

                return {
                    "name": results.get("name", ""),
                    "description": results.get("description", ""),
                    "sector": results.get("sic_description", ""),
                    "industry": results.get("sic_description", ""),
                    "marketCapitalization": market_cap_millions,
                    "52WeekHigh": 0,  # Not available in basic profile
                    "52WeekLow": 0,   # Not available in basic profile
                    "peRatio": 0,      # Not available in basic profile
                    "dividendYield": 0, # Not available in basic profile
                    "beta": 0,         # Not available in basic profile
                }
        except Exception as e:
            logger.error(f"Error fetching company profile for {ticker}: {e}")
            return None

    async def get_daily_candles(
        self,
        ticker: str,
        outputsize: str = "compact"
    ) -> Optional[Dict[str, Any]]:
        """Get daily historical candlestick data."""
        try:
            await self._rate_limit()

            # Determine date range
            end_date = datetime.now()
            if outputsize == "compact":
                start_date = end_date - timedelta(days=100)
            else:
                start_date = end_date - timedelta(days=365 * 5)  # 5 years

            from_date = start_date.strftime("%Y-%m-%d")
            to_date = end_date.strftime("%Y-%m-%d")

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/v2/aggs/ticker/{ticker}/range/1/day/{from_date}/{to_date}",
                    params={
                        "apiKey": self.api_key,
                        "adjusted": "true",
                        "sort": "asc",
                        "limit": 50000
                    },
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()

                status = data.get("status")
                if status not in ["OK", "DELAYED"] or not data.get("results"):
                    logger.warning(f"No candle data for {ticker}. Status: {status}")
                    return None

                results = data["results"]

                # Convert to arrays
                timestamps = []
                opens = []
                highs = []
                lows = []
                closes = []
                volumes = []

                for candle in results:
                    timestamps.append(int(candle["t"] / 1000))  # Convert ms to seconds
                    opens.append(float(candle["o"]))
                    highs.append(float(candle["h"]))
                    lows.append(float(candle["l"]))
                    closes.append(float(candle["c"]))
                    volumes.append(int(candle["v"]))

                return {
                    "s": "ok",
                    "t": timestamps,
                    "o": opens,
                    "h": highs,
                    "l": lows,
                    "c": closes,
                    "v": volumes
                }
        except Exception as e:
            logger.error(f"Error fetching daily candles for {ticker}: {e}")
            return None

    async def get_intraday_candles(
        self,
        ticker: str,
        interval: str = "5min"
    ) -> Optional[Dict[str, Any]]:
        """Get intraday historical candlestick data."""
        try:
            await self._rate_limit()

            # Map interval to minutes
            interval_map = {
                "1min": 1,
                "5min": 5,
                "15min": 15,
                "30min": 30,
                "60min": 60
            }
            minutes = interval_map.get(interval, 5)

            # Get last 2 days for intraday
            end_date = datetime.now()
            start_date = end_date - timedelta(days=2)

            from_date = start_date.strftime("%Y-%m-%d")
            to_date = end_date.strftime("%Y-%m-%d")

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/v2/aggs/ticker/{ticker}/range/{minutes}/minute/{from_date}/{to_date}",
                    params={
                        "apiKey": self.api_key,
                        "adjusted": "true",
                        "sort": "asc",
                        "limit": 50000
                    },
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()

                status = data.get("status")
                if status not in ["OK", "DELAYED"] or not data.get("results"):
                    logger.warning(f"No intraday data for {ticker}. Status: {status}")
                    return None

                results = data["results"]

                # Convert to arrays
                timestamps = []
                opens = []
                highs = []
                lows = []
                closes = []
                volumes = []

                for candle in results:
                    timestamps.append(int(candle["t"] / 1000))
                    opens.append(float(candle["o"]))
                    highs.append(float(candle["h"]))
                    lows.append(float(candle["l"]))
                    closes.append(float(candle["c"]))
                    volumes.append(int(candle["v"]))

                return {
                    "s": "ok",
                    "t": timestamps,
                    "o": opens,
                    "h": highs,
                    "l": lows,
                    "c": closes,
                    "v": volumes
                }
        except Exception as e:
            logger.error(f"Error fetching intraday candles for {ticker}: {e}")
            return None

    async def search_symbol(self, query: str) -> List[Dict[str, Any]]:
        """Search for stock symbols."""
        try:
            await self._rate_limit()

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/v3/reference/tickers",
                    params={
                        "apiKey": self.api_key,
                        "search": query,
                        "market": "stocks",
                        "active": "true",
                        "limit": 10
                    },
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()

                results = []
                for item in data.get("results", []):
                    results.append({
                        "symbol": item.get("ticker", ""),
                        "name": item.get("name", ""),
                        "type": item.get("type", ""),
                        "region": "US",
                    })
                return results
        except Exception as e:
            logger.error(f"Error searching symbols for {query}: {e}")
            return []


polygon_service = PolygonService()
