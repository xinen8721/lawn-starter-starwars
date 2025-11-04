<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class SwapiService
{
    private Client $client;
    private string $baseUrl;

    /** Cache TTL: 24 hours (SWAPI data rarely changes) */
    const CACHE_TTL = 86400;

    public function __construct()
    {
        $this->baseUrl = env('SWAPI_BASE_URL', 'https://swapi.dev/api');
        // Ensure base_uri ends with a slash for Guzzle
        $baseUri = rtrim($this->baseUrl, '/') . '/';
        $this->client = new Client([
            'base_uri' => $baseUri,
            'timeout' => 10,
        ]);
    }

    /**
     * Search for people or films (with 24-hour cache)
     */
    public function search(string $type, string $term): array
    {
        // Generate cache key from search parameters
        $cacheKey = "swapi:search:{$type}:" . md5(strtolower($term));

        // Try to get from cache first
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            Log::debug('SWAPI search cache hit', ['type' => $type, 'term' => $term]);
            return $cached;
        }

        try {
            $endpoint = $type === 'people' ? 'people/' : 'films/';
            $response = $this->client->get($endpoint, [
                'query' => ['search' => $term]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            $results = $data['results'] ?? [];

            // Cache the results for 24 hours
            Cache::put($cacheKey, $results, self::CACHE_TTL);
            Log::debug('SWAPI search cached', ['type' => $type, 'term' => $term]);

            return $results;
        } catch (GuzzleException $e) {
            Log::error('SWAPI search error', [
                'type' => $type,
                'term' => $term,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get person by ID (with 24-hour cache)
     */
    public function getPerson(int $id): ?array
    {
        $cacheKey = "swapi:people:{$id}";

        // Try to get from cache first
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            Log::debug('SWAPI person cache hit', ['id' => $id]);
            return $cached;
        }

        try {
            $response = $this->client->get("people/{$id}/");
            $person = json_decode($response->getBody()->getContents(), true);

            // Cache the result for 24 hours
            Cache::put($cacheKey, $person, self::CACHE_TTL);
            Log::debug('SWAPI person cached', ['id' => $id]);

            return $person;
        } catch (GuzzleException $e) {
            Log::error('SWAPI get person error', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Get film by ID (with 24-hour cache)
     */
    public function getFilm(int $id): ?array
    {
        $cacheKey = "swapi:films:{$id}";

        // Try to get from cache first
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            Log::debug('SWAPI film cache hit', ['id' => $id]);
            return $cached;
        }

        try {
            $response = $this->client->get("films/{$id}/");
            $film = json_decode($response->getBody()->getContents(), true);

            // Cache the result for 24 hours
            Cache::put($cacheKey, $film, self::CACHE_TTL);
            Log::debug('SWAPI film cached', ['id' => $id]);

            return $film;
        } catch (GuzzleException $e) {
            Log::error('SWAPI get film error', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Extract ID from SWAPI URL
     */
    public static function extractIdFromUrl(string $url): ?int
    {
        // URL format: https://swapi.dev/api/people/1/
        preg_match('/\/(\d+)\/$/', $url, $matches);
        return isset($matches[1]) ? (int) $matches[1] : null;
    }
}

