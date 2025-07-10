@echo off
echo =====================================================
echo        PowerKi Gym E-Commerce - Docker Startup
echo =====================================================
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running or not installed!
    echo.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running!
echo.

REM Check if docker-compose is available
docker-compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available!
    echo.
    echo Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo ✅ Docker Compose is available!
echo.

echo 🚀 Starting PowerKi E-Commerce application...
echo.
echo This will start:
echo   - MySQL Database (Port 3306)
echo   - Spring Boot Backend (Port 8080)
echo   - React Frontend (Port 3000)
echo.

REM Build and start all services
docker-compose up --build

echo.
echo 🎉 Application is running!
echo.
echo Access your application at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080
echo   Database: localhost:3306
echo.
echo Press Ctrl+C to stop the application
pause 