<?php

use App\Services\SearchLogService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;

beforeEach(function () {
    // Mock SearchLogService to avoid Redis dependency
    $mockSearchLogService = Mockery::mock(SearchLogService::class);
    $mockSearchLogService->shouldReceive('logSearch')->andReturnNull();
    $this->app->instance(SearchLogService::class, $mockSearchLogService);
});

test('search handles empty term validation', function () {
    $response = $this->postJson('/api/search', [
        'type' => 'people',
        'term' => '',
    ]);

    $response->assertStatus(422)
        ->assertJsonStructure([
            'error',
            'messages' => ['term'],
        ]);
});

test('search handles missing type validation', function () {
    $response = $this->postJson('/api/search', [
        'term' => 'Luke',
    ]);

    $response->assertStatus(422)
        ->assertJsonStructure([
            'error',
            'messages' => ['type'],
        ]);
});

test('search handles invalid type validation', function () {
    $response = $this->postJson('/api/search', [
        'type' => 'invalid',
        'term' => 'test',
    ]);

    $response->assertStatus(422)
        ->assertJsonStructure([
            'error',
            'messages' => ['type'],
        ]);
});

test('search handles very long search term', function () {
    $longTerm = str_repeat('a', 150);

    $response = $this->postJson('/api/search', [
        'type' => 'people',
        'term' => $longTerm,
    ]);

    $response->assertStatus(422)
        ->assertJsonStructure([
            'error',
            'messages' => ['term'],
        ]);
});

test('person endpoint returns 404 for invalid id', function () {
    Http::fake([
        'https://swapi.dev/api/people/99999' => Http::response([
            'detail' => 'Not found',
        ], 404),
    ]);

    $response = $this->getJson('/api/people/99999');

    $response->assertStatus(404);
});

test('person endpoint returns correct data structure', function () {
    Http::fake([
        'https://swapi.dev/api/people/1' => Http::response([
            'name' => 'Luke Skywalker',
            'height' => '172',
            'mass' => '77',
            'hair_color' => 'blond',
            'skin_color' => 'fair',
            'eye_color' => 'blue',
            'birth_year' => '19BBY',
            'gender' => 'male',
            'homeworld' => 'https://swapi.dev/api/planets/1/',
            'films' => ['https://swapi.dev/api/films/1/'],
            'species' => [],
            'vehicles' => [],
            'starships' => [],
            'url' => 'https://swapi.dev/api/people/1/',
        ], 200),
    ]);

    $response = $this->getJson('/api/people/1');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'id',
            'name',
            'birth_year',
            'gender',
            'eye_color',
            'hair_color',
            'height',
            'mass',
            'skin_color',
            'films' => [
                '*' => ['id', 'url'],
            ],
        ]);
});

test('movie endpoint returns 404 for invalid id', function () {
    Http::fake([
        'https://swapi.dev/api/films/99999' => Http::response([
            'detail' => 'Not found',
        ], 404),
    ]);

    $response = $this->getJson('/api/movies/99999');

    $response->assertStatus(404);
});

test('movie endpoint returns correct data structure', function () {
    Http::fake([
        'https://swapi.dev/api/films/1' => Http::response([
            'title' => 'A New Hope',
            'episode_id' => 4,
            'opening_crawl' => 'It is a period of civil war...',
            'director' => 'George Lucas',
            'producer' => 'Gary Kurtz, Rick McCallum',
            'release_date' => '1977-05-25',
            'characters' => ['https://swapi.dev/api/people/1/'],
            'planets' => [],
            'starships' => [],
            'vehicles' => [],
            'species' => [],
            'url' => 'https://swapi.dev/api/films/1/',
        ], 200),
    ]);

    $response = $this->getJson('/api/movies/1');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'id',
            'title',
            'episode_id',
            'opening_crawl',
            'director',
            'producer',
            'release_date',
            'characters' => [
                '*' => ['id', 'url'],
            ],
        ]);
});

test('search returns empty results for non-existent term', function () {
    Http::fake([
        'https://swapi.dev/api/people/*' => Http::response([
            'results' => [],
        ], 200),
    ]);

    $response = $this->postJson('/api/search', [
        'type' => 'people',
        'term' => 'NonExistentCharacter12345',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'results' => [],
        ]);
});

test('search logs metrics for successful search', function () {
    // Mock SearchLogService to verify it's called with correct parameters
    $mockSearchLogService = Mockery::mock(SearchLogService::class);
    $mockSearchLogService->shouldReceive('logSearch')
        ->once()
        ->withArgs(function ($type, $term, $count, $responseTime) {
            return $type === 'people'
                && $term === 'Luke'
                && $count === 1
                && is_numeric($responseTime);
        });
    $this->app->instance(SearchLogService::class, $mockSearchLogService);

    Http::fake([
        'https://swapi.dev/api/people/*' => Http::response([
            'results' => [
                ['name' => 'Luke Skywalker', 'url' => 'https://swapi.dev/api/people/1/'],
            ],
        ], 200),
    ]);

    $response = $this->postJson('/api/search', [
        'type' => 'people',
        'term' => 'Luke',
    ]);

    $response->assertStatus(200);
});
