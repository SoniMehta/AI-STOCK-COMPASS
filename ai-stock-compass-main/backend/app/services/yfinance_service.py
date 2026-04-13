# # """Yahoo Finance API service for free, unlimited stock data."""
# # import yfinance as yf
# # import httpx
# # import asyncio
# # import logging
# # from typing import Dict, Any, Optional, List
# # from datetime import datetime

# # logger = logging.getLogger(__name__)

# # class YFinanceService:
# #     """Service for interacting with Yahoo Finance (No rate limits, free historical data)."""

# #     def __init__(self):
# #         logger.info("YFinance Service initialized (Unlimited Free Tier)")
# #         # Common Indian stocks that need the .NS suffix for Yahoo Finance
# #         self.indian_stocks = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ITC", "SBIN", "BHARTIARTL"]

# #     def _format_ticker(self, ticker: str) -> str:
# #         """Auto-append .NS for known Indian stocks if user forgets."""
# #         ticker = ticker.upper()
# #         if ticker in self.indian_stocks:
# #             return f"{ticker}.NS"
# #         return ticker

# #     async def get_quote(self, ticker: str) -> Optional[Dict[str, Any]]:
# #         """Get current stock quote."""
# #         formatted_ticker = self._format_ticker(ticker)
        
# #         def fetch():
# #             stock = yf.Ticker(formatted_ticker)
# #             hist = stock.history(period="5d")
# #             if hist.empty:
# #                 return None
                
# #             current = hist.iloc[-1]
# #             prev = hist.iloc[-2] if len(hist) > 1 else current
            
# #             c = float(current['Close'])
# #             o = float(current['Open'])
# #             h = float(current['High'])
# #             l = float(current['Low'])
# #             v = int(current['Volume'])
# #             pc = float(prev['Close'])
            
# #             d = c - pc
# #             dp = (d / pc * 100) if pc else 0
            
# #             return {
# #                 "c": c, "d": d, "dp": dp, "h": h, "l": l, "o": o, "pc": pc,
# #                 "t": int(current.name.timestamp()), "volume": v
# #             }
            
# #         try:
# #             return await asyncio.to_thread(fetch)
# #         except Exception as e:
# #             logger.error(f"Error fetching quote for {ticker}: {e}")
# #             return None

# #     async def get_company_profile(self, ticker: str) -> Optional[Dict[str, Any]]:
# #         """Get fundamental company information."""
# #         formatted_ticker = self._format_ticker(ticker)
        
# #         def fetch():
# #             stock = yf.Ticker(formatted_ticker)
# #             info = stock.info
# #             if not info:
# #                 return None
                
# #             market_cap = info.get("marketCap", 0)
# #             market_cap_millions = float(market_cap) / 1e6 if market_cap else 0
            
# #             return {
# #                 "name": info.get("shortName", info.get("longName", ticker)),
# #                 "description": info.get("longBusinessSummary", ""),
# #                 "sector": info.get("sector", ""),
# #                 "industry": info.get("industry", ""),
# #                 "marketCapitalization": market_cap_millions,
# #                 "52WeekHigh": info.get("fiftyTwoWeekHigh", 0),
# #                 "52WeekLow": info.get("fiftyTwoWeekLow", 0),
# #                 "peRatio": info.get("trailingPE", 0),
# #                 "beta": info.get("beta", 0),
# #             }
            
# #         try:
# #             return await asyncio.to_thread(fetch)
# #         except Exception as e:
# #             logger.error(f"Error fetching profile for {ticker}: {e}")
# #             return None

# #     async def get_daily_candles(self, ticker: str, outputsize: str = "compact") -> Optional[Dict[str, Any]]:
# #         """Get daily historical candlestick data for charts."""
# #         formatted_ticker = self._format_ticker(ticker)
        
# #         def fetch():
# #             stock = yf.Ticker(formatted_ticker)
# #             period = "3mo" if outputsize == "compact" else "5y"
# #             hist = stock.history(period=period, interval="1d")
            
