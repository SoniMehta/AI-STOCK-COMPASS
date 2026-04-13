# AI Stock Compass - Quick Reference Card

## 🗄️ Database

**Type**: SQLite
**Location**: `backend/stock_compass.db`
**No installation required** ✅

---

## 🌐 Ports & URLs

| Service        | Port | URL                          |
|----------------|------|------------------------------|
| Frontend       | 5173 | http://localhost:5173        |
| Backend API    | 8000 | http://localhost:8000        |
| API Docs       | 8000 | http://localhost:8000/docs   |
| ReDoc          | 8000 | http://localhost:8000/redoc  |

**No endpoint changes needed** - works same on all platforms ✅

---

## 🚀 Quick Start (Windows)

### Option 1: Native Installation
```powershell
# 1. Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python run.py

# 2. Frontend (new terminal)
npm install
npm run dev
```

### Option 2: Docker (Easiest)
```powershell
docker-compose up -d
```

### Option 3: Batch Scripts
**Start**: Double-click `start.bat`
**Stop**: Double-click `stop.bat`
**Docker**: Double-click `docker-start.bat`

---

## 📋 Prerequisites

### Required
- ✅ **Python 3.11+** - https://www.python.org/downloads/
- ✅ **Node.js 18+** - https://nodejs.org/
- ✅ **API Keys** (3 required):
  - Google Gemini API
  - Polygon.io API
  - News API

### Optional
- Docker Desktop (for containerized deployment)
- Git (for version control)
- VS Code (recommended editor)

---

## 🔑 API Keys Configuration

**File**: `backend/.env`

```env
GEMINI_API_KEY=your-key-here
POLYGON_API_KEY=your-key-here
NEWS_API_KEY=your-key-here
```

### Get API Keys:
1. **Gemini**: https://ai.google.dev/
2. **Polygon.io**: https://polygon.io/
3. **News API**: https://newsapi.org/

---

## 📡 API Endpoints

### Authentication
```http
POST /api/auth/signup      # Register
POST /api/auth/login       # Login (get JWT)
GET  /api/auth/me          # Current user
```

### Stocks
```http
GET  /api/stocks/{ticker}/quote            # Real-time price
GET  /api/stocks/{ticker}/candles          # Historical chart data
GET  /api/stocks/{ticker}/simple-insights  # AI analysis
POST /api/stocks/analyze                   # Full analysis
GET  /api/stocks/search?q={query}          # Search stocks
```

### Watchlist
```http
GET    /api/watchlist           # Get watchlist
POST   /api/watchlist/{ticker}  # Add to watchlist
DELETE /api/watchlist/{ticker}  # Remove from watchlist
```

### History
```http
GET /api/history     # Get analysis history
GET /api/history/{id}  # Get specific analysis
```

### News
```http
GET /api/news/{ticker}  # Get stock news
```

### Beginner Education
```http
POST /api/beginner/chat   # Chat with AI tutor
POST /api/beginner/guide  # Get guidance
GET  /api/beginner/topics # Available topics
```

---

## 🐳 Docker Commands

### Start & Stop
```powershell
docker-compose up -d           # Start in background
docker-compose down            # Stop containers
docker-compose restart         # Restart all
```

### Logs & Debug
```powershell
docker-compose logs -f         # Follow all logs
docker-compose logs backend    # Backend logs only
docker-compose ps              # Container status
```

### Maintenance
```powershell
docker-compose build --no-cache  # Rebuild from scratch
docker-compose down -v           # Stop + delete data
docker system prune -a           # Clean everything
```

---

## 🛠️ Common Commands

### Backend
```powershell
cd backend
.\venv\Scripts\activate      # Activate venv
python run.py                # Start server
pip install -r requirements.txt  # Install deps
```

### Frontend
```powershell
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
```

### Database
```powershell
# Backup
copy backend\stock_compass.db backup.db

# Reset
del backend\stock_compass.db
# Restart backend (auto-creates fresh DB)
```

---

## 🔧 Troubleshooting

### Port In Use
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Python Not Found
```powershell
# Add to PATH:
# Settings → Environment Variables → Path
# Add: C:\Python311 and C:\Python311\Scripts
```

### npm Errors
```powershell
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Docker Issues
```powershell
# Restart Docker Desktop
# Or run as admin:
net stop com.docker.service
net start com.docker.service
```

---

## 📊 Testing

### Backend Health
```powershell
curl http://localhost:8000/
```

### Frontend Health
```powershell
curl http://localhost:5173/
```

### API Test
```powershell
# Login
curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"

# Get stock quote (with token)
curl http://localhost:8000/api/stocks/AAPL/quote ^
  -H "Authorization: Bearer <token>"
```

---

## 📁 Important Files

```
ai-stock-compass-main/
├── backend/
│   ├── .env                   # ⚙️ API keys HERE
│   ├── run.py                 # 🚀 Start backend
│   ├── stock_compass.db       # 💾 Database
│   └── requirements.txt       # 📦 Python deps
│
├── src/                       # ⚛️ React frontend
├── package.json               # 📦 Node deps
├── docker-compose.yml         # 🐳 Docker config
├── start.bat                  # ▶️ Windows start
├── stop.bat                   # ⏹️ Windows stop
├── docker-start.bat           # 🐳 Docker start
├── README.md                  # 📖 Main docs
└── WINDOWS_SETUP_GUIDE.md     # 🪟 Windows guide
```

---

## 🎯 Quick Checks

### ✅ System Ready?
- [ ] Python 3.11+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] API keys in `backend/.env`
- [ ] Ports 8000 & 5173 available

### ✅ Running?
- [ ] Backend: http://localhost:8000 responds
- [ ] Frontend: http://localhost:5173 loads
- [ ] Can login/register
- [ ] Stock search works

---

## 🆘 Get Help

1. **Check Logs**: Console output or Docker logs
2. **Verify .env**: All 3 API keys present
3. **Check Ports**: 8000 & 5173 not in use
4. **Read Guides**:
   - `README.md` - Full documentation
   - `WINDOWS_SETUP_GUIDE.md` - Windows specific
   - `DOCKER_GUIDE.md` - Docker details
   - `PROJECT_STRUCTURE.md` - Architecture

---

## 💡 Pro Tips

- Use **Docker** for easiest setup
- Use **VS Code** for development
- Run `docker-compose logs -f` to monitor
- API docs at `/docs` for testing
- SQLite browser: https://sqlitebrowser.org/

---

**Version**: 1.0.0
**Last Updated**: 2026-01-27
**Platform**: Windows 11, macOS, Linux
**License**: Educational Use
