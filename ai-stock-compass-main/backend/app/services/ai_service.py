"""AI service using Google Gemini for stock analysis and beginner guidance."""
import google.generativeai as genai
from typing import Dict, Any, List, Optional
import json
import re
import logging

from ..core.config import settings

logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


class AIService:
    """Service for AI-powered stock analysis using Google Gemini."""

    def __init__(self):
        # Using gemini-3-flash-preview - Gemini 3.0 model as requested
        # Falls back to stable models if 3.0 is unavailable
        try:
            self.model = genai.GenerativeModel('gemini-3.1-flash-lite-preview')
            logger.info("AI Service initialized with gemini-3-flash-preview")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini 3.0: {e}")
            try:
                self.model = genai.GenerativeModel('gemini-3.1-pro-preview')
                logger.info("AI Service initialized with gemini-1.5-flash (fallback)")
            except Exception as e2:
                logger.error(f"Failed to initialize Gemini 1.5: {e2}")
                self.model = genai.GenerativeModel('gemini-3-flash-preview')
                logger.info("AI Service initialized with gemini-pro (final fallback)")

    def _clean_response(self, text: str) -> str:
        """Removes stars, hashtags, and enforces strict 250-word limit."""
        if not text:
            return ""
        # Remove asterisks and hashtags completely
        cleaned_text = re.sub(r'[*#]', '', text)
        
        # Enforce 250 word limit
        words = cleaned_text.split()
        if len(words) > 250:
            cleaned_text = ' '.join(words[:250]) + "..."
            
        return cleaned_text.strip()

    async def analyze_market_data(
        self,
        ticker: str,
        price_data: Dict[str, Any],
        financials: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Market data from the perspective of a Technical Trader."""
        try:
            prompt = f"""
Act as a Technical Day Trader and Chart Analyst. Analyze {ticker}:
Price: ₹{price_data.get('current_price', 'N/A')} | Change: {price_data.get('change_percent', 'N/A')}%
Volume: {price_data.get('volume', 'N/A')}

Focus STRICTLY on price action, volume patterns, and momentum. Do not give a general company overview.

Format exactly like this (Use ALL CAPS headers, no bolding/stars):
TREND: [Bullish/Bearish/Neutral]
SUPPORT: ₹[Price]
RESISTANCE: ₹[Price]
CONFIDENCE: [0.0 to 1.0]

MARKET DYNAMICS:
[1-2 sentences on recent price action and trend strength]

VOLUME & MOMENTUM:
[1-2 sentences on trading volume indicators and momentum shifts]

CRITICAL LEVELS:
[1-2 sentences on why the current support/resistance zones are crucial]

RULES: Strict maximum of 250 words. NO stars. NO hashtags. Use ₹ for currency.
"""
            response = self.model.generate_content(prompt)
            clean_text = self._clean_response(response.text)

            return {
                "trend": self._extract_trend(clean_text),
                "support": self._extract_support(clean_text),
                "resistance": self._extract_resistance(clean_text),
                "confidence": self._extract_confidence(clean_text),
                "summary": clean_text
            }

        except Exception as e:
            logger.error(f"Error in market analysis for {ticker}: {e}")
            return {"trend": "neutral", "support": None, "resistance": None, "confidence": 0.0, "summary": "Analysis unavailable."}

    async def analyze_sentiment(
        self,
        ticker: str,
        news_articles: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """News sentiment from the perspective of a Media Analyst."""
        try:
            if not news_articles:
                return {"overall": "neutral", "articles_analyzed": 0, "confidence": 0.3, "headlines": [], "summary": "No news available."}

            news_summary = "\n".join([f"- {article['title']}" for article in news_articles[:10]])

            prompt = f"""
Act as a Financial Media Analyst. Analyze public sentiment for {ticker} based on these headlines:
{news_summary}

Focus STRICTLY on the media narrative, public perception, and catalysts. Do not give a general company overview.

Format exactly like this (Use ALL CAPS headers, no bolding/stars):
OVERALL SENTIMENT: [Positive/Negative/Neutral]
CONFIDENCE: [0.0 to 1.0]

NARRATIVE SHIFT:
[1-2 sentences summarizing the current story surrounding the stock]

MEDIA TONE:
[1-2 sentences on how aggressively optimistic or pessimistic the press is]

UPCOMING CATALYSTS:
[1-2 sentences on what news events might move the stock next based on these headlines]

RULES: Strict maximum of 250 words. NO stars. NO hashtags. Use ₹ for currency.
"""
            response = self.model.generate_content(prompt)
            clean_text = self._clean_response(response.text)
            headlines = [article['title'] for article in news_articles[:5]]

            return {
                "overall": self._extract_sentiment(clean_text),
                "articles_analyzed": len(news_articles),
                "confidence": self._extract_confidence(clean_text),
                "headlines": headlines,
                "summary": clean_text
            }

        except Exception as e:
            logger.error(f"Error in sentiment analysis for {ticker}: {e}")
            return {"overall": "neutral", "articles_analyzed": 0, "confidence": 0.0, "headlines": [], "summary": "Sentiment error."}

    async def analyze_risk(
        self,
        ticker: str,
        price_data: Dict[str, Any],
        financials: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Risk assessment from the perspective of a Chief Risk Officer."""
        try:
            prompt = f"""
Act as a strict Chief Risk Officer. Evaluate downside threats for {ticker}:
Price: ₹{price_data.get('current_price', 'N/A')}
Beta: {financials.get('beta', 'N/A') if financials else 'N/A'}

Focus STRICTLY on downside exposure, volatility, and macro threats. Do not give a general company overview.

Format exactly like this (Use ALL CAPS headers, no bolding/stars):
RISK LEVEL: [Low/Medium/High]
CONFIDENCE: [0.0 to 1.0]

DOWNSIDE EXPOSURE:
[1-2 sentences on the worst-case fundamental scenario for the stock]

MACRO VULNERABILITIES:
[1-2 sentences on economic, regulatory, or sector-wide headwinds]

VOLATILITY PROFILE:
[1-2 sentences interpreting the Beta and expected price swings]

KEY RISK FACTORS:
- [Specific threat 1]
- [Specific threat 2]
- [Specific threat 3]

RULES: Strict maximum of 250 words. NO stars. NO hashtags. Use ₹.
"""
            response = self.model.generate_content(prompt)
            clean_text = self._clean_response(response.text)
            volatility = f"{financials.get('beta', 'N/A')}" if financials else "N/A"

            return {
                "level": self._extract_risk_level(clean_text),
                "volatility": volatility,
                "confidence": self._extract_confidence(clean_text),
                "factors": self._extract_risk_factors(clean_text),
                "summary": clean_text
            }

        except Exception as e:
            logger.error(f"Error in risk analysis for {ticker}: {e}")
            return {"level": "medium", "volatility": "N/A", "confidence": 0.0, "factors": [], "summary": "Risk analysis error."}

    async def generate_decision(
        self,
        ticker: str,
        market_analysis: Dict[str, Any],
        sentiment_analysis: Dict[str, Any],
        risk_analysis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Investment decision from the perspective of a Portfolio Manager."""
        try:
            prompt = f"""
Act as a Lead Portfolio Manager. Synthesize this data to make an executive decision for {ticker}.
Trend: {market_analysis.get('trend', 'N/A')} | Sentiment: {sentiment_analysis.get('overall', 'N/A')} | Risk: {risk_analysis.get('level', 'N/A')}

Focus STRICTLY on strategic execution and risk-to-reward ratio. Do not give a general company overview.

Format exactly like this (Use ALL CAPS headers, no bolding/stars):
RECOMMENDATION: [BUY/HOLD/SELL]
CONFIDENCE: [0.0 to 1.0]

STRATEGIC THESIS:
[1-2 sentences merging technicals, sentiment, and risk into a core investment argument]

RISK-REWARD RATIO:
[1-2 sentences analyzing if the potential upside justifies the downside exposure]

ACTIONABLE PLAN:
[1-2 sentences on exactly how an investor should execute this trade (e.g., entry points, holding periods)]

RULES: Strict maximum of 250 words. NO stars. NO hashtags. Use ₹.
"""
            response = self.model.generate_content(prompt)
            clean_text = self._clean_response(response.text)

            # Extract just the strategic thesis for the short summary
            thesis_match = re.search(r'STRATEGIC THESIS:\s*(.*?)(?:\n\n|\Z)', clean_text, re.DOTALL)
            summary = thesis_match.group(1).strip() if thesis_match else clean_text[:200]

            return {
                "recommendation": self._extract_recommendation(clean_text),
                "summary": summary,
                "confidence": self._extract_confidence(clean_text),
                "reasoning": clean_text
            }

        except Exception as e:
            logger.error(f"Error generating decision for {ticker}: {e}")
            return {"recommendation": "HOLD", "summary": "Decision error.", "confidence": 0.0, "reasoning": "Error generating."}

    async def simple_stock_insights(self, ticker: str) -> Dict[str, Any]:
        """Simple insights from the perspective of a Casual Retail Advisor."""
        try:
            prompt = f"""
Act as a friendly Retail Stock Advisor. Provide a quick, easy-to-digest snapshot for {ticker}.

Format exactly like this (Use ALL CAPS headers, no bolding/stars):
WHAT THEY DO:
[1 sentence explaining the core business simply]

WHY IT MATTERS NOW:
[1-2 sentences on recent trends making this stock relevant today]

THE BULL CASE (PROS):
- [Reason 1 to buy]
- [Reason 2 to buy]

THE BEAR CASE (CONS):
- [Reason 1 to avoid]
- [Reason 2 to avoid]

BOTTOM LINE:
[1 sentence final verdict]

RULES: Strict maximum of 250 words. NO stars. NO hashtags. Use ₹.
"""
            response = self.model.generate_content(prompt)
            clean_text = self._clean_response(response.text)

            return {
                "ticker": ticker,
                "analysis": clean_text,
                "generated_at": "AI-generated insights"
            }

        except Exception as e:
            logger.error(f"Error generating simple insights for {ticker}: {e}")
            return {"ticker": ticker, "analysis": "Insights unavailable.", "generated_at": "Error"}

    async def beginner_guide(
        self,
        question: str,
        ticker: Optional[str] = None
    ) -> Dict[str, Any]:
        """Beginner guide from the perspective of a Patient Mentor."""
        try:
            context = f" regarding {ticker}" if ticker else ""
            prompt = f"""
Act as a Patient Financial Mentor. Answer this question for a complete beginner: {question}{context}.

Provide an encouraging explanation. You MUST use a relatable, everyday real-world analogy to make the concept easy to understand. Keep it highly conversational.

At the very end of your response, include this exact section:
RELATED TOPICS TO LEARN NEXT:
- [Topic 1]
- [Topic 2]
- [Topic 3]

RULES: Strict maximum of 250 words. NO stars. NO hashtags. Use ₹ for currency.
"""
            response = self.model.generate_content(prompt)
            clean_text = self._clean_response(response.text)

            return {
                "answer": clean_text,
                "related_topics": self._extract_related_topics(clean_text)
            }

        except Exception as e:
            logger.error(f"Error in beginner guide: {e}")
            return {"answer": "Unable to process request.", "related_topics": ["Stock Basics", "Risk"]}

    # --- Regex Extraction Helpers ---

    def _extract_trend(self, text: str) -> str:
        text_lower = text.lower()
        if "bullish" in text_lower: return "bullish"
        if "bearish" in text_lower: return "bearish"
        return "neutral"

    def _extract_sentiment(self, text: str) -> str:
        text_lower = text.lower()
        if any(w in text_lower for w in ["positive", "bullish", "optimistic"]): return "positive"
        if any(w in text_lower for w in ["negative", "bearish", "pessimistic"]): return "negative"
        return "neutral"

    def _extract_risk_level(self, text: str) -> str:
        text_lower = text.lower()
        if "high" in text_lower: return "high"
        if "low" in text_lower: return "low"
        return "medium"

    def _extract_recommendation(self, text: str) -> str:
        text_lower = text.lower()
        if "buy" in text_lower and "not buy" not in text_lower: return "BUY"
        if "sell" in text_lower and "not sell" not in text_lower: return "SELL"
        return "HOLD"

    def _extract_confidence(self, text: str) -> float:
        patterns = [
            r'confidence[:\s]+([0-9]\.[0-9]+)',
            r'([0-9]\.[0-9]+)\s+confidence',
            r'confidence[:\s]+([0-9]+)%',
        ]
        for pattern in patterns:
            match = re.search(pattern, text.lower())
            if match:
                try:
                    val = float(match.group(1))
                    if val > 1: val = val / 100
                    return round(val, 2)
                except ValueError:
                    pass
        return 0.75

    def _extract_support(self, text: str) -> Optional[str]:
        match = re.search(r'support[:\s]+₹?([0-9,.]+)', text.lower())
        return f"₹{match.group(1)}" if match else None

    def _extract_resistance(self, text: str) -> Optional[str]:
        match = re.search(r'resistance[:\s]+₹?([0-9,.]+)', text.lower())
        return f"₹{match.group(1)}" if match else None

    def _extract_risk_factors(self, text: str) -> List[str]:
        factors = []
        lines = text.split('\n')
        in_factors = False
        for line in lines:
            clean_line = line.strip()
            if "key risk factors" in clean_line.lower():
                in_factors = True
                continue
            if in_factors and clean_line.startswith('-'):
                factors.append(clean_line.lstrip('- ').strip())
                if len(factors) >= 3:
                    break
        return factors if factors else ["Market volatility", "Economic conditions", "Company-specific risks"]

    def _extract_related_topics(self, text: str) -> List[str]:
        topics = []
        lines = text.split('\n')
        in_topics = False
        for line in lines:
            if "related topics" in line.lower() or "learn next" in line.lower():
                in_topics = True
                continue
            if in_topics and line.strip().startswith('-'):
                topics.append(line.strip().lstrip('- ').strip())
                if len(topics) >= 3:
                    break
        return topics if topics else ["Understanding Stock Basics", "Reading Financial Statements", "Risk Management"]

ai_service = AIService()