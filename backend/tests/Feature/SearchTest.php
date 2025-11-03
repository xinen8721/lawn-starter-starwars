<?php

use Illuminate\Support\Facades\Redis;

beforeEach(function () {
    // Clear Redis test data before each test
    Redis::flushdb();
});

test('search endpoint returns successful response for people', function () {
    $response = $this->postJson('/api/search', [
        'type' => 'people',
        'term' => 'Luke',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'results' => [
                '*' => ['id', 'name']
            ]
        ]);
});

test('search endpoint returns successful response for movies', function () {
    $response = $this->postJson('/api/search', [
        'type' => 'movies',
        'term' => 'Empire',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'results' => [
                '*' => ['id', 'name']
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
    $response = $this->getJson('/api/statistics');

    $response->assertStatus(200);

    // Statistics might be null if no searches have been made yet
    // Just verify the response is successful
    expect($response->json())->toBeArray();
});

