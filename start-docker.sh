#!/bin/bash

echo "====================================================="
echo "       PowerKi Gym E-Commerce - Docker Startup"
echo "====================================================="
echo

# Check if Docker is running
if ! docker version &> /dev/null; then
    echo "❌ Docker is not running or not installed!"
    echo
    echo "Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running!"
echo

# Check if docker-compose is available
if ! docker-compose version &> /dev/null; then
    echo "❌ Docker Compose is not available!"
    echo
    echo "Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker Compose is available!"
echo

echo "🚀 Starting PowerKi E-Commerce application..."
echo
echo "This will start:"
echo "  - MySQL Database (Port 3306)"
echo "  - Spring Boot Backend (Port 8080)"
echo "  - React Frontend (Port 3000)"
echo

# Build and start all services
docker-compose up --build

echo
echo "🎉 Application is running!"
echo
echo "Access your application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8080"
echo "  Database: localhost:3306"
echo
echo "Press Ctrl+C to stop the application" 