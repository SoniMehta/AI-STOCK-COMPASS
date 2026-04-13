# AI Stock Compass - Project Structure

Complete documentation of the project architecture and file organization.

## 📁 Root Directory

```
ai-stock-compass-main/
├── backend/              # FastAPI Backend Application
├── src/                  # React Frontend Application
├── public/               # Static assets
├── dist/                 # Production build output
├── README.md             # Project documentation
├── PROJECT_STRUCTURE.md  # This file
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite build configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Backend Structure (`/backend`)

### Main Application
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   │
│   ├── api/                    # API Routes
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── stocks.py       # Stock data & analysis
│   │       ├── watchlist.py    # Watchlist management
│   │       ├── history.py      # Analysis history
│   │       ├── news.py         # News aggregation
│   │       └── beginner.py     # Educational chatbot
│   │
│   ├── core/                   # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py           # Configuration & env vars
│   │   ├── database.py         # Database connection
│   │   └── security.py         # JWT & authentication
│   │
│   ├── models/                 # Database models (SQLAlchemy)
│   │   ├── __init__.py
│   │   ├── user.py             # User model
│   │   ├── watchlist.py        # Watchlist model
│   │   └── history.py          # Analysis history model
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── auth.py             # Auth request/response
│   │   ├── stock.py            # Stock data schemas
│   │   └── user.py             # User schemas
│   │
│   ├── services/               # Business logic services
│   │   ├── __init__.py
│   │   ├── ai_service.py       # Google Gemini integration
│   │   ├── polygon_service.py  # Polygon.io API client
│   │   └── news_service.py     # News API client
│   │
│   └── ml_models/              # Custom ML models (experimental)
│       ├── __init__.py
│       ├── README.md           # ML models documentation
│       ├── train_llama.py      # Training script
│       └── models/
│           ├── llama-3b-finance-model.bin
│           ├── llama-3b-finance-tokenizer.json
│           └── model_config.json
│
├── run.py                      # Server startup script
├── .env                        # Environment variables
└── stock_compass.db            # SQLite database
```

### API Routes Details

#### Authentication (`/api/auth/`)
- `POST /signup` - User registration
- `POST /login` - User login (returns JWT token)
- `GET /me` - Get current user info

#### Stocks (`/api/stocks/`)
- `GET /{ticker}/quote` - Real-time stock quote
- `GET /{ticker}/candles` - Historical price data for charts
- `GET /{ticker}/simple-insights` - AI analysis (LLM only)
- `POST /analyze` - Comprehensive stock analysis
- `GET /search` - Search stocks by ticker/name

#### Watchlist (`/api/watchlist/`)
- `GET /` - Get user's watchlist
- `POST /{ticker}` - Add stock to watchlist
- `DELETE /{ticker}` - Remove from watchlist

#### History (`/api/history/`)
- `GET /` - Get analysis history
- `GET /{id}` - Get specific analysis

#### News (`/api/news/`)
- `GET /{ticker}` - Get stock news

#### Beginner (`/api/beginner/`)
- `POST /chat` - Chat with AI tutor
- `POST /guide` - Get guidance on topics
- `GET /topics` - Get available topics

## ⚛️ Frontend Structure (`/src`)

### Core Files
```
src/
├── main.tsx                    # React entry point
├── App.tsx                     # Root component & routing
├── vite-env.d.ts              # Vite types
│
├── components/                 # React components
│   ├── layout/
│   │   ├── AppLayout.tsx       # Main layout wrapper
│   │   └── Navbar.tsx          # Navigation bar
│   │
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   └── ... (50+ components)
│   │
│   ├── NavLink.tsx
│   └── ProtectedRoute.tsx
│
├── contexts/
│   └── AuthContext.tsx         # Authentication state
│
├── pages/                      # Application pages
│   ├── Index.tsx               # Landing page
│   ├── Login.tsx               # Login page
│   ├── Signup.tsx              # Registration page
│   ├── Dashboard.tsx           # Main dashboard
│   ├── StockDetails.tsx        # Stock detail + charts
│   ├── Insights.tsx            # AI analysis page
│   ├── BeginnerChat.tsx        # Educational chatbot
│   ├── Watchlist.tsx           # Watchlist view
│   ├── History.tsx             # Analysis history
│   ├── News.tsx                # News feed
│   ├── Profile.tsx             # User profile
│   └── NotFound.tsx            # 404 page
│
├── lib/
│   ├── api.ts                  # API client functions
│   └── utils.ts                # Utility functions
│
└── hooks/
    ├── use-mobile.tsx
    └── use-toast.ts
```

