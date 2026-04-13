# AI Stock Compass - Windows 11 Setup Guide

Complete guide to run AI Stock Compass on Windows 11 systems.

## 🗄️ Database Information

**Database Used**: **SQLite**

- **File-based database** (no separate server needed)
- **Location**: `backend/stock_compass.db`
- **Automatically created** on first run
- **Zero configuration** required
- **Perfect for development** and small-scale production

### Why SQLite?
- ✅ No installation needed
- ✅ No separate database server
- ✅ Portable (single file)
- ✅ Fast for read-heavy workloads
- ✅ Built into Python
- ✅ Works identically on Windows, Mac, and Linux

---

## 📋 Prerequisites for Windows 11

### Required Software

#### 1. Python 3.11 or Higher
**Download**: https://www.python.org/downloads/

**Installation Steps**:
```powershell
# Download Python 3.11+ installer
# Run installer
# ✅ CHECK: "Add Python to PATH"
# ✅ CHECK: "Install pip"
```

**Verify Installation**:
```powershell
python --version
# Should show: Python 3.11.x or higher

pip --version
# Should show: pip 24.x or higher
```

#### 2. Node.js 18+ and npm
**Download**: https://nodejs.org/

**Installation Steps**:
```powershell
# Download Node.js LTS installer
# Run installer (includes npm automatically)
```

**Verify Installation**:
```powershell
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

#### 3. Git (Optional but Recommended)
**Download**: https://git-scm.com/download/win

**Verify Installation**:
```powershell
git --version
# Should show: git version 2.x.x
```

#### 4. Visual Studio Code (Recommended)
**Download**: https://code.visualstudio.com/

---

## 🚀 Installation Guide for Windows 11

### Step 1: Download/Clone Project

**Option A: Using Git**
```powershell
git clone https://github.com/your-repo/ai-stock-compass-main.git
cd ai-stock-compass-main
```

**Option B: Download ZIP**
1. Download project ZIP file
2. Extract to `C:\Projects\ai-stock-compass-main`
3. Open PowerShell/CMD in that directory

### Step 2: Backend Setup

#### 2.1 Open PowerShell in Project Directory
```powershell
# Navigate to project
cd C:\Projects\ai-stock-compass-main
```

#### 2.2 Create Virtual Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# You should see (venv) in your prompt
```

#### 2.3 Install Backend Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

**If requirements.txt doesn't exist, install manually**:
```powershell
pip install fastapi==0.104.1 uvicorn[standard]==0.24.0 sqlalchemy==2.0.23 aiosqlite==0.19.0 pydantic==2.5.0 pydantic-settings==2.1.0 python-jose[cryptography]==3.3.0 passlib[bcrypt]==1.7.4 python-multipart==0.0.6 httpx==0.25.2 google-generativeai==0.3.1 python-dotenv==1.0.0
```

#### 2.4 Configure Environment Variables
```powershell
# Create .env file in backend directory
# Copy from .env.example or create new

notepad .env
```

**Add the following to `.env`**:
```env
# Database Configuration
DATABASE_URL=sqlite+aiosqlite:///./stock_compass.db

# Security
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Polygon.io API (Stock Market Data)
POLYGON_API_KEY=your-polygon-api-key-here

# News API
NEWS_API_KEY=your-news-api-key-here

# Application
ENVIRONMENT=development
DEBUG=True
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080,http://localhost:8081
```

#### 2.5 Run Backend Server
```powershell
# Make sure you're in backend directory
cd backend

# Run the server
python run.py
```

**Expected Output**:
```
INFO:     Will watch for changes in these directories: ['C:\\Projects\\ai-stock-compass-main\\backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Backend is now running on**: `http://localhost:8000`

### Step 3: Frontend Setup

#### 3.1 Open New PowerShell Window
```powershell
# Navigate to project root
cd C:\Projects\ai-stock-compass-main
```

#### 3.2 Install Frontend Dependencies
```powershell
npm install
```

**If you encounter errors**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

#### 3.3 Run Frontend Development Server
```powershell
npm run dev
```

**Expected Output**:
```
VITE v6.0.11  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Frontend is now running on**: `http://localhost:5173`

---

## 🌐 Port Configuration

### Default Ports (Same on Windows and Mac/Linux)

| Service  | Port | URL                          |
|----------|------|------------------------------|
| Backend  | 8000 | http://localhost:8000        |
| Frontend | 5173 | http://localhost:5173        |

