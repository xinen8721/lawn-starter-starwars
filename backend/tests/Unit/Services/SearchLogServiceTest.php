<?php

use App\Services\SearchLogService;
use Illuminate\Support\Facades\Redis;

beforeEach(function () {
    Redis::flushdb();
    $this->service = new SearchLogService();
});

afterEach(function () {
    Redis::flushdb();
});

test('logSearch stores search data in Redis', function () {
    $this->service->logSearch('people', 'Luke', 5, 250);

    // Verify top searches are tracked
    $topSearches = Redis::zrevrange('search:people:top', 0, -1, ['WITHSCORES' => true]);
    expect($topSearches)->toHaveKey('Luke');

    // Verify type count is incremented
    $typeCount = Redis::get('search:type:people:count');
    expect($typeCount)->toBe('1');
});

test('logSearch increments search count for repeated searches', function () {
    $this->service->logSearch('people', 'Luke', 5, 250);
    $this->service->logSearch('people', 'Luke', 3, 180);

    $topSearches = Redis::zrevrange('search:people:top', 0, -1, ['WITHSCORES' => true]);

    // The score should be 2 (two searches)
    expect($topSearches)->toHaveKey('Luke')
        ->and($topSearches['Luke'])->toBe('2');
});

test('logSearch tracks searches by type', function () {
    $this->service->logSearch('people', 'Luke', 5, 250);
    $this->service->logSearch('movies', 'Hope', 3, 180);

    $peopleCount = Redis::get('search:type:people:count');
    $moviesCount = Redis::get('search:type:movies:count');

    expect($peopleCount)->toBe('1')
        ->and($moviesCount)->toBe('1');
});

test('logSearch stores response time data in metadata', function () {
    $this->service->logSearch('people', 'Luke', 5, 250);

    // Verify response times are tracked in meta hash
    $metaKey = 'search:people:Luke:meta';
    $totalResponseTime = Redis::hget($metaKey, 'total_response_time');
    expect($totalResponseTime)->toBe('250');
});

test('logSearch tracks searches by hour', function () {
    $this->service->logSearch('people', 'Luke', 5, 250);

    $hour = date('H');
    $hourKey = "search:hours:{$hour}";
    $hourCount = Redis::get($hourKey);

    expect($hourCount)->toBe('1');
});

test('multiple searches aggregate correctly', function () {
    $this->service->logSearch('people', 'Luke', 5, 250);
    $this->service->logSearch('people', 'Leia', 3, 180);
    $this->service->logSearch('people', 'Luke', 2, 200);

    $peopleCount = Redis::get('search:type:people:count');
    expect($peopleCount)->toBe('3');

    $topSearches = Redis::zrevrange('search:people:top', 0, -1, ['WITHSCORES' => true]);
    // Luke should have count of 2, Leia should have count of 1
    expect($topSearches)->toHaveKey('Luke')
        ->and($topSearches['Luke'])->toBe('2')
        ->and($topSearches)->toHaveKey('Leia')
        ->and($topSearches['Leia'])->toBe('1');
});