### Page Components

#### Index.tsx (Landing Page)
- Hero section
- Feature highlights
- Call-to-action buttons
- Public route

#### Dashboard.tsx
- Stock search
- Watchlist preview
- Recent analysis
- Market overview
- Protected route

#### StockDetails.tsx
- Real-time price display
- Interactive price charts
- Company information
- Add to watchlist
- Protected route

#### Insights.tsx
- Stock ticker input
- AI analysis display
- Risk assessment
- Sentiment analysis
- Investment recommendations
- Protected route

#### BeginnerChat.tsx
- Interactive chatbot interface
- Financial education
- Topic suggestions
- Chat history
- Protected route

#### Watchlist.tsx
- User's watched stocks
- Real-time price updates
- Quick actions
- Protected route

#### History.tsx
- Past analyses
- Search & filter
- Detail view
- Protected route

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Watchlist Table
```sql
CREATE TABLE watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ticker TEXT NOT NULL,
    company_name TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, ticker)
);
```

### History Table
```sql
CREATE TABLE history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ticker TEXT NOT NULL,
    analysis_type TEXT NOT NULL,
    recommendation TEXT,
    confidence REAL,
    market_trend TEXT,
    sentiment TEXT,
    risk_level TEXT,
    summary TEXT,
    full_analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔌 External APIs & Services

### 1. Google Gemini API
**Purpose**: AI-powered stock analysis and chatbot

**Model**: `gemini-3-flash-preview` (Gemini 3.0)

**Endpoints Used**:
- Text generation for analysis
- Chat completions for beginner guide

**Rate Limits**:
- Free tier: 15 requests/minute
- Daily limit: 1,500 requests/day

**Configuration**: `GEMINI_API_KEY` in `.env`

### 2. Polygon.io API
**Purpose**: Stock market data (quotes, historical prices, company info)

**Endpoints Used**:
- `/v2/aggs/ticker/{ticker}/prev` - Previous close
- `/v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}` - Historical data
- `/v2/snapshot/locale/us/markets/stocks/tickers/{ticker}` - Real-time snapshot
- `/v3/reference/tickers/{ticker}` - Company details
- `/v3/reference/tickers?search={query}` - Symbol search

**Rate Limits**:
- Free tier: 5 requests/minute
- Data delay: 15 minutes

**Configuration**: `POLYGON_API_KEY` in `.env`

### 3. News API
**Purpose**: Financial news articles

**Endpoints Used**:
- `/everything` - Search news articles

**Rate Limits**:
- Free tier: 100 requests/day

**Configuration**: `NEWS_API_KEY` in `.env`

## 🔐 Authentication Flow

1. **User Registration** (`POST /api/auth/signup`)
   - User provides email, username, password
   - Password is hashed with bcrypt
   - User record created in database

2. **User Login** (`POST /api/auth/login`)
   - User provides email and password
   - Server verifies credentials
   - Returns JWT access token (expires in 24 hours)

3. **Protected Routes**
   - Client includes token in `Authorization: Bearer {token}` header
   - Server validates JWT token
   - Extracts user info from token
   - Grants/denies access

## 🚀 Application Flow

### Stock Analysis Flow
```
User Input (AAPL)
    ↓
Frontend: Insights.tsx
    ↓
API Call: GET /api/stocks/AAPL/simple-insights
    ↓
Backend: stocks.py route
    ↓
Service: ai_service.py
    ↓