# #             if hist.empty:
# #                 return None
                
# #             return {
# #                 "s": "ok",
# #                 "t": [int(x.timestamp()) for x in hist.index],
# #                 "o": hist['Open'].tolist(),
# #                 "h": hist['High'].tolist(),
# #                 "l": hist['Low'].tolist(),
# #                 "c": hist['Close'].tolist(),
# #                 "v": hist['Volume'].tolist()
# #             }
            
# #         try:
# #             return await asyncio.to_thread(fetch)
# #         except Exception as e:
# #             logger.error(f"Error fetching daily candles for {ticker}: {e}")
# #             return None

# #     async def get_intraday_candles(self, ticker: str, interval: str = "5min") -> Optional[Dict[str, Any]]:
# #         """Get intraday candlestick data."""
# #         formatted_ticker = self._format_ticker(ticker)
        
# #         def fetch():
# #             interval_map = {"1min": "1m", "5min": "5m", "15min": "15m", "30min": "30m", "60min": "60m"}
# #             yf_interval = interval_map.get(interval, "5m")
# #             period = "5d" if yf_interval in ["1m", "5m"] else "1mo"
            
# #             stock = yf.Ticker(formatted_ticker)
# #             hist = stock.history(period=period, interval=yf_interval)
            
# #             if hist.empty:
# #                 return None
                
# #             return {
# #                 "s": "ok",
# #                 "t": [int(x.timestamp()) for x in hist.index],
# #                 "o": hist['Open'].tolist(),
# #                 "h": hist['High'].tolist(),
# #                 "l": hist['Low'].tolist(),
# #                 "c": hist['Close'].tolist(),
# #                 "v": hist['Volume'].tolist()
# #             }
            
# #         try:
# #             return await asyncio.to_thread(fetch)
# #         except Exception as e:
# #             logger.error(f"Error fetching intraday candles for {ticker}: {e}")
# #             return None

# #     async def search_symbol(self, query: str) -> List[Dict[str, Any]]:
# #         """Search for stock symbols globally."""
# #         try:
# #             async with httpx.AsyncClient() as client:
# #                 response = await client.get(
# #                     f"https://query2.finance.yahoo.com/v1/finance/search",
# #                     params={"q": query, "quotesCount": 10, "newsCount": 0},
# #                     headers={"User-Agent": "Mozilla/5.0"},
# #                     timeout=10.0
# #                 )
# #                 response.raise_for_status()
# #                 data = response.json()

# #                 results = []
# #                 for item in data.get("quotes", []):
# #                     if item.get("quoteType") in ["EQUITY", "ETF", "INDEX"]:
# #                         results.append({
# #                             "symbol": item.get("symbol", ""),
# #                             "name": item.get("shortname", item.get("longname", "")),
# #                             "type": item.get("quoteType", ""),
# #                             "region": item.get("exchange", "Global"),
# #                         })
# #                 return results
# #         except Exception as e:
# #             logger.error(f"Error searching symbols for {query}: {e}")
# #             return []

# # yfinance_service = YFinanceService()


# """Yahoo Finance API service for free, unlimited stock data."""
# import yfinance as yf
# import requests
# import httpx
# import asyncio
# import logging
# from typing import Dict, Any, Optional, List
# from datetime import datetime

# logger = logging.getLogger(__name__)

# class YFinanceService:
#     """Service for interacting with Yahoo Finance (No rate limits, free historical data)."""

#     def __init__(self):
#         logger.info("YFinance Service initialized (Unlimited Free Tier)")
#         # Common Indian stocks that need the .NS suffix for Yahoo Finance
#         self.indian_stocks = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ITC", "SBIN", "BHARTIARTL"]
        
#         # FIXED: Setup a custom session to bypass Yahoo Finance bot blocking
#         self.session = requests.Session()
#         self.session.headers.update({
#             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
#             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
#             "Accept-Language": "en-US,en;q=0.5",
#         })

