@echo off
REM AI Stock Compass - Docker Stop Script for Windows
REM This script stops all Docker containers

echo ================================================
echo   AI Stock Compass - Stopping Docker Containers
echo ================================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop is not running
    echo Containers may already be stopped
    pause
    exit /b 1
)

echo Stopping containers...
docker-compose down

if errorlevel 1 (
    echo ERROR: Failed to stop containers
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Docker Containers Stopped Successfully!
echo ================================================
echo.

REM Optional: Show remaining containers
echo Checking for remaining containers...
docker ps -a | findstr "ai-stock-compass"

echo.
echo To remove all containers and volumes, run:
echo   docker-compose down -v
echo.
echo To start again, run: docker-start.bat
echo.
pause
