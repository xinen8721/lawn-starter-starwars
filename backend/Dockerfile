FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    redis-tools \
    nginx \
    supervisor

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo mbstring exif pcntl bcmath gd

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory contents
COPY . /var/www/html

# Create required Laravel directories
RUN mkdir -p bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs

# Copy nginx configuration
COPY nginx.conf /etc/nginx/sites-available/default

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Ensure .env file exists (Laravel requires it)
RUN touch .env && \
    echo "APP_NAME=LawnStarterStarWars" >> .env && \
    echo "APP_ENV=production" >> .env && \
    echo "APP_DEBUG=false" >> .env && \
    echo "APP_KEY=" >> .env

# Set permissions
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

# Copy supervisor configuration
RUN echo '[supervisord]\n\
nodaemon=true\n\
\n\
[program:nginx]\n\
command=/usr/sbin/nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
\n\
[program:php-fpm]\n\
command=/usr/local/sbin/php-fpm\n\
autostart=true\n\
autorestart=true' > /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

