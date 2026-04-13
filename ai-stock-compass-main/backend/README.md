# AI Stock Compass Backend

A comprehensive backend API for AI-powered stock analysis and investment guidance.

## Features

- **Authentication**: JWT-based user authentication and authorization
- **Stock Analysis**: Multi-agent AI analysis using Google Gemini
  - Market data analysis (technical indicators, trends)
  - News sentiment analysis
  - Risk assessment
  - Investment recommendations with detailed reasoning
- **Real-time Data**: Stock quotes and historical data via Alpha Vantage API
- **News Integration**: Latest stock news via News API
- **Beginner Guide**: AI-powered guidance for stock market beginners
- **Watchlist**: Personal stock watchlist management
- **History**: Track your analysis history

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: Async ORM with SQLite
- **Google Gemini**: AI for detailed stock analysis
- **Alpha Vantage API**: Real-time stock data
- **News API**: Latest financial news
- **JWT**: Secure authentication

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your API keys:

```bash
cp .env.example .env
```

Required API keys:
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **ALPHA_VANTAGE_API_KEY**: Get from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
- **NEWS_API_KEY**: Get from [News API](https://newsapi.org/)

### 3. Run the Server

```bash
# Development mode with auto-reload
python run.py

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Stock Analysis
- `GET /api/stocks/{ticker}/quote` - Get real-time quote
- `GET /api/stocks/{ticker}/candles` - Get historical data for charts
- `POST /api/stocks/analyze` - AI-powered stock analysis
- `GET /api/stocks/search` - Search stock symbols

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist/{ticker}` - Add to watchlist
- `DELETE /api/watchlist/{ticker}` - Remove from watchlist

### History
- `GET /api/history` - Get analysis history
- `GET /api/history/{id}` - Get detailed history item

### News
- `GET /api/news/stock/{ticker}` - Get stock-specific news
- `GET /api/news/market` - Get general market news

### Beginner Guide
- `POST /api/beginner/guide` - Ask AI for beginner guidance
- `GET /api/beginner/topics` - Get common beginner topics

## Database

The application uses SQLite by default. The database file (`stock_compass.db`) will be created automatically when you start the server.

### Database Models

- **User**: User accounts with authentication
- **Watchlist**: User's tracked stocks
- **History**: Analysis history for each user

## Development

### Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/          # API route handlers
│   │       ├── auth.py
│   │       ├── stocks.py
│   │       ├── watchlist.py
│   │       ├── history.py
│   │       ├── news.py
│   │       └── beginner.py
│   ├── core/                # Core functionality
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   └── security.py      # Auth utilities
│   ├── models/              # Database models
│   │   ├── user.py
│   │   ├── watchlist.py
│   │   └── history.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── auth.py
│   │   ├── user.py
│   │   └── stock.py
│   ├── services/            # External services
│   │   ├── ai_service.py    # Gemini AI
│   │   ├── alpha_vantage_service.py
│   │   └── news_service.py
│   └── main.py              # FastAPI app
├── .env                     # Environment variables
├── requirements.txt         # Dependencies
└── run.py                   # Run script
```

## AI Analysis Features

### Market Analysis
- Technical trend analysis (bullish/bearish/neutral)
- Support and resistance levels
- Volume patterns
- Price action insights

### Sentiment Analysis
- News article analysis
- Overall market sentiment
- Key headlines impact
- Market narrative themes

### Risk Assessment
- Risk level classification
- Volatility analysis
- Risk factors identification
- Risk mitigation strategies

### Investment Decision
- BUY/SELL/HOLD recommendation
- Comprehensive reasoning
- Confidence scoring
- Short and long-term perspectives

### Beginner Guide
- Simple, jargon-free explanations
- Real-world analogies
- Related topics suggestions
- Interactive learning path

## Notes

- All API endpoints (except auth) require JWT authentication
- Include token in Authorization header: `Bearer <token>`
- Stock tickers are automatically converted to uppercase
- Analysis results are saved to user's history
- The AI provides detailed explanations, not just yes/no answers

## License

MIT
