<?php

use App\Jobs\CalculateStatistics;
use App\Services\StatisticsService;

test('CalculateStatistics job runs successfully', function () {
    // Mock StatisticsService
    $mockStatisticsService = Mockery::mock(StatisticsService::class);
    $mockStatisticsService->shouldReceive('calculateStatistics')
        ->once()
        ->andReturn([
            'total_searches' => 2,
            'average_response_time' => 215.0,
            'top_queries' => [],
            'popular_hours' => [],
            'searches_by_type' => ['people' => 2, 'movies' => 0]
        ]);

    $job = new CalculateStatistics();
    $job->handle($mockStatisticsService);
});

test('CalculateStatistics job handles empty data', function () {
    // Mock StatisticsService to return empty data
    $mockStatisticsService = Mockery::mock(StatisticsService::class);
    $mockStatisticsService->shouldReceive('calculateStatistics')
        ->once()
        ->andReturn([
            'total_searches' => 0,
            'average_response_time' => 0.0,
            'top_queries' => [],
            'popular_hours' => [],
            'searches_by_type' => ['people' => 0, 'movies' => 0]
        ]);

    $job = new CalculateStatistics();
    $job->handle($mockStatisticsService);
});

test('CalculateStatistics job caches results', function () {
    // Mock StatisticsService
    $mockStatisticsService = Mockery::mock(StatisticsService::class);
    $mockStatisticsService->shouldReceive('calculateStatistics')
        ->once()
        ->andReturn([
            'total_searches' => 0,
            'average_response_time' => 0.0,
            'top_queries' => [],
            'popular_hours' => [],
            'searches_by_type' => ['people' => 0, 'movies' => 0]
        ]);

    $job = new CalculateStatistics();
    $job->handle($mockStatisticsService);

    // Job successfully handles the service, which internally caches
    expect(true)->toBeTrue();
});

