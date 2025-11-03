<?php

use App\Jobs\CalculateStatistics;
use App\Services\SearchLogService;
use App\Services\StatisticsService;
use Illuminate\Support\Facades\Redis;

beforeEach(function () {
    Redis::flushdb();
    $this->searchLogService = new SearchLogService();
});

afterEach(function () {
    Redis::flushdb();
});

test('CalculateStatistics job runs successfully', function () {
    // Add some test data
    $this->searchLogService->logSearch('people', 'Luke', 5, 250);
    $this->searchLogService->logSearch('people', 'Leia', 3, 180);

    $statisticsService = new \App\Services\StatisticsService();
    $job = new CalculateStatistics();
    $job->handle($statisticsService);

    // Verify statistics were calculated
    $cached = \Illuminate\Support\Facades\Cache::get('statistics:latest');
    expect($cached)->not->toBeNull()
        ->and($cached)->toHaveKey('data')
        ->and($cached['data'])->toHaveKey('total_searches')
        ->and($cached['data']['total_searches'])->toBe(2);
});

test('CalculateStatistics job handles empty data', function () {
    $statisticsService = new \App\Services\StatisticsService();
    $job = new CalculateStatistics();
    $job->handle($statisticsService);

    $cached = \Illuminate\Support\Facades\Cache::get('statistics:latest');
    expect($cached)->not->toBeNull()
        ->and($cached['data']['total_searches'])->toBe(0);
});

test('CalculateStatistics job caches results', function () {
    $statisticsService = new \App\Services\StatisticsService();
    $job = new CalculateStatistics();
    $job->handle($statisticsService);

    $cached = \Illuminate\Support\Facades\Cache::get('statistics:latest');
    expect($cached)->toHaveKey('calculated_at')
        ->and($cached)->toHaveKey('cached_at');
});