#     def _format_ticker(self, ticker: str) -> str:
#         """Auto-append .NS for known Indian stocks if user forgets."""
#         ticker = ticker.upper()
#         if ticker in self.indian_stocks:
#             return f"{ticker}.NS"
#         return ticker

#     async def get_quote(self, ticker: str) -> Optional[Dict[str, Any]]:
#         """Get current stock quote."""
#         formatted_ticker = self._format_ticker(ticker)
        
#         def fetch():
#             # Pass the custom session here
#             stock = yf.Ticker(formatted_ticker, session=self.session)
#             hist = stock.history(period="5d")
#             if hist.empty:
#                 return None
                
#             current = hist.iloc[-1]
#             prev = hist.iloc[-2] if len(hist) > 1 else current
            
#             c = float(current['Close'])
#             o = float(current['Open'])
#             h = float(current['High'])
#             l = float(current['Low'])
#             v = int(current['Volume'])
#             pc = float(prev['Close'])
            
#             d = c - pc
#             dp = (d / pc * 100) if pc else 0
            
#             return {
#                 "c": c, "d": d, "dp": dp, "h": h, "l": l, "o": o, "pc": pc,
#                 "t": int(current.name.timestamp()), "volume": v
#             }
            
#         try:
#             return await asyncio.to_thread(fetch)
#         except Exception as e:
#             logger.error(f"Error fetching quote for {ticker}: {e}")
#             return None

#     async def get_company_profile(self, ticker: str) -> Optional[Dict[str, Any]]:
#         """Get fundamental company information."""
#         formatted_ticker = self._format_ticker(ticker)
        
#         def fetch():
#             stock = yf.Ticker(formatted_ticker, session=self.session)
#             info = stock.info
#             if not info:
#                 return None
                
#             market_cap = info.get("marketCap", 0)
#             market_cap_millions = float(market_cap) / 1e6 if market_cap else 0
            
#             return {
#                 "name": info.get("shortName", info.get("longName", ticker)),
#                 "description": info.get("longBusinessSummary", ""),
#                 "sector": info.get("sector", ""),
#                 "industry": info.get("industry", ""),
#                 "marketCapitalization": market_cap_millions,
#                 "52WeekHigh": info.get("fiftyTwoWeekHigh", 0),
#                 "52WeekLow": info.get("fiftyTwoWeekLow", 0),
#                 "peRatio": info.get("trailingPE", 0),
#                 "beta": info.get("beta", 0),
#             }
            
#         try:
#             return await asyncio.to_thread(fetch)
#         except Exception as e:
#             logger.error(f"Error fetching profile for {ticker}: {e}")
#             return None

#     async def get_daily_candles(self, ticker: str, outputsize: str = "compact") -> Optional[Dict[str, Any]]:
#         """Get daily historical candlestick data for charts."""
#         formatted_ticker = self._format_ticker(ticker)
        
#         def fetch():
#             stock = yf.Ticker(formatted_ticker, session=self.session)
#             period = "3mo" if outputsize == "compact" else "5y"
#             hist = stock.history(period=period, interval="1d")
            
#             if hist.empty:
#                 return None
                
#             return {
#                 "s": "ok",
#                 "t": [int(x.timestamp()) for x in hist.index],
#                 "o": hist['Open'].tolist(),
#                 "h": hist['High'].tolist(),
#                 "l": hist['Low'].tolist(),
#                 "c": hist['Close'].tolist(),
#                 "v": hist['Volume'].tolist()
#             }
            
#         try:
#             return await asyncio.to_thread(fetch)
#         except Exception as e:
#             logger.error(f"Error fetching daily candles for {ticker}: {e}")
#             return None

#     async def get_intraday_candles(self, ticker: str, interval: str = "5min") -> Optional[Dict[str, Any]]:
#         """Get intraday candlestick data."""
#         formatted_ticker = self._format_ticker(ticker)
        