### No Endpoint Changes Needed! ✅

All API endpoints work identically on Windows:
- `http://localhost:8000/api/auth/signup`
- `http://localhost:8000/api/auth/login`
- `http://localhost:8000/api/stocks/{ticker}/quote`
- `http://localhost:8000/api/stocks/{ticker}/candles`
- `http://localhost:8000/api/stocks/{ticker}/simple-insights`
- `http://localhost:8000/docs` (API documentation)

### If Ports are Already in Use

**Check what's using a port**:
```powershell
netstat -ano | findstr :8000
netstat -ano | findstr :5173
```

**Kill a process using a port**:
```powershell
# Get PID from netstat output (last column)
taskkill /PID <process_id> /F
```

**Change ports (if needed)**:

**Backend** - Edit `backend/run.py`:
```python
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,  # Change this
        reload=True
    )
```

**Frontend** - Edit `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 5174,  // Change this
  }
})
```

---

## 🐳 Docker Setup for Windows

### Prerequisites

#### Install Docker Desktop for Windows
**Download**: https://www.docker.com/products/docker-desktop/

**System Requirements**:
- Windows 11 64-bit: Home or Pro 21H2 or higher
- WSL 2 backend enabled
- 4GB RAM minimum (8GB recommended)
- Virtualization enabled in BIOS

**Installation Steps**:
1. Download Docker Desktop installer
2. Run installer
3. Restart computer
4. Launch Docker Desktop
5. Accept terms and complete setup
6. Enable WSL 2 backend (recommended)

**Verify Installation**:
```powershell
docker --version
# Should show: Docker version 24.x.x

docker-compose --version
# Should show: Docker Compose version v2.x.x
```

### Docker Files Created

The project now includes:
1. `Dockerfile.backend` - Backend container
2. `Dockerfile.frontend` - Frontend container
3. `docker-compose.yml` - Orchestrates both services
4. `.dockerignore` - Excludes unnecessary files

### Running with Docker

#### Option 1: Using Docker Compose (Recommended)

**Start all services**:
```powershell
# From project root
docker-compose up
```

**Start in background (detached mode)**:
```powershell
docker-compose up -d
```

**View logs**:
```powershell
docker-compose logs -f
```

**Stop all services**:
```powershell
docker-compose down
```

**Rebuild containers**:
```powershell
docker-compose up --build
```

#### Option 2: Using Docker Commands

**Build images**:
```powershell
# Build backend
docker build -f Dockerfile.backend -t ai-stock-compass-backend .

# Build frontend
docker build -f Dockerfile.frontend -t ai-stock-compass-frontend .
```

**Run containers**:
```powershell
# Run backend
docker run -d -p 8000:8000 --name backend ai-stock-compass-backend

# Run frontend
docker run -d -p 5173:5173 --name frontend ai-stock-compass-frontend
```

### Access Application

After starting Docker containers:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📝 Windows-Specific Scripts

### Start All Services (start.bat)
```batch
@echo off
echo Starting AI Stock Compass...

echo.
echo Starting Backend...
start cmd /k "cd backend && ..\venv\Scripts\activate && python run.py"

timeout /t 5 /nobreak

echo.
echo Starting Frontend...
start cmd /k "npm run dev"

echo.
echo ✅ All services started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
pause
```

### Stop All Services (stop.bat)
```batch
@echo off
echo Stopping AI Stock Compass...

taskkill /F /FI "WINDOWTITLE eq *uvicorn*" /T
taskkill /F /FI "WINDOWTITLE eq *vite*" /T

echo ✅ All services stopped!
pause
```

### Docker Start (docker-start.bat)
```batch
@echo off
echo Starting with Docker...

docker-compose up -d

echo.
echo ✅ Docker containers started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo.
echo Run "docker-compose logs -f" to view logs
pause
```

### Docker Stop (docker-stop.bat)
```batch
@echo off
echo Stopping Docker containers...

docker-compose down

echo ✅ Docker containers stopped!
pause
```

---

## 🔧 Troubleshooting Windows Issues

### Issue 1: Python Not Found
**Error**: `python is not recognized as an internal or external command`

