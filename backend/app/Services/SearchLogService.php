<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class SearchLogService
{
    const TTL_DAYS = 30; // Keep data for 30 days

    const TTL_SECONDS = self::TTL_DAYS * 24 * 60 * 60;

    /**
     * Log a search query to Redis
     */
    public function logSearch(
        string $searchType,
        string $searchTerm,
        int $resultsCount,
        int $responseTimeMs
    ): void {
        try {
            $redis = Redis::connection();
            $normalizedType = strtolower($searchType);
            $normalizedTerm = $searchTerm;

            // Increment count in sorted set (higher score = more popular)
            $topKey = "search:{$normalizedType}:top";
            $redis->zincrby($topKey, 1, $normalizedTerm);
            $redis->expire($topKey, self::TTL_SECONDS);

            // Store metadata in hash
            $metaKey = "search:{$normalizedType}:{$normalizedTerm}:meta";
            $currentCount = (int) $redis->hincrby($metaKey, 'count', 1);
            $redis->hincrby($metaKey, 'total_response_time', $responseTimeMs);
            $redis->hset($metaKey, 'last_searched', now()->toISOString());
            $redis->hset($metaKey, 'results_count', $resultsCount);
            $redis->expire($metaKey, self::TTL_SECONDS);

            // Track hourly searches for popular hours analysis
            $hour = now()->format('H');
            $hourKey = "search:hours:{$hour}";
            $redis->incr($hourKey);
            $redis->expire($hourKey, self::TTL_SECONDS);

            // Track total searches by type
            $typeKey = "search:type:{$normalizedType}:count";
            $redis->incr($typeKey);
            $redis->expire($typeKey, self::TTL_SECONDS);

            Log::info('Search logged to Redis', [
                'type' => $normalizedType,
                'term' => $normalizedTerm,
                'count' => $currentCount,
                'response_time_ms' => $responseTimeMs,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log search to Redis', [
                'error' => $e->getMessage(),
                'type' => $searchType,
                'term' => $searchTerm,
            ]);
        }
    }
}
