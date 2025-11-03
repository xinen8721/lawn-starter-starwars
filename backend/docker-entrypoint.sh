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

# If a command was passed, run it instead of supervisor
if [ $# -gt 0 ]; then
    echo "🎬 Running command: $@"
    exec "$@"
else
    # Start supervisord (for the main backend container)
    echo "🎬 Starting services..."
    exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
fi

