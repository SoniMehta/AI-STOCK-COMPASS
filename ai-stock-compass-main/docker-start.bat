@echo off
REM AI Stock Compass - Docker Start Script for Windows
REM This script starts the application using Docker Compose

echo ================================================
echo   AI Stock Compass - Starting with Docker
echo ================================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    echo.
    echo After installation:
    echo 1. Start Docker Desktop
    echo 2. Wait for it to fully start
    echo 3. Run this script again
    pause
    exit /b 1
)

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop is not running
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo [1/3] Checking .env file...
if not exist "backend\.env" (
    echo WARNING: backend\.env file not found
    echo Please create backend\.env with your API keys
    echo See backend\.env.example for reference
    pause
    exit /b 1
)

echo [2/3] Building Docker images...
echo This may take a few minutes on first run...
docker-compose build

if errorlevel 1 (
    echo ERROR: Docker build failed
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo [3/3] Starting Docker containers...
docker-compose up -d

if errorlevel 1 (
    echo ERROR: Failed to start containers
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Application Started Successfully with Docker!
echo ================================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo   View logs:        docker-compose logs -f
echo   Stop containers:  docker-compose down
echo   Restart:          docker-compose restart
echo.

REM Wait a bit for services to fully start
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo Press any key to open frontend in browser...
pause >nul

REM Open browser
start http://localhost:5173

echo.
echo To view logs, run: docker-compose logs -f
echo To stop, run: docker-compose down
echo.
pause