External: Google Gemini API
    ↓
Response: AI Analysis
    ↓
Display: Formatted analysis on frontend
```

### Stock Price Chart Flow
```
User Views Stock Details
    ↓
Frontend: StockDetails.tsx
    ↓
API Call: GET /api/stocks/AAPL/candles?resolution=D&from=X&to=Y
    ↓
Backend: stocks.py route
    ↓
Service: polygon_service.py
    ↓
External: Polygon.io API
    ↓
Response: Historical price data
    ↓
Display: Interactive chart (Recharts)
```

## 📦 Dependencies

### Backend (`requirements.txt`)
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy[asyncio]==2.0.23
aiosqlite==0.19.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
httpx==0.25.2
google-generativeai==0.3.1
python-dotenv==1.0.0
```

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "recharts": "^2.12.7",
    "date-fns": "^3.3.1",
    "lucide-react": "^0.344.0",
    "@radix-ui/react-*": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^6.0.11",
    "tailwindcss": "^3.4.1"
  }
}
```

## 🌐 Environment Variables

### Backend (`.env`)
```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./stock_compass.db

# Security
SECRET_KEY=<random-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# APIs
GEMINI_API_KEY=<your-gemini-api-key>
POLYGON_API_KEY=<your-polygon-api-key>
NEWS_API_KEY=<your-news-api-key>

# Application
ENVIRONMENT=development
DEBUG=True
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

## 🧪 Testing Structure

### Backend Tests
```
tests/
├── test_auth.py
├── test_stocks.py
├── test_watchlist.py
└── test_ai_service.py
```

### Frontend Tests
```
src/test/
├── setup.ts
└── example.test.ts
```

## 📊 Data Flow Diagram

```
┌──────────────┐
│   Frontend   │
│  (React)     │
└──────┬───────┘
       │
       │ HTTP/REST
       │
┌──────▼───────┐
│   Backend    │
│  (FastAPI)   │
└──────┬───────┘
       │
       ├────────────────┬────────────────┬─────────────────┐
       │                │                │                 │
┌──────▼───────┐ ┌─────▼──────┐ ┌──────▼────────┐ ┌─────▼────────┐
│   Database   │ │  Gemini AI │ │  Polygon.io   │ │   News API   │
│   (SQLite)   │ │            │ │               │ │              │
└──────────────┘ └────────────┘ └───────────────┘ └──────────────┘
```

## 🔄 Development Workflow

### Starting Development Servers

**Backend**:
```bash
cd backend
python3 run.py
# Running on http://localhost:8000
```

**Frontend**:
```bash
npm run dev
# Running on http://localhost:5173
```

### Making Changes

1. **Backend Changes**: Files auto-reload (uvicorn watch mode)
2. **Frontend Changes**: Hot module replacement (Vite HMR)
3. **Database Changes**: Create migration scripts
4. **API Changes**: Update OpenAPI docs automatically

## 📝 Code Style & Standards

### Backend (Python)
- PEP 8 style guide
- Type hints for all functions
- Docstrings for classes and public methods
- Async/await for I/O operations

### Frontend (TypeScript/React)
- Functional components with hooks
- TypeScript strict mode
- Component props with interfaces
- CSS modules or Tailwind classes

## 🚢 Deployment Architecture

```
Production Environment:
┌─────────────────────────────────────┐
│         Load Balancer / CDN         │
└───────────┬─────────────────────────┘
            │
    ┌───────┴────────┐
    │                │
┌───▼───┐      ┌────▼────┐
│Frontend│      │ Backend │
│(Vercel)│      │(Railway)│
└────────┘      └────┬────┘
                     │
            ┌────────┴────────┐
            │                 │
      ┌─────▼────┐     ┌─────▼─────┐
      │PostgreSQL│     │   Redis   │
      │          │     │  (Cache)  │
      └──────────┘     └───────────┘
```

---

**Last Updated**: 2026-01-27
**Version**: 1.0.0
**Maintainers**: AI Stock Compass Team
