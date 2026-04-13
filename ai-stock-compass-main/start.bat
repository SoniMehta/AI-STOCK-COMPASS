@echo off
REM AI Stock Compass - Start Script for Windows
REM This script starts both backend and frontend servers

echo ================================================
echo   AI Stock Compass - Starting Application
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking virtual environment...
if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
    echo Virtual environment created successfully!
)

echo.
echo [2/4] Starting Backend Server...
echo Backend will run on: http://localhost:8000
start "AI Stock Compass - Backend" cmd /k "cd backend && ..\venv\Scripts\activate && python run.py"

REM Wait for backend to start
timeout /t 8 /nobreak >nul

echo.
echo [3/4] Checking frontend dependencies...
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
)

echo.
echo [4/4] Starting Frontend Server...
echo Frontend will run on: http://localhost:5173
start "AI Stock Compass - Frontend" cmd /k "npm run dev"

echo.
echo ================================================
echo   Application Started Successfully!
echo ================================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo Press any key to open frontend in browser...
pause >nul

REM Open browser
start http://localhost:5173

echo.
echo Application is running!
echo Close this window or press Ctrl+C to stop
pause
