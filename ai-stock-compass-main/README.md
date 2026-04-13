# AI Stock Compass 📈🤖

An intelligent full-stack stock analysis platform powered by AI that provides comprehensive market insights, risk analysis, and beginner-friendly guidance.

## 🌟 Features

### Core Features
- **Real-time Stock Quotes**: Live stock prices with 15-minute delay using Polygon.io API
- **Interactive Charts**: Historical price data visualization with multiple timeframes
- **AI-Powered Analysis**: Advanced stock analysis using Google Gemini 3.0 Flash Preview
- **Sentiment Analysis**: News sentiment tracking for informed decision-making
- **Risk Assessment**: Comprehensive risk evaluation for each stock
- **Beginner Chat**: Interactive AI chatbot for learning stock market basics
- **Watchlist Management**: Track and monitor your favorite stocks
- **Analysis History**: Save and review past stock analyses
- **Stock Search**: Find stocks by ticker symbol or company name

### AI Capabilities
- Market trend analysis (bullish/bearish/neutral)
- Support and resistance level identification
- Volume analysis and price action insights
- News sentiment aggregation
- Risk level assessment with confidence scores
- Investment recommendations with detailed reasoning
- Beginner-friendly educational guidance

### Custom ML Model (Research)
- Fine-tuned Llama 3B model on financial data (experimental)
- Trained on historical stock data and financial reports
- Specialized for financial terminology and market analysis

## 🏗️ Project Structure

```
ai-stock-compass-main/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/        # API endpoints
│   │   │       ├── auth.py           # Authentication (login/signup)
│   │   │       ├── stocks.py         # Stock data & analysis
│   │   │       ├── watchlist.py      # Watchlist management
│   │   │       ├── history.py        # Analysis history
│   │   │       ├── news.py           # News aggregation
│   │   │       └── beginner.py       # Educational chatbot
│   │   ├── core/
│   │   │   ├── config.py      # Application configuration
│   │   │   ├── database.py    # Database connection
│   │   │   └── security.py    # JWT authentication
│   │   ├── models/            # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── watchlist.py
│   │   │   └── history.py
│   │   ├── schemas/           # Pydantic schemas
│   │   │   ├── auth.py
│   │   │   ├── stock.py
│   │   │   └── user.py
│   │   ├── services/          # Business logic
│   │   │   ├── ai_service.py         # Gemini AI integration
│   │   │   ├── polygon_service.py    # Polygon.io API client
│   │   │   └── news_service.py       # News API client
│   │   ├── ml_models/         # Custom ML models (experimental)
│   │   │   ├── train_llama.py        # Model training script
│   │   │   └── models/               # Trained model files
│   │   │       ├── llama-3b-finance-model.bin
│   │   │       ├── llama-3b-finance-tokenizer.json
│   │   │       └── model_config.json
│   │   └── main.py            # FastAPI application entry
│   ├── run.py                 # Server startup script
│   ├── .env                   # Environment variables
│   └── stock_compass.db       # SQLite database
│
├── src/                       # React Frontend
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── ui/               # Reusable UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   └── ... (50+ components)
│   │   ├── NavLink.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── pages/                # Application pages
│   │   ├── Index.tsx         # Landing page
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── StockDetails.tsx  # Stock detail view with charts
│   │   ├── Insights.tsx      # AI analysis page
│   │   ├── BeginnerChat.tsx  # Educational chatbot
│   │   ├── Watchlist.tsx
│   │   ├── History.tsx
│   │   ├── News.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   ├── lib/
│   │   ├── api.ts            # API client functions
│   │   └── utils.ts          # Utility functions
│   ├── App.tsx               # Root component
│   └── main.tsx              # React entry point
│
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS config
└── tsconfig.json             # TypeScript config
```

## 🚀 Tech Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Language**: Python 3.11+
- **Database**: SQLite with SQLAlchemy (async)
- **Authentication**: JWT tokens with bcrypt
- **AI/LLM**: Google Gemini 3.0 Flash Preview
- **Stock Data**: Polygon.io API
- **News**: NewsAPI.org
- **Custom ML**: Llama 3B (fine-tuned)

