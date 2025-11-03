# SWStarter - Star Wars Search Application

A full-stack web application that allows users to search and explore Star Wars characters and movies using the Star Wars API (SWAPI). Built with React (TypeScript) on the frontend and Laravel (PHP) on the backend, all running in Docker containers.

## Features

- 🔍 **Search Functionality**: Search for Star Wars characters and movies
- 🌍 **Multi-language Support**: English, French, Japanese, and Chinese
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📊 **Statistics Dashboard**: View search analytics updated every 5 minutes
- ♿ **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- 🐳 **Docker**: Fully containerized for easy setup and deployment
- ⚡ **Queue System**: Background job processing with Laravel queues and Redis
- ✅ **Tested**: Comprehensive test coverage (Backend: 37 tests passing, Frontend: 53 tests passing)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for API calls
- CSS Modules for styling
- react-i18next for internationalization
- Jest + React Testing Library for testing

### Backend
- Laravel 10 with PHP 8.2
- Redis (for caching, queuing, and data storage)
- Guzzle HTTP client
- PHPUnit + Pest for testing

### Infrastructure
- Docker & Docker Compose
- Nginx web server
- Supervisor for process management

## Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Compose)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/xinen8721/lawn-starter-starwars.git
cd lawn-starter-starwars

# Start the application
docker-compose up --build
```

That's it! The application will automatically:
- ✅ Build all Docker containers
- ✅ Install dependencies
- ✅ Set up the Laravel backend
- ✅ Configure Redis
- ✅ Run database migrations
- ✅ Generate application keys

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Statistics**: http://localhost:5173/statistics

### Configuration

All configuration is managed through the `.env` file in the project root. The default settings work out of the box, but you can customize:

- **Ports**: Change `FRONTEND_PORT`, `BACKEND_PORT`, or `REDIS_PORT` if you have conflicts
- **API URL**: Modify `VITE_API_URL` for the frontend
- **External API**: Change `SWAPI_BASE_URL` if needed

The `.env` file is committed to the repository for easy setup (contains no secrets).

## Architecture

### Redis-Only Architecture

This application uses a **Redis-only architecture** for simplicity and performance:
- **No PostgreSQL**: All data is stored in Redis using native data structures
- **Sorted Sets**: Store top searches by popularity (automatic ranking)
- **Hashes**: Store search metadata (response times, timestamps, counts)
- **Persistence**: Redis AOF + RDB snapshots ensure data durability
- **Automatic Expiration**: 30-day TTL on search data keeps storage lean

### Frontend Structure

```
frontend/src/
├── components/              # React components
│   ├── common/             # Reusable UI components
│   │   ├── Button/         # Button with variants (primary, secondary, outline)
│   │   ├── Card/           # Generic card wrapper
│   │   └── Spinner/        # Loading spinner
│   ├── layout/             # Layout components
│   │   ├── PageLayout/     # Standard page wrapper
│   │   └── ContentContainer/ # Responsive container
│   ├── Header.tsx          # App header with hamburger menu
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── PreferencesModal.tsx # Language/theme preferences
│   ├── SearchForm.tsx      # Search input and filters
│   └── ResultCard.tsx      # Search result item
├── pages/                  # Page components (routes)
│   ├── SearchPage.tsx      # Main search interface
│   ├── PersonDetails.tsx   # Character detail page
│   ├── MovieDetails.tsx    # Movie detail page
│   └── Statistics.tsx      # Statistics dashboard
├── hooks/                  # Custom React hooks
│   ├── useLocalStorage.ts  # Type-safe localStorage hook
│   ├── useFocusTrap.ts     # Focus trap for modals
│   ├── useKeyboardNav.ts   # Keyboard navigation
│   └── usePreferences.ts   # Theme and language preferences
├── utils/                  # Utility functions
│   ├── a11y.ts            # Accessibility helpers
│   ├── keyboard.ts        # Keyboard event utilities
│   └── format.ts          # Formatting functions
├── constants/              # App constants
│   ├── app.ts             # App-level constants
│   ├── keys.ts            # Keyboard key constants
│   └── storage.ts         # localStorage keys
├── services/               # API service layer
│   └── api.ts             # Axios-based API client
├── types/                  # TypeScript type definitions
├── locales/                # i18n translations
│   ├── en.json            # English
│   ├── fr.json            # French
│   ├── ja.json            # Japanese
│   └── zh.json            # Chinese
└── styles/                 # Global styles
    ├── themes.css         # Light/dark theme variables
    ├── utilities.css      # Utility classes
    ├── mixins.css         # CSS custom properties
    └── animations.css     # Reusable animations
```

### Backend Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API controllers
│   │   │   ├── SearchController.php
│   │   │   └── StatisticsController.php
│   │   └── Middleware/      # CORS middleware
│   ├── Jobs/                # Queue jobs
│   │   └── CalculateStatistics.php
│   └── Services/            # Business logic layer
│       ├── SwapiService.php         # SWAPI integration
│       ├── SearchLogService.php     # Search logging to Redis
│       └── StatisticsService.php    # Statistics calculation
├── tests/
│   ├── Feature/             # Feature tests
│   └── Unit/                # Unit tests
└── routes/
    ├── api.php             # API routes
    └── console.php         # Scheduled tasks
```

