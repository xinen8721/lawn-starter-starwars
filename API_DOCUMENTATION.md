# API Documentation

This document describes all available API endpoints in the SWStarter application.

## Base URL

```
http://localhost:8000/api
```

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Endpoints

### 1. Search

Search for Star Wars characters or movies.

**Endpoint**: `POST /api/search`

**Request Body**:
```json
{
  "type": "people" | "movies",
  "term": "string"
}
```

**Parameters**:
- `type` (required): Either "people" or "movies"
- `term` (required): Search query (min: 1 char, max: 100 chars)

**Success Response** (200 OK):
```json
{
  "type": "people",
  "term": "luke",
  "count": 1,
  "results": [
    {
      "id": 1,
      "name": "Luke Skywalker",
      "url": "https://swapi.dev/api/people/1/"
    }
  ]
}
```

**Error Response** (422 Unprocessable Entity):
```json
{
  "error": "Validation failed",
  "messages": {
    "type": ["The type field is required."],
    "term": ["The term field is required."]
  }
}
```

**Example**:
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"type":"people","term":"luke"}'
```

---

### 2. Get Person Details

Retrieve detailed information about a specific character.

**Endpoint**: `GET /api/people/{id}`

**URL Parameters**:
- `id` (required): Person ID (integer)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "Luke Skywalker",
  "birth_year": "19BBY",
  "gender": "male",
  "eye_color": "blue",
  "hair_color": "blond",
  "height": "172",
  "mass": "77",
  "skin_color": "fair",
  "films": [
    {
      "id": 1,
      "url": "https://swapi.dev/api/films/1/"
    },
    {
      "id": 2,
      "url": "https://swapi.dev/api/films/2/"
    }
  ]
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Person not found"
}
```

**Example**:
```bash
curl http://localhost:8000/api/people/1
```

---

### 3. Get Movie Details

Retrieve detailed information about a specific movie.

**Endpoint**: `GET /api/movies/{id}`

**URL Parameters**:
- `id` (required): Movie ID (integer)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "A New Hope",
  "episode_id": 4,
  "opening_crawl": "It is a period of civil war...",
  "director": "George Lucas",
  "producer": "Gary Kurtz, Rick McCallum",
  "release_date": "1977-05-25",
  "characters": [
    {
      "id": 1,
      "url": "https://swapi.dev/api/people/1/"
    },
    {
      "id": 2,
      "url": "https://swapi.dev/api/people/2/"
    }
  ]
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Movie not found"
}
```

**Example**:
```bash
curl http://localhost:8000/api/movies/1
```

---

### 4. Get Statistics

Retrieve calculated search statistics. Statistics are recalculated every 5 minutes via a background job.

**Endpoint**: `GET /api/statistics`

**Success Response** (200 OK):
```json
{
  "top_queries": [
    {
      "term": "luke",
      "count": 25,
      "percentage": 35.71
    },
    {
      "term": "vader",
      "count": 15,
      "percentage": 21.43
    }
  ],
  "average_response_time": 234.56,
  "popular_hours": [
    {
      "hour": 14,
      "count": 45
    },
    {
      "hour": 15,
      "count": 38
    }
  ],
  "total_searches": 70,
  "searches_by_type": {
    "people": 50,
    "movies": 20
  }
}
```

**Response Fields**:
- `top_queries`: Array of top 5 search terms with counts and percentages
- `average_response_time`: Average API response time in milliseconds
- `popular_hours`: Search volume by hour (UTC)
- `total_searches`: Total number of searches logged
- `searches_by_type`: Breakdown by search type

**Example**:
```bash
curl http://localhost:8000/api/statistics
```

---

## Error Handling

All endpoints follow consistent error response format:

### Validation Error (422)
```json
{
  "error": "Validation failed",
  "messages": {
    "field_name": ["Error message"]
  }
}
```

### Not Found (404)
```json
{
  "error": "Resource not found"
}
```

### Server Error (500)
```json
{
  "error": "Failed to process request",
  "message": "Detailed error message"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing rate limiting to prevent abuse.

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for all origins:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

## Data Sources

All character and movie data is sourced from the [Star Wars API (SWAPI)](https://swapi.dev/):
- Base URL: `https://swapi.dev/api`
- Documentation: https://swapi.dev/documentation

## Statistics Calculation

Statistics are calculated every 5 minutes by a background job that:

1. Queries the `searches` table
2. Aggregates data:
   - Top 5 most searched terms with percentages
   - Average response time across all searches
   - Search volume distribution by hour
   - Total search count
   - Breakdown by search type
3. Stores results in `statistics` table
4. Returns latest cached statistics on API calls

## Database Schema

### searches table
```sql
id              SERIAL PRIMARY KEY
search_type     VARCHAR(255)    -- 'people' or 'movies'
search_term     VARCHAR(255)    -- The search query
results_count   INTEGER         -- Number of results returned
response_time_ms INTEGER        -- API response time
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### statistics table
```sql
id              SERIAL PRIMARY KEY
data            JSON            -- All calculated statistics
calculated_at   TIMESTAMP       -- When stats were calculated
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## Response Times

Typical response times:
- Search: 200-500ms (depends on SWAPI response)
- Person details: 200-400ms
- Movie details: 200-400ms
- Statistics: <50ms (cached)

## Testing with cURL

### Test all endpoints:

```bash
# 1. Search for people
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"type":"people","term":"luke"}'

# 2. Search for movies
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"type":"movies","term":"empire"}'

# 3. Get person details
curl http://localhost:8000/api/people/1

# 4. Get movie details
curl http://localhost:8000/api/movies/1

# 5. Get statistics
curl http://localhost:8000/api/statistics

# 6. Test validation error
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"type":"invalid","term":""}'
```

## Testing with Postman

Import this collection URL or create requests manually:

1. Create a new collection "SWStarter API"
2. Add requests for each endpoint
3. Set base URL to `http://localhost:8000/api`
4. Test all success and error scenarios

## Development Notes

### Adding New Endpoints

1. Define route in `backend/routes/api.php`
2. Create controller method in `backend/app/Http/Controllers/`
3. Add service layer logic in `backend/app/Services/`
4. Update this documentation

### Logging

All API requests are logged to:
- `backend/storage/logs/laravel.log`

View logs:
```bash
docker-compose logs -f backend
```

### Monitoring

Monitor queue job processing:
```bash
docker-compose logs -f queue-worker
docker-compose logs -f scheduler
```

## Version History

- **v1.0.0** (2024): Initial release
  - Search endpoint
  - Person/Movie detail endpoints
  - Statistics endpoint
  - Queue-based statistics calculation

---

For implementation details, see `PROJECT_STRUCTURE.md` and `README.md`.