#         def fetch():
#             interval_map = {"1min": "1m", "5min": "5m", "15min": "15m", "30min": "30m", "60min": "60m"}
#             yf_interval = interval_map.get(interval, "5m")
#             period = "5d" if yf_interval in ["1m", "5m"] else "1mo"
            
#             stock = yf.Ticker(formatted_ticker, session=self.session)
#             hist = stock.history(period=period, interval=yf_interval)
            
#             if hist.empty:
#                 return None
                
#             return {
#                 "s": "ok",
#                 "t": [int(x.timestamp()) for x in hist.index],
#                 "o": hist['Open'].tolist(),
#                 "h": hist['High'].tolist(),
#                 "l": hist['Low'].tolist(),
#                 "c": hist['Close'].tolist(),
#                 "v": hist['Volume'].tolist()
#             }
            
#         try:
#             return await asyncio.to_thread(fetch)
#         except Exception as e:
#             logger.error(f"Error fetching intraday candles for {ticker}: {e}")
#             return None

#     async def search_symbol(self, query: str) -> List[Dict[str, Any]]:
#         """Search for stock symbols globally."""
#         try:
#             async with httpx.AsyncClient() as client:
#                 response = await client.get(
#                     f"https://query2.finance.yahoo.com/v1/finance/search",
#                     params={"q": query, "quotesCount": 10, "newsCount": 0},
#                     headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0"},
#                     timeout=10.0
#                 )
#                 response.raise_for_status()
#                 data = response.json()

#                 results = []
#                 for item in data.get("quotes", []):
#                     if item.get("quoteType") in ["EQUITY", "ETF", "INDEX"]:
#                         results.append({
#                             "symbol": item.get("symbol", ""),
#                             "name": item.get("shortname", item.get("longname", "")),
#                             "type": item.get("quoteType", ""),
#                             "region": item.get("exchange", "Global"),
#                         })
#                 return results
#         except Exception as e:
#             logger.error(f"Error searching symbols for {query}: {e}")
#             return []

# yfinance_service = YFinanceService()


"""Yahoo Finance API service for free, unlimited stock data."""
import yfinance as yf
import httpx
import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logger = logging.getLogger(__name__)