## Development

### Running Tests

**Frontend:**
```bash
# Run all tests
docker-compose exec frontend npm test

# Run with coverage
docker-compose exec frontend npm run test:coverage

# Watch mode
docker-compose exec frontend npm run test:watch
```

**Backend:**
```bash
# Run all tests
docker-compose exec backend php artisan test

# Run specific test
docker-compose exec backend php artisan test --filter=SearchControllerTest

# Run with coverage
docker-compose exec backend php artisan test --coverage
```

### Code Organization Best Practices

**Component Imports:**
```typescript
// Use barrel exports for cleaner imports
import { Button, Card, Spinner } from '@/components/common'
import { useLocalStorage, useFocusTrap } from '@/hooks'
import { announce, formatNumber } from '@/utils'
```

**Creating New Components:**
1. Create component directory: `components/common/MyComponent/`
2. Create files:
   - `MyComponent.tsx` - Component logic
   - `MyComponent.module.css` - Component styles
   - `index.ts` - Re-export component
3. Export from `components/common/index.ts`

### Viewing Logs

```bash
# View all container logs
docker-compose logs -f

# View specific container
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f queue-worker
```

### Accessing Redis

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# View top people searches
docker-compose exec redis redis-cli ZREVRANGE search:people:top 0 -1 WITHSCORES

# View search metadata
docker-compose exec redis redis-cli HGETALL "search:people:Luke:meta"
```

### Installing Dependencies

**Frontend:**
```bash
docker-compose exec frontend npm install <package-name>
```

**Backend:**
```bash
docker-compose exec backend composer require <package-name>
```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API endpoint documentation.

**Quick Reference:**
- `POST /api/search` - Search for people or movies
- `GET /api/people/{id}` - Get person details
- `GET /api/movies/{id}` - Get movie details
- `GET /api/statistics` - Get search statistics

## Queue System

The application uses Laravel's queue system with Redis:

- **Job**: `CalculateStatistics`
- **Schedule**: Every 5 minutes
- **Purpose**: Calculate and store search statistics

The queue worker and scheduler run as separate Docker containers ensuring continuous background processing.

## Testing Coverage

### Frontend (Jest + React Testing Library)
- **Total**: 53 tests passing
- **Coverage**: ~25% lines
- **Test Files**:
  - Component tests (Button, Card, Spinner, Header)
  - Hook tests (useLocalStorage)
  - Utility tests (format, keyboard, a11y)
  - Service tests (API)

### Backend (PHPUnit + Pest)
- **Total**: 37 tests passing
- **Coverage**: Comprehensive
- **Test Files**:
  - Feature tests (SearchController)
  - Unit tests (Services, Jobs)

## Troubleshooting

### Containers Won't Start
```bash
# Stop all containers
docker-compose down

# Clean everything and start fresh
docker-compose down -v --rmi all --remove-orphans

# Rebuild and start
docker-compose up --build
```

### Port Conflicts
If you see port conflicts, update the `.env` file:
```bash
# Change ports in .env
FRONTEND_PORT=3000
BACKEND_PORT=8080
REDIS_PORT=6380

# Restart
docker-compose up --build
```

### Frontend Can't Connect to Backend
- Ensure all containers are running: `docker-compose ps`
- Check backend health: `curl http://localhost:8000/api/statistics`
- Update `VITE_API_URL` in `.env` if using custom ports
- Verify CORS middleware is configured

### Queue Jobs Not Running
```bash
# Check queue worker logs
docker-compose logs -f queue-worker

# Check scheduler logs
docker-compose logs -f scheduler

# Manually dispatch a job
docker-compose exec backend php artisan queue:work --once
```

### Redis Connection Errors
```bash
# Check Redis is running
docker-compose exec redis redis-cli ping

# Clear Laravel cache
docker-compose exec backend php artisan config:clear
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use production secrets
2. **SSL/TLS**: Add HTTPS via reverse proxy
3. **Redis**: Use managed Redis service with persistence
4. **Scaling**: Increase queue worker replicas
5. **Monitoring**: Add logging service (Sentry, LogRocket)
6. **Caching**: Implement response caching for SWAPI
7. **Rate Limiting**: Add API rate limiting
8. **Frontend Build**: Use production build with Nginx

## Contributing

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `SearchForm.tsx`, `ResultCard.tsx` |
| Hooks | camelCase with `use` prefix | `useLocalStorage.ts` |
| Utils | camelCase | `a11y.ts`, `keyboard.ts` |
| CSS Modules | Match component | `SearchForm.module.css` |
| Utility Classes | `.u-` prefix | `.u-sr-only`, `.u-skip-link` |

### Coding Standards

- **TypeScript**: Use strict mode, proper typing
- **CSS**: Use CSS Modules, avoid global styles
- **Accessibility**: Follow WCAG 2.1 AA guidelines
- **Testing**: Write tests for new features
- **Git**: Use conventional commits

## License

This project was created for LawnStarter.

## Acknowledgments

- Star Wars API (SWAPI) for providing the data
- LawnStarter for the opportunity

---

**Repository**: https://github.com/xinen8721/lawn-starter-starwars
