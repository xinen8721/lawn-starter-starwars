#!/bin/bash
set -e

echo "🚀 Starting Laravel application..."

# Wait for Redis to be ready
echo "⏳ Waiting for Redis..."
until redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping 2>/dev/null; do
    echo "   Redis is unavailable - sleeping"
    sleep 2
done
echo "✅ Redis is ready!"

# Install/update composer dependencies if vendor directory doesn't exist or is incomplete
if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
    echo "📦 Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader --no-dev
    echo "✅ Composer dependencies installed!"
fi

# Ensure Laravel directories exist with proper permissions
echo "📁 Ensuring Laravel directories exist..."
mkdir -p bootstrap/cache storage/framework/{cache,sessions,views} storage/logs
chmod -R 775 bootstrap/cache storage
chown -R www-data:www-data bootstrap/cache storage
echo "✅ Directories ready!"

# Only run initialization steps for the main backend container (not queue-worker or scheduler)
if [ $# -eq 0 ]; then
    # Ensure .env exists (Dockerfile creates it, but volume mount might override)
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file..."
        touch .env
        echo "APP_NAME=SWStarter" >> .env
        echo "APP_ENV=local" >> .env
        echo "APP_DEBUG=true" >> .env
        echo "APP_KEY=" >> .env
        echo "✅ .env file created!"
    fi

    # Generate app key if not set
    if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
        echo "🔑 Generating application key..."
        php artisan key:generate --no-interaction
        echo "✅ App key generated!"
    fi

    # Run database migrations
    echo "📊 Running database migrations..."
    php artisan migrate --force
    echo "✅ Migrations complete!"

    # Clear and cache config
    echo "⚙️  Optimizing configuration..."
    php artisan config:clear
    php artisan config:cache
    echo "✅ Configuration optimized!"
fi

# If a command was passed, run it instead of supervisor
if [ $# -gt 0 ]; then
    echo "🎬 Running command: $@"
    exec "$@"
else
    # Start supervisord (for the main backend container)
    echo "🎬 Starting services..."
    exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
fi

