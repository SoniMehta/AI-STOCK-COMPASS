# Docker Deployment Guide - AI Stock Compass

Complete guide for running AI Stock Compass using Docker on Windows 11.

## 📦 What is Docker?

Docker allows you to package the entire application (code, dependencies, runtime) into containers that run consistently on any system.

### Benefits
- ✅ **No Python/Node.js installation needed**
- ✅ **Consistent environment** (same on Windows, Mac, Linux)
- ✅ **Isolated** from other applications
- ✅ **Easy to start/stop/reset**
- ✅ **Production-ready**

## 🔧 Prerequisites

### 1. Install Docker Desktop for Windows 11

**Download**: https://www.docker.com/products/docker-desktop/

**System Requirements**:
- Windows 11 64-bit (Home, Pro, Enterprise, or Education)
- 4 GB RAM minimum (8 GB recommended)
- BIOS-level hardware virtualization enabled

**Installation Steps**:
1. Download Docker Desktop Installer
2. Run `Docker Desktop Installer.exe`
3. Follow the installation wizard
4. Enable WSL 2 when prompted (recommended)
5. Restart your computer
6. Launch Docker Desktop
7. Complete the initial setup

**Verify Installation**:
```powershell
docker --version
# Output: Docker version 24.x.x, build xxxxx

docker-compose --version
# Output: Docker Compose version v2.x.x
```

### 2. Enable WSL 2 (Required)

```powershell
# Open PowerShell as Administrator
wsl --install
wsl --set-default-version 2

# Restart computer
```

### 3. Configure Docker Desktop

1. Open Docker Desktop
2. Go to Settings (gear icon)
3. **General**:
   - ✅ Use WSL 2 based engine
   - ✅ Start Docker Desktop when you log in
4. **Resources**:
   - Memory: 4 GB minimum (8 GB recommended)
   - CPUs: 2 minimum (4 recommended)
5. Click "Apply & Restart"

## 📁 Project Files

The following Docker-related files have been created:

```
ai-stock-compass-main/
├── Dockerfile.backend          # Backend container definition
├── Dockerfile.frontend         # Frontend container definition
├── docker-compose.yml          # Multi-container orchestration
├── nginx.conf                  # Nginx configuration for frontend
├── .dockerignore              # Files to exclude from Docker
├── docker-start.bat           # Windows: Start with Docker
└── docker-stop.bat            # Windows: Stop Docker containers
```

## 🚀 Quick Start (Easiest Method)

### Step 1: Configure API Keys

Create/edit `backend/.env` file:
```env
# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Polygon.io API
POLYGON_API_KEY=your-polygon-api-key

# News API
NEWS_API_KEY=your-news-api-key
```

### Step 2: Start Application

**Double-click**: `docker-start.bat`

Or in PowerShell:
```powershell
.\docker-start.bat
```

### Step 3: Access Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Step 4: Stop Application

**Double-click**: `docker-stop.bat`

Or in PowerShell:
```powershell
.\docker-stop.bat
```

## 🔨 Manual Docker Commands

### Build Images

```powershell
# Build all services
docker-compose build

# Build only backend
docker-compose build backend

# Build only frontend
docker-compose build frontend

# Force rebuild (ignore cache)
docker-compose build --no-cache
```

### Start Containers

```powershell
# Start all services (foreground)
docker-compose up

# Start all services (background/detached)
docker-compose up -d

# Start specific service
docker-compose up backend
docker-compose up frontend

# Start with fresh build
docker-compose up --build
```

### Stop Containers

```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (database reset)
docker-compose down -v

# Stop but keep containers
docker-compose stop

# Start stopped containers
docker-compose start
```

### View Logs

```powershell
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# View last 100 lines
docker-compose logs --tail=100

# Follow specific service
docker-compose logs -f backend
```

### Container Management

```powershell
# List running containers
docker-compose ps

# List all containers (including stopped)
docker ps -a

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend bash
docker-compose exec frontend sh
```

## 🏗️ Architecture

### Docker Compose Structure

```yaml
services:
  backend:
    - Port: 8000
    - Technology: Python 3.11 + FastAPI
    - Database: SQLite (in volume)

  frontend:
    - Port: 5173
    - Technology: Node 18 + React + Vite + Nginx
    - Depends on: backend
```

### Networking

```
┌─────────────────────────────────────┐
│        Host Machine (Windows)        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │     Docker Network (bridge)     │ │
│  │                                 │ │
│  │  ┌──────────┐    ┌──────────┐ │ │
│  │  │ Backend  │    │ Frontend │ │ │
│  │  │  :8000   │◄───│  :5173   │ │ │
│  │  └────┬─────┘    └──────────┘ │ │
│  │       │                        │ │
│  │   ┌───▼────┐                   │ │
│  │   │ SQLite │                   │ │
│  │   │Volume  │                   │ │
│  │   └────────┘                   │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 💾 Data Persistence

### Volumes

Docker uses volumes to persist data:

```powershell
# List volumes
docker volume ls

