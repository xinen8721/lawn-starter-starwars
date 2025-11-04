<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

/**
 * StatisticsService - Calculates and caches search statistics from Redis
 *
 * Redis Key Structure:
 * - search:{type}:top              - Sorted set of search terms by count (ZSET)
 * - search:{type}:{term}:meta      - Hash with metadata (total_response_time, count, etc.)
 * - search:type:{type}:count       - Total searches counter for this type (STRING)
 * - search:hours:{HH}              - Counter for searches during this hour (STRING)
 *
 * Caching Strategy:
 * - Statistics are pre-calculated by a scheduled job every 5 minutes
 * - Results are cached in Redis with 1-hour TTL
 * - API endpoint serves from cache for fast response times (<10ms)
 * - Cache miss triggers immediate calculation (fallback, ~50-100ms)
 */
class StatisticsService
{
    /** Cache key for storing calculated statistics */
    const CACHE_KEY = 'statistics:latest';

    /** Cache TTL: 1 hour (stats recalculated every 5 minutes, so this is safe) */
    const CACHE_TTL = 3600;

    /**
     * Calculate and store statistics from Redis data (called by scheduled job)
     */
    public function calculateStatistics(): array
    {
        $startTime = microtime(true);

        $stats = [
            'top_queries' => $this->getTopQueries(),
            'average_response_time' => $this->getAverageResponseTime(),
            'popular_hours' => $this->getPopularHours(),
            'total_searches' => $this->getTotalSearches(),
            'searches_by_type' => $this->getSearchesByType(),
        ];

        $calculationTime = round((microtime(true) - $startTime) * 1000, 2);

        // Cache in Redis for fast API responses
        $cachedData = [
            'data' => $stats,
            'calculated_at' => now()->toISOString(),
            'calculation_time_ms' => $calculationTime,
            'cached_at' => now()->toISOString(),
            'cache_miss' => false,
        ];

        Cache::put(self::CACHE_KEY, $cachedData, self::CACHE_TTL);

        Log::info('Statistics calculated and cached from Redis data', [
            'calculation_time_ms' => $calculationTime,
            'cache_key' => self::CACHE_KEY,
        ]);

        return $stats;
    }

    /**
     * Get top 5 queries with percentages from Redis sorted sets
     *
     * Algorithm:
     * 1. Fetch top 5 searches from each type (people, movies) using ZREVRANGE
     * 2. Merge all results into a single array (max 10 items)
     * 3. Sort by count descending
     * 4. Take top 5 overall
     * 5. Calculate percentage of each query relative to total searches
     *
     * @return array Array of top queries with term, count, and percentage
     */
    private function getTopQueries(): array
    {
        $redis = Redis::connection();
        $total = $this->getTotalSearches();

        if ($total === 0) {
            return [];
        }

        $topQueries = [];

        // Get top 5 from each type (people/movies) using Redis sorted sets
        // These are stored with scores representing the count of each search term
        foreach (['people', 'movies'] as $type) {
            $topKey = "search:{$type}:top";
            // ZREVRANGE gets members in descending order by score
            $typeResults = $redis->zrevrange($topKey, 0, 4, ['WITHSCORES' => true]);

            foreach ($typeResults as $term => $count) {
                $topQueries[] = [
                    'term' => $term,
                    'count' => (int) $count,
                    'type' => $type,
                ];
            }
        }

        // Sort combined results by count (descending) and take top 5
        usort($topQueries, fn ($a, $b) => $b['count'] - $a['count']);
        $topQueries = array_slice($topQueries, 0, 5);

        // Calculate percentage of total for each query
        return array_map(function ($query) use ($total) {
            return [
                'term' => $query['term'],
                'count' => $query['count'],
                'percentage' => round(($query['count'] / $total) * 100, 2),
            ];
        }, $topQueries);
    }

    /**
     * Get average response time from Redis metadata
     */
    private function getAverageResponseTime(): float
    {
        $redis = Redis::connection();
        $totalTime = 0;
        $totalCount = 0;

        // Aggregate from both types
        foreach (['people', 'movies'] as $type) {
            $topKey = "search:{$type}:top";
            $terms = $redis->zrevrange($topKey, 0, -1);

            foreach ($terms as $term) {
                $metaKey = "search:{$type}:{$term}:meta";
                $meta = $redis->hgetall($metaKey);

                if (! empty($meta['total_response_time']) && ! empty($meta['count'])) {
                    $totalTime += (int) $meta['total_response_time'];
                    $totalCount += (int) $meta['count'];
                }
            }
        }

        return $totalCount > 0 ? round($totalTime / $totalCount, 2) : 0.0;
    }

    /**
     * Get most popular hours for searches from Redis
     */
    private function getPopularHours(): array
    {
        $redis = Redis::connection();
        $hourlyStats = [];

        for ($hour = 0; $hour < 24; $hour++) {
            $hourKey = 'search:hours:'.str_pad($hour, 2, '0', STR_PAD_LEFT);
            $count = (int) $redis->get($hourKey);

            if ($count > 0) {
                $hourlyStats[] = [
                    'hour' => $hour,
                    'count' => $count,
                ];
            }
        }

        // Sort by count descending
        usort($hourlyStats, fn ($a, $b) => $b['count'] - $a['count']);

        return $hourlyStats;
    }

    /**
     * Get total searches from Redis
     */
    private function getTotalSearches(): int
    {
        $redis = Redis::connection();
        $total = 0;

        foreach (['people', 'movies'] as $type) {
            $typeKey = "search:type:{$type}:count";
            $total += (int) $redis->get($typeKey);
        }

        return $total;
    }

    /**
     * Get searches by type from Redis
     */
    private function getSearchesByType(): array
    {
        $redis = Redis::connection();
        $byType = [];

        foreach (['people', 'movies'] as $type) {
            $typeKey = "search:type:{$type}:count";
            $count = (int) $redis->get($typeKey);
            $byType[$type] = $count;
        }

        return $byType;
    }

    /**
     * Get latest statistics (from Redis cache)
     */
    public function getLatestStatistics(): array
    {
        // Try to get from cache first
        $cached = Cache::get(self::CACHE_KEY);

        if ($cached) {
            Log::info('Statistics served from Redis cache');

            return $cached;
        }

        // Cache miss - calculate now
        Log::warning('Statistics cache miss - calculating from Redis data');

        return [
            'data' => $this->calculateStatistics(),
            'calculated_at' => now()->toISOString(),
            'calculation_time_ms' => 0,
            'cached_at' => now()->toISOString(),
            'cache_miss' => true,
        ];
    }

    /**
     * Get cache information
     */
    public function getCacheInfo(): array
    {
        $cached = Cache::get(self::CACHE_KEY);

        return [
            'is_cached' => $cached !== null,
            'cache_key' => self::CACHE_KEY,
            'cache_ttl_seconds' => self::CACHE_TTL,
            'cached_at' => $cached['cached_at'] ?? null,
            'calculated_at' => $cached['calculated_at'] ?? null,
        ];
    }
}
