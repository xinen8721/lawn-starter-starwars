<?php

namespace App\Http\Controllers;

use App\Services\SwapiService;
use App\Services\SearchLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{
    public function __construct(
        private SwapiService $swapiService,
        private SearchLogService $searchLogService
    ) {}

    /**
     * Search for people or movies
     */
    public function search(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:people,movies',
            'term' => 'required|string|min:2|max:100',
        ], [
            'type.required' => 'Search type is required',
            'type.in' => 'Search type must be either "people" or "movies"',
            'term.required' => 'Search term is required',
            'term.min' => 'Search term must be at least 2 characters',
            'term.max' => 'Search term must not exceed 100 characters',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $type = $request->input('type');
        // Sanitize input to prevent XSS
        $term = strip_tags($request->input('term'));

        $startTime = microtime(true);

        try {
            $results = $this->swapiService->search($type, $term);

            $responseTime = (int) ((microtime(true) - $startTime) * 1000);

            // Log the search
            $this->searchLogService->logSearch(
                $type,
                $term,
                count($results),
                $responseTime
            );

            // Format results
            $formattedResults = array_map(function ($item) use ($type) {
                return [
                    'id' => SwapiService::extractIdFromUrl($item['url']),
                    'name' => $item[$type === 'people' ? 'name' : 'title'],
                    'url' => $item['url'],
                ];
            }, $results);

            return response()->json([
                'type' => $type,
                'term' => $term,
                'count' => count($formattedResults),
                'results' => $formattedResults,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch results',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get person details
     */
    public function getPerson(int $id): JsonResponse
    {
        // Validate ID is positive
        if ($id < 1 || $id > 999999) {
            return response()->json([
                'error' => 'Invalid person ID',
                'message' => 'Person ID must be a positive integer'
            ], 422);
        }

        try {
            $person = $this->swapiService->getPerson($id);

            if (!$person) {
                return response()->json([
                    'error' => 'Person not found'
                ], 404);
            }

            // Extract film IDs
            $films = array_map(function ($filmUrl) {
                return [
                    'id' => SwapiService::extractIdFromUrl($filmUrl),
                    'url' => $filmUrl,
                ];
            }, $person['films'] ?? []);

            return response()->json([
                'id' => $id,
                'name' => $person['name'],
                'birth_year' => $person['birth_year'],
                'gender' => $person['gender'],
                'eye_color' => $person['eye_color'],
                'hair_color' => $person['hair_color'],
                'height' => $person['height'],
                'mass' => $person['mass'],
                'skin_color' => $person['skin_color'],
                'films' => $films,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch person',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get movie details
     */
    public function getMovie(int $id): JsonResponse
    {
        // Validate ID is positive
        if ($id < 1 || $id > 999999) {
            return response()->json([
                'error' => 'Invalid movie ID',
                'message' => 'Movie ID must be a positive integer'
            ], 422);
        }

        try {
            $movie = $this->swapiService->getFilm($id);

            if (!$movie) {
                return response()->json([
                    'error' => 'Movie not found'
                ], 404);
            }

            // Extract character IDs
            $characters = array_map(function ($characterUrl) {
                return [
                    'id' => SwapiService::extractIdFromUrl($characterUrl),
                    'url' => $characterUrl,
                ];
            }, $movie['characters'] ?? []);

            return response()->json([
                'id' => $id,
                'title' => $movie['title'],
                'episode_id' => $movie['episode_id'],
                'opening_crawl' => $movie['opening_crawl'],
                'director' => $movie['director'],
                'producer' => $movie['producer'],
                'release_date' => $movie['release_date'],
                'characters' => $characters,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch movie',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

