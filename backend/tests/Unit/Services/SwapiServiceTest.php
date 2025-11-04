<?php

use App\Services\SwapiService;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->service = new SwapiService;
});

test('search people returns results from SWAPI', function () {
    Http::fake([
        'https://swapi.dev/api/people/*' => Http::response([
            'results' => [
                ['name' => 'Luke Skywalker', 'url' => 'https://swapi.dev/api/people/1/'],
                ['name' => 'Leia Organa', 'url' => 'https://swapi.dev/api/people/5/'],
            ],
        ], 200),
    ]);

    $results = $this->service->search('people', 'Luke');

    expect($results)->toBeArray()
        ->and(count($results))->toBeGreaterThan(0)
        ->and($results[0])->toHaveKey('name')
        ->and($results[0])->toHaveKey('url');
});

test('search movies returns results from SWAPI', function () {
    Http::fake([
        'https://swapi.dev/api/films/*' => Http::response([
            'results' => [
                ['title' => 'A New Hope', 'url' => 'https://swapi.dev/api/films/1/'],
            ],
        ], 200),
    ]);

    $results = $this->service->search('movies', 'Hope');

    expect($results)->toBeArray()
        ->and(count($results))->toBeGreaterThan(0)
        ->and($results[0])->toHaveKey('title')
        ->and($results[0])->toHaveKey('url');
});

test('search returns URL with ID', function () {
    Http::fake([
        'https://swapi.dev/api/people/*' => Http::response([
            'results' => [
                ['name' => 'Luke Skywalker', 'url' => 'https://swapi.dev/api/people/1/'],
            ],
        ], 200),
    ]);

    $results = $this->service->search('people', 'Luke');

    expect($results[0]['url'])->toContain('/people/1/');
});

test('getPerson returns person details', function () {
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
            'films' => [],
            'species' => [],
            'vehicles' => [],
            'starships' => [],
            'url' => 'https://swapi.dev/api/people/1/',
        ], 200),
    ]);

    $person = $this->service->getPerson(1);

    expect($person)->toBeArray()
        ->and($person)->toHaveKey('name')
        ->and($person['name'])->toBe('Luke Skywalker');
});

test('getFilm returns film details', function () {
    Http::fake([
        'https://swapi.dev/api/films/1' => Http::response([
            'title' => 'A New Hope',
            'episode_id' => 4,
            'opening_crawl' => 'It is a period of civil war...',
            'director' => 'George Lucas',
            'producer' => 'Gary Kurtz, Rick McCallum',
            'release_date' => '1977-05-25',
            'characters' => [],
            'planets' => [],
            'starships' => [],
            'vehicles' => [],
            'species' => [],
            'url' => 'https://swapi.dev/api/films/1/',
        ], 200),
    ]);

    $film = $this->service->getFilm(1);

    expect($film)->toBeArray()
        ->and($film)->toHaveKey('title')
        ->and($film['title'])->toBe('A New Hope');
});

test('search handles empty results', function () {
    Http::fake([
        'https://swapi.dev/api/people/*' => Http::response([
            'results' => [],
        ], 200),
    ]);

    $results = $this->service->search('people', 'NonExistent');

    expect($results)->toBeArray()
        ->and(count($results))->toBe(0);
});
