<?php

use Illuminate\Support\Facades\Http;

test('search endpoint returns successful response for people', function () {
    // Mock SWAPI response
    Http::fake([
        'https://swapi.dev/api/people/*' => Http::response([
            'results' => [
                ['name' => 'Luke Skywalker', 'url' => 'https://swapi.dev/api/people/1/']
            ]
        ], 200)
    ]);

    $response = $this->postJson('/api/search', [
        'type' => 'people',
        'term' => 'Luke',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'type',
            'term',
            'count',
            'results' => [
                '*' => ['id', 'name', 'url']
            ]
        ]);
});

test('search endpoint returns successful response for movies', function () {
    // Mock SWAPI response
    Http::fake([
        'https://swapi.dev/api/films/*' => Http::response([
            'results' => [
                ['title' => 'The Empire Strikes Back', 'url' => 'https://swapi.dev/api/films/2/']
            ]
        ], 200)
    ]);

    $response = $this->postJson('/api/search', [
        'type' => 'movies',
        'term' => 'Empire',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'type',
            'term',
            'count',
            'results' => [
                '*' => ['id', 'name', 'url']
            ]
        ]);
});

test('search endpoint validates required fields', function () {
    $response = $this->postJson('/api/search', []);

    $response->assertStatus(422)
        ->assertJsonStructure([
            'error',
            'messages' => [
                'type',
                'term'
            ]
        ]);
});

test('statistics endpoint returns data', function () {
    // Mock StatisticsService to avoid Redis dependency
    $mockStatisticsService = Mockery::mock(\App\Services\StatisticsService::class);
    $mockStatisticsService->shouldReceive('getLatestStatistics')
        ->once()
        ->andReturn([
            'data' => [
                'total_searches' => 100,
                'average_response_time' => 150.5,
                'top_queries' => [
                    ['term' => 'Luke', 'count' => 50, 'percentage' => 50.0],
                    ['term' => 'Vader', 'count' => 30, 'percentage' => 30.0],
                ],
                'popular_hours' => [
                    ['hour' => 14, 'count' => 25],
                    ['hour' => 10, 'count' => 20],
                ],
                'searches_by_type' => [
                    'people' => 60,
                    'movies' => 40,
                ],
            ],
            'calculated_at' => now()->toISOString(),
            'calculation_time_ms' => 5.2,
            'cached_at' => now()->toISOString(),
            'cache_miss' => false,
        ]);

    // Bind the mock to the service container
    $this->app->instance(\App\Services\StatisticsService::class, $mockStatisticsService);

    $response = $this->getJson('/api/statistics');

    // Statistics endpoint should return 200
    $response->assertStatus(200);

    // Verify response structure
    $data = $response->json();
    expect($data)->toBeArray();

    // Should have the 'data' key with statistics structure
    expect($data)->toHaveKey('data');
    expect($data['data'])->toHaveKeys([
        'total_searches',
        'average_response_time',
        'top_queries',
        'popular_hours',
        'searches_by_type'
    ]);

    // Verify data values
    expect($data['data']['total_searches'])->toBe(100);
    expect($data['data']['average_response_time'])->toBe(150.5);
    expect($data['data']['top_queries'])->toHaveCount(2);
    expect($data['data']['searches_by_type'])->toHaveKeys(['people', 'movies']);
});