# Inspect volume
docker volume inspect ai-stock-compass-main_backend-data

# Remove volumes (WARNING: Deletes all data)
docker-compose down -v
```

### Database Location

- **Inside container**: `/app/data/stock_compass.db`
- **On host**: `backend/data/stock_compass.db`

### Backup Database

```powershell
# Copy database from container
docker cp ai-stock-compass-backend:/app/data/stock_compass.db ./backup.db

# Restore database to container
docker cp ./backup.db ai-stock-compass-backend:/app/data/stock_compass.db
```

## 🔍 Troubleshooting

### Issue 1: Docker Desktop Won't Start

**Solution**:
```powershell
# Run as Administrator
net stop com.docker.service
net start com.docker.service

# Or restart Docker Desktop from system tray
```

### Issue 2: Port Already in Use

**Error**: `port is already allocated`

**Solution**:
```powershell
# Find process using port
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

### Issue 3: Build Fails

**Solution**:
```powershell
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Issue 4: Container Keeps Restarting

**Check logs**:
```powershell
docker-compose logs backend
docker-compose logs frontend
```

**Common causes**:
- Missing API keys in `.env`
- Invalid configuration
- Port conflict

### Issue 5: Cannot Access Application

**Check container status**:
```powershell
docker-compose ps
```

**Check if ports are bound**:
```powershell
netstat -ano | findstr :8000
netstat -ano | findstr :5173
```

**Restart containers**:
```powershell
docker-compose restart
```

### Issue 6: WSL 2 Issues

**Solution**:
```powershell
# Update WSL
wsl --update

# Set WSL 2 as default
wsl --set-default-version 2

# Restart Docker Desktop
```

## 🎯 Health Checks

Both services have built-in health checks:

```powershell
# Check health status
docker-compose ps

# Should show "healthy" for both services
```

### Manual Health Checks

```powershell
# Backend health
curl http://localhost:8000/

# Frontend health
curl http://localhost:5173/health
```

## 🔄 Updates and Maintenance

### Update Application

```powershell
# Pull latest code (if using git)
git pull

# Rebuild and restart
docker-compose up --build -d
```

### Clean Up Docker

```powershell
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything (WARNING: Deletes all data)
docker system prune -a --volumes
```

### View Resource Usage

```powershell
# Container stats
docker stats

# System-wide info
docker system df
```

## 📊 Performance Optimization

### Allocate More Resources

Docker Desktop → Settings → Resources:
- **Memory**: 8 GB (from default 4 GB)
- **CPUs**: 4 (from default 2)
- **Swap**: 2 GB
- **Disk**: 64 GB

### Enable File Sharing

Docker Desktop → Settings → Resources → File Sharing:
- Add project directory if not already listed

## 🚢 Production Deployment

### Environment Variables for Production

Edit `backend/.env`:
```env
ENVIRONMENT=production
DEBUG=False
```

### Use Production Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  backend:
    restart: always
    environment:
      - ENVIRONMENT=production
      - DEBUG=False

  frontend:
    restart: always
```

Run with:
```powershell
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📝 Useful Commands Reference

```powershell
# Quick Reference Card

# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# Logs
docker-compose logs -f

# Status
docker-compose ps

# Rebuild
docker-compose up --build

# Shell access
docker-compose exec backend bash
docker-compose exec frontend sh

# Remove everything
docker-compose down -v
docker system prune -a
```

## 🆘 Getting Help

### Check Status
```powershell
# Docker daemon status
docker version

# Container status
docker-compose ps

# Recent logs
docker-compose logs --tail=50
```

### Debug Mode
```powershell
# Start in foreground (see all logs)
docker-compose up

# Inspect container
docker inspect ai-stock-compass-backend
docker inspect ai-stock-compass-frontend
```

### Common Issues
1. ✅ Docker Desktop not running → Start Docker Desktop
2. ✅ Port conflicts → Stop other services or change ports
3. ✅ Missing .env → Create backend/.env with API keys
4. ✅ Build errors → Run `docker-compose build --no-cache`
5. ✅ WSL 2 issues → Update WSL with `wsl --update`

## 🎓 Learning Resources

- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **WSL 2**: https://docs.microsoft.com/en-us/windows/wsl/

---

**Last Updated**: 2026-01-27
**Tested On**: Windows 11 23H2 with Docker Desktop 24.x
**Status**: ✅ Production Ready
