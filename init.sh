#!/bin/bash

# SWStarter Initialization Script
# This script automates the setup process

echo "🚀 Starting SWStarter initialization..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start containers
echo "📦 Building and starting containers..."
docker-compose up -d --build

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Check if backend container is ready
echo "🔍 Checking backend container..."
until docker-compose exec -T backend php -v > /dev/null 2>&1; do
    echo "   Waiting for backend..."
    sleep 2
done

echo "✅ Backend container is ready"
echo ""

# Setup Laravel
echo "⚙️  Setting up Laravel backend..."

# Copy .env file
echo "   Copying .env file..."
docker-compose exec -T backend bash -c "[ -f .env ] || cp .env.example .env"

# Generate app key
echo "   Generating application key..."
docker-compose exec -T backend php artisan key:generate --no-interaction

# Wait for PostgreSQL
echo "   Waiting for PostgreSQL..."
until docker-compose exec -T postgres pg_isready > /dev/null 2>&1; do
    sleep 2
done

# Run migrations
echo "   Running database migrations..."
docker-compose exec -T backend php artisan migrate --force

# Fix permissions
echo "   Setting permissions..."
docker-compose exec -T backend chmod -R 777 storage bootstrap/cache

echo "✅ Laravel setup complete"
echo ""

# Create frontend .env if it doesn't exist
if [ ! -f "frontend/.env" ]; then
    echo "   Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:8000" > frontend/.env
fi

echo "✅ All done!"
echo ""
echo "📊 Application Status:"
docker-compose ps
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   Stats:    http://localhost:5173/statistics"
echo ""
echo "📝 View logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
echo ""
echo "Happy coding! 🎉"