class YFinanceService:
    """Service for interacting with Yahoo Finance (No rate limits, free historical data)."""

    def __init__(self):
        logger.info("YFinance Service initialized (Unlimited Free Tier)")
        # Common Indian stocks that need the .NS suffix for Yahoo Finance
        self.indian_stocks = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ITC", "SBIN", "BHARTIARTL"]

    def _format_ticker(self, ticker: str) -> str:
        """Auto-append .NS for known Indian stocks if user forgets."""
        ticker = ticker.upper()
        if ticker in self.indian_stocks:
            return f"{ticker}.NS"
        return ticker

    async def get_quote(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Get current stock quote."""
        formatted_ticker = self._format_ticker(ticker)
        
        def fetch():
            # FIXED: Removed custom session, letting yfinance handle it to avoid curl_cffi error
            stock = yf.Ticker(formatted_ticker)
            hist = stock.history(period="5d")
            
            if hist.empty:
                return None
                
            current = hist.iloc[-1]
            prev = hist.iloc[-2] if len(hist) > 1 else current
            
            c = float(current['Close'])
            o = float(current['Open'])
            h = float(current['High'])
            l = float(current['Low'])
            v = int(current['Volume'])
            pc = float(prev['Close'])
            
            d = c - pc
            dp = (d / pc * 100) if pc else 0
            
            return {
                "c": c, "d": d, "dp": dp, "h": h, "l": l, "o": o, "pc": pc,
                "t": int(current.name.timestamp()), "volume": v
            }
            
        try:
            return await asyncio.to_thread(fetch)
        except Exception as e:
            logger.error(f"Error fetching quote for {ticker}: {e}")
            return None

    async def get_company_profile(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Get fundamental company information."""
        formatted_ticker = self._format_ticker(ticker)
        
        def fetch():
            # FIXED: Removed custom session
            stock = yf.Ticker(formatted_ticker)
            info = stock.info
            if not info:
                return None
                
            market_cap = info.get("marketCap", 0)
            market_cap_millions = float(market_cap) / 1e6 if market_cap else 0
            
            return {
                "name": info.get("shortName", info.get("longName", ticker)),
                "description": info.get("longBusinessSummary", ""),
                "sector": info.get("sector", ""),
                "industry": info.get("industry", ""),
                "marketCapitalization": market_cap_millions,
                "52WeekHigh": info.get("fiftyTwoWeekHigh", 0),
                "52WeekLow": info.get("fiftyTwoWeekLow", 0),
                "peRatio": info.get("trailingPE", 0),
                "beta": info.get("beta", 0),
            }
            
        try:
            return await asyncio.to_thread(fetch)
        except Exception as e:
            logger.error(f"Error fetching profile for {ticker}: {e}")
            return None

    async def get_daily_candles(self, ticker: str, outputsize: str = "compact") -> Optional[Dict[str, Any]]:
        """Get daily historical candlestick data for charts."""
        formatted_ticker = self._format_ticker(ticker)
        
        def fetch():
            # FIXED: Removed custom session
            stock = yf.Ticker(formatted_ticker)
            period = "3mo" if outputsize == "compact" else "5y"
            hist = stock.history(period=period, interval="1d")
            
            if hist.empty:
                return None
                
            return {
                "s": "ok",
                "t": [int(x.timestamp()) for x in hist.index],
                "o": hist['Open'].tolist(),
                "h": hist['High'].tolist(),
                "l": hist['Low'].tolist(),
                "c": hist['Close'].tolist(),
                "v": hist['Volume'].tolist()
            }
            
        try:
            return await asyncio.to_thread(fetch)
        except Exception as e:
            logger.error(f"Error fetching daily candles for {ticker}: {e}")
            return None

    async def get_intraday_candles(self, ticker: str, interval: str = "5min") -> Optional[Dict[str, Any]]:
        """Get intraday candlestick data."""
        formatted_ticker = self._format_ticker(ticker)
        
        def fetch():
            interval_map = {"1min": "1m", "5min": "5m", "15min": "15m", "30min": "30m", "60min": "60m"}
            yf_interval = interval_map.get(interval, "5m")
            period = "5d" if yf_interval in ["1m", "5m"] else "1mo"
            
            # FIXED: Removed custom session
            stock = yf.Ticker(formatted_ticker)
            hist = stock.history(period=period, interval=yf_interval)
            
            if hist.empty:
                return None
                
            return {
                "s": "ok",
                "t": [int(x.timestamp()) for x in hist.index],
                "o": hist['Open'].tolist(),
                "h": hist['High'].tolist(),
                "l": hist['Low'].tolist(),
                "c": hist['Close'].tolist(),
                "v": hist['Volume'].tolist()
            }
            
        try:
            return await asyncio.to_thread(fetch)
        except Exception as e:
            logger.error(f"Error fetching intraday candles for {ticker}: {e}")
            return None

    async def search_symbol(self, query: str) -> List[Dict[str, Any]]:
        """Search for stock symbols globally."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://query2.finance.yahoo.com/v1/finance/search",
                    params={"q": query, "quotesCount": 10, "newsCount": 0},
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0"},
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()

                results = []
                for item in data.get("quotes", []):
                    if item.get("quoteType") in ["EQUITY", "ETF", "INDEX"]:
                        results.append({
                            "symbol": item.get("symbol", ""),
                            "name": item.get("shortname", item.get("longname", "")),
                            "type": item.get("quoteType", ""),
                            "region": item.get("exchange", "Global"),
                        })
                return results
        except Exception as e:
            logger.error(f"Error searching symbols for {query}: {e}")
            return []

yfinance_service = YFinanceService()