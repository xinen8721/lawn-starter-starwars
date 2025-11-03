<?php

use App\Services\StatisticsService;
use App\Services\SearchLogService;
use Illuminate\Support\Facades\Redis;

beforeEach(function () {
    Redis::flushdb();
    $this->service = new StatisticsService();
    $this->searchLogService = new SearchLogService();
});

afterEach(function () {
    Redis::flushdb();
});

test('calculateStatistics returns correct structure with no data', function () {
    $stats = $this->service->calculateStatistics();

    expect($stats)->toBeArray()
        ->and($stats)->toHaveKeys([
            'total_searches',
            'average_response_time',
            'top_queries',
            'popular_hours',
            'searches_by_type'
        ])
        ->and($stats['total_searches'])->toBe(0)
        ->and($stats['average_response_time'])->toBe(0.0);
});

test('calculateStatistics computes total searches correctly', function () {
    // Add test data
    $this->searchLogService->logSearch('people', 'Luke', 5, 250);
    $this->searchLogService->logSearch('people', 'Leia', 3, 180);
    $this->searchLogService->logSearch('movies', 'Hope', 2, 200);

    $stats = $this->service->calculateStatistics();

    expect($stats['total_searches'])->toBe(3);
});

test('calculateStatistics computes average response time', function () {
    $this->searchLogService->logSearch('people', 'Luke', 5, 200);
    $this->searchLogService->logSearch('people', 'Leia', 3, 400);

    $stats = $this->service->calculateStatistics();

    // Average should be (200 + 400) / 2 = 300
    expect($stats['average_response_time'])->toBe(300.0);
});

test('calculateStatistics returns top queries with percentages', function () {
    $this->searchLogService->logSearch('people', 'Luke', 5, 250);
    $this->searchLogService->logSearch('people', 'Luke', 3, 200);
    $this->searchLogService->logSearch('people', 'Leia', 2, 180);

    $stats = $this->service->calculateStatistics();

    expect($stats['top_queries'])->toBeArray()
        ->and(count($stats['top_queries']))->toBeGreaterThan(0);

    // Luke should be first with 2 searches (66.67%)
    $topQuery = $stats['top_queries'][0];
    expect($topQuery)->toHaveKeys(['term', 'count', 'percentage'])
        ->and($topQuery['term'])->toBe('Luke')
        ->and($topQuery['count'])->toBe(2);
});

test('calculateStatistics tracks searches by type', function () {
    $this->searchLogService->logSearch('people', 'Luke', 5, 250);
    $this->searchLogService->logSearch('people', 'Leia', 3, 180);
    $this->searchLogService->logSearch('movies', 'Hope', 2, 200);

    $stats = $this->service->calculateStatistics();

    expect($stats['searches_by_type'])->toHaveKey('people')
        ->and($stats['searches_by_type'])->toHaveKey('movies')
        ->and($stats['searches_by_type']['people'])->toBe(2)
        ->and($stats['searches_by_type']['movies'])->toBe(1);
});

test('calculateStatistics tracks popular hours', function () {
    $this->searchLogService->logSearch('people', 'Luke', 5, 250);
    $this->searchLogService->logSearch('people', 'Leia', 3, 180);

    $stats = $this->service->calculateStatistics();

    expect($stats['popular_hours'])->toBeArray()
        ->and(count($stats['popular_hours']))->toBeGreaterThan(0);

    // First hour should have count of 2
    $firstHour = $stats['popular_hours'][0];
    expect($firstHour)->toHaveKeys(['hour', 'count'])
        ->and($firstHour['count'])->toBe(2);
});

test('getLatestStatistics returns cached statistics', function () {
    // Calculate and cache statistics
    $this->searchLogService->logSearch('people', 'Luke', 5, 250);
    $this->service->calculateStatistics();

    // Get cached statistics
    $cached = $this->service->getLatestStatistics();

    expect($cached)->toBeArray()
        ->and($cached)->toHaveKey('data')
        ->and($cached['data'])->toHaveKey('total_searches');
});

test('top queries limited to 5', function () {
    // Add more than 5 different searches
    for ($i = 1; $i <= 10; $i++) {
        $this->searchLogService->logSearch('people', 'Person' . $i, 1, 200);
    }

    $stats = $this->service->calculateStatistics();

    expect(count($stats['top_queries']))->toBeLessThanOrEqual(5);
});