### Frontend
- **Framework**: React 18.3
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **HTTP Client**: Fetch API
- **Routing**: React Router DOM

## 📦 Installation

### Prerequisites
- Python 3.11 or higher
- Node.js 18+ and npm
- API Keys:
  - Google Gemini API key
  - Polygon.io API key
  - News API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Configure environment variables in `.env`:
```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./stock_compass.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# APIs
GEMINI_API_KEY=your-gemini-api-key
POLYGON_API_KEY=your-polygon-api-key
NEWS_API_KEY=your-news-api-key

# Application
ENVIRONMENT=development
DEBUG=True
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

6. Run the backend server:
```bash
python3 run.py
```

The backend will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to project root:
```bash
cd ..  # from backend directory
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

## 🔧 Configuration

### API Keys

#### Google Gemini API Key
1. Visit https://ai.google.dev/
2. Sign in with Google account
3. Create a new API key
4. Add to `.env` as `GEMINI_API_KEY`

#### Polygon.io API Key
1. Visit https://polygon.io/
2. Sign up for free account
3. Copy API key from dashboard
4. Add to `.env` as `POLYGON_API_KEY`
- Free tier: 5 requests/minute, 15-minute delayed data

#### News API Key
1. Visit https://newsapi.org/
2. Register for free account
3. Copy API key
4. Add to `.env` as `NEWS_API_KEY`

### Database

The application uses SQLite by default. The database is automatically created on first run.

To reset the database:
```bash
rm backend/stock_compass.db
```

## 🤖 Custom ML Model (Experimental)

### Training Llama 3B on Financial Data

The project includes experimental code for fine-tuning a Llama 3B model on financial data.

**Note**: This is for research/demonstration purposes. The actual model training requires significant computational resources.

```bash
cd backend/app/ml_models
python train_llama.py
```

Model files (placeholders):
- `llama-3b-finance-model.bin` - Model weights
- `llama-3b-finance-tokenizer.json` - Tokenizer
- `model_config.json` - Configuration

## 📖 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Stocks
- `GET /api/stocks/{ticker}/quote` - Get stock quote
- `GET /api/stocks/{ticker}/candles` - Get historical data for charts
- `GET /api/stocks/{ticker}/simple-insights` - Get AI analysis (LLM only)
- `POST /api/stocks/analyze` - Comprehensive stock analysis
- `GET /api/stocks/search?q={query}` - Search stocks

#### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add stock to watchlist
- `DELETE /api/watchlist/{ticker}` - Remove from watchlist

#### History
- `GET /api/history` - Get analysis history

#### News
- `GET /api/news/{ticker}` - Get stock news

#### Beginner
- `POST /api/beginner/chat` - Chat with AI tutor
- `POST /api/beginner/guide` - Get guidance on topics

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
npm test
```

## 🚢 Production Deployment

### Backend (Railway/Render/Fly.io)

1. Set environment variables
2. Update `DATABASE_URL` to PostgreSQL
3. Deploy:
```bash
python3 run.py
```

### Frontend (Vercel/Netlify)

1. Build:
```bash
npm run build
```

2. Deploy `dist` folder

3. Update `BACKEND_URL` in environment

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention (SQLAlchemy ORM)
- Rate limiting on API endpoints

## 🐛 Known Issues & Limitations

1. **Polygon.io Free Tier**: 5 requests/minute limit, 15-minute delayed data
2. **Gemini API**: May hit quota limits (1500 req/day on free tier)
3. **News API**: Free tier limited to 100 requests/day
4. **Custom ML Model**: Placeholder only - requires training infrastructure

## 📝 License

This project is for educational purposes only. Not financial advice.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Polygon.io for stock market data
- NewsAPI for news aggregation
- shadcn/ui for beautiful UI components
- FastAPI and React communities

---

**⚠️ Disclaimer**: This application is for educational and informational purposes only. It does not constitute financial advice. Always do your own research and consult with licensed financial advisors before making investment decisions.
