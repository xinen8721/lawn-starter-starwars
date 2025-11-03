<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class SwapiService
{
    private Client $client;
    private string $baseUrl;

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
     * Search for people or films
     */
    public function search(string $type, string $term): array
    {
        try {
            $endpoint = $type === 'people' ? 'people/' : 'films/';
            $response = $this->client->get($endpoint, [
                'query' => ['search' => $term]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            return $data['results'] ?? [];
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
     * Get person by ID
     */
    public function getPerson(int $id): ?array
    {
        try {
            $response = $this->client->get("people/{$id}/");
            return json_decode($response->getBody()->getContents(), true);
        } catch (GuzzleException $e) {
            Log::error('SWAPI get person error', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Get film by ID
     */
    public function getFilm(int $id): ?array
    {
        try {
            $response = $this->client->get("films/{$id}/");
            return json_decode($response->getBody()->getContents(), true);
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