**Solution**:
```powershell
# Add Python to PATH manually
# 1. Search "Environment Variables" in Windows
# 2. Click "Environment Variables"
# 3. Edit "Path" under System Variables
# 4. Add Python installation path (e.g., C:\Python311)
# 5. Add Scripts path (e.g., C:\Python311\Scripts)
# 6. Restart PowerShell
```

### Issue 2: Execution Policy Error
**Error**: `cannot be loaded because running scripts is disabled`

**Solution**:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: Port Already in Use
**Error**: `Address already in use`

**Solution**:
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F
```

### Issue 4: SQLite Database Locked
**Error**: `database is locked`

**Solution**:
```powershell
# Stop all running processes
# Delete stock_compass.db
del backend\stock_compass.db

# Restart backend (database will be recreated)
```

### Issue 5: npm Install Fails
**Error**: Various npm errors

**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Use Node.js LTS version (18.x)
node --version

# Delete and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue 6: Docker Desktop Not Starting
**Error**: Docker Desktop failed to start

**Solution**:
```powershell
# Enable WSL 2
wsl --install
wsl --set-default-version 2

# Enable Virtualization in BIOS
# Restart computer
# Launch Docker Desktop
```

---

## 🔐 Firewall Configuration

### Allow Ports Through Windows Firewall

```powershell
# Run as Administrator

# Allow port 8000 (Backend)
netsh advfirewall firewall add rule name="AI Stock Compass Backend" dir=in action=allow protocol=TCP localport=8000

# Allow port 5173 (Frontend)
netsh advfirewall firewall add rule name="AI Stock Compass Frontend" dir=in action=allow protocol=TCP localport=5173
```

---

## 📊 Performance Optimization for Windows

### 1. Disable Windows Defender for Project Folder
```powershell
# Run as Administrator
Add-MpPreference -ExclusionPath "C:\Projects\ai-stock-compass-main"
```

### 2. Increase Node.js Memory Limit
```powershell
# In package.json, update dev script:
"dev": "node --max-old-space-size=4096 node_modules/vite/bin/vite.js"
```

### 3. Use Windows Terminal (Recommended)
- Download from Microsoft Store
- Better performance than CMD/PowerShell
- Supports multiple tabs
- Better Unicode support

---

## 🧪 Testing on Windows

### Backend Tests
```powershell
cd backend
pytest
```

### Frontend Tests
```powershell
npm test
```

### API Health Check
```powershell
# Using curl (built into Windows 10+)
curl http://localhost:8000/

# Or using PowerShell
Invoke-WebRequest -Uri http://localhost:8000/ | Select-Object -ExpandProperty Content
```

---

## 📦 Production Build on Windows

### Frontend Production Build
```powershell
npm run build
```

Output will be in `dist/` folder.

### Serve Production Build
```powershell
# Install serve globally
npm install -g serve

# Serve the build
serve -s dist -p 5173
```

---

## 🔄 Database Migration (If Needed)

### Backup Database
```powershell
copy backend\stock_compass.db backend\stock_compass_backup.db
```

### Reset Database
```powershell
del backend\stock_compass.db
# Restart backend - new database will be created
```

---

## 📚 Additional Resources

- **Python for Windows**: https://www.python.org/downloads/windows/
- **Node.js for Windows**: https://nodejs.org/en/download/
- **Docker Desktop**: https://docs.docker.com/desktop/windows/
- **WSL 2**: https://docs.microsoft.com/en-us/windows/wsl/install
- **Windows Terminal**: https://aka.ms/terminal

---

## ✅ Quick Start Checklist

- [ ] Install Python 3.11+
- [ ] Install Node.js 18+
- [ ] Install Docker Desktop (optional)
- [ ] Clone/Download project
- [ ] Create virtual environment
- [ ] Install backend dependencies
- [ ] Configure .env file with API keys
- [ ] Start backend server (port 8000)
- [ ] Install frontend dependencies
- [ ] Start frontend server (port 5173)
- [ ] Access http://localhost:5173
- [ ] Register/Login
- [ ] Test stock search and analysis

---

## 🆘 Getting Help

If you encounter issues:
1. Check this guide's troubleshooting section
2. Check logs: `backend/logs/` or console output
3. Verify all prerequisites are installed
4. Check API keys are correct in `.env`
5. Ensure ports 8000 and 5173 are not blocked
6. Try Docker setup if native setup fails

---

**Last Updated**: 2026-01-27
**Tested On**: Windows 11 Home/Pro 23H2
**Status**: ✅ Fully Working
