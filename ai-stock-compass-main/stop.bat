@echo off
REM AI Stock Compass - Stop Script for Windows
REM This script stops all running backend and frontend processes

echo ================================================
echo   AI Stock Compass - Stopping Application
echo ================================================
echo.

echo [1/2] Stopping Backend Server...
REM Kill Python processes running uvicorn (backend)
for /f "tokens=2" %%a in ('tasklist ^| findstr "python.exe"') do (
    netstat -ano | findstr ":8000" | findstr "%%a" >nul 2>&1
    if not errorlevel 1 (
        echo Stopping backend process %%a...
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo [2/2] Stopping Frontend Server...
REM Kill Node processes running on port 5173 (frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
    echo Stopping frontend process %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo ================================================
echo   Application Stopped Successfully!
echo ================================================
echo.
pause
