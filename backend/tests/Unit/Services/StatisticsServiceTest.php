<?php

use App\Services\StatisticsService;
use App\Services\SearchLogService;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    $this->service = new StatisticsService();
});

test('calculateStatistics returns correct structure with no data', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('get')->andReturn(null);
    Redis::shouldReceive('zrevrange')->andReturn([]);
    Cache::shouldReceive('put')->once();

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
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('get')->andReturnUsing(function ($key) {
        if ($key === 'search:type:people:count') return '2';
        if ($key === 'search:type:movies:count') return '1';
        return '0';
    });
    Redis::shouldReceive('zrevrange')->andReturn([]);
    Cache::shouldReceive('put')->once();

    $stats = $this->service->calculateStatistics();

    expect($stats['total_searches'])->toBe(3);
});

test('calculateStatistics computes average response time', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('get')->andReturnUsing(function ($key) {
        return '0'; // Return 0 for type counts and hour counts
    });
    Redis::shouldReceive('zrevrange')->andReturnUsing(function ($key, $start, $end, $options = []) {
        // For getTopQueries (with WITHSCORES)
        if (!empty($options) && isset($options['WITHSCORES'])) {
            return []; // No top queries
        }
        // For getAverageResponseTime (without WITHSCORES)
        if ($key === 'search:people:top') {
            return ['Luke', 'Leia'];
        }
        return [];
    });
    Redis::shouldReceive('hgetall')->andReturnUsing(function ($key) {
        if ($key === 'search:people:Luke:meta') {
            return ['total_response_time' => '200', 'count' => '1'];
        }
        if ($key === 'search:people:Leia:meta') {
            return ['total_response_time' => '400', 'count' => '1'];
        }
        return [];
    });
    Cache::shouldReceive('put')->once();

    $stats = $this->service->calculateStatistics();

    // Average should be (200 + 400) / 2 = 300
    expect($stats['average_response_time'])->toBe(300.0);
});

test('calculateStatistics returns top queries with percentages', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('get')->andReturnUsing(function ($key) {
        if ($key === 'search:type:people:count') return '3';
        if ($key === 'search:type:movies:count') return '0';
        return '0';
    });
    Redis::shouldReceive('zrevrange')->andReturnUsing(function ($key, $start, $end, $options = []) {
        // For getTopQueries (with WITHSCORES)
        if (!empty($options) && isset($options['WITHSCORES'])) {
            if ($key === 'search:people:top') {
                return ['Luke' => 2, 'Leia' => 1];
            }
            return [];
        }
        // For getAverageResponseTime (without WITHSCORES)
        if ($key === 'search:people:top') {
            return ['Luke', 'Leia'];
        }
        return [];
    });
    Redis::shouldReceive('hgetall')
        ->andReturn(['total_response_time' => '0', 'count' => '0']);
    Cache::shouldReceive('put')->once();

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
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('get')->andReturnUsing(function ($key) {
        if ($key === 'search:type:people:count') return '2';
        if ($key === 'search:type:movies:count') return '1';
        return '0';
    });
    Redis::shouldReceive('zrevrange')->andReturn([]);
    Cache::shouldReceive('put')->once();

    $stats = $this->service->calculateStatistics();

    expect($stats['searches_by_type'])->toHaveKey('people')
        ->and($stats['searches_by_type'])->toHaveKey('movies')
        ->and($stats['searches_by_type']['people'])->toBe(2)
        ->and($stats['searches_by_type']['movies'])->toBe(1);
});

test('calculateStatistics tracks popular hours', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('get')->andReturnUsing(function ($key) {
        // Return count for current hour
        if (str_starts_with($key, 'search:hours:')) {
            $hour = (int) now()->format('H');
            if ($key === "search:hours:" . str_pad($hour, 2, '0', STR_PAD_LEFT)) {
                return '2';
            }
        }
        return '0';
    });
    Redis::shouldReceive('zrevrange')->andReturn([]);
    Cache::shouldReceive('put')->once();

    $stats = $this->service->calculateStatistics();

    expect($stats['popular_hours'])->toBeArray()
        ->and(count($stats['popular_hours']))->toBeGreaterThan(0);

    // First hour should have count of 2
    $firstHour = $stats['popular_hours'][0];
    expect($firstHour)->toHaveKeys(['hour', 'count'])
        ->and($firstHour['count'])->toBe(2);
});

test('getLatestStatistics returns cached statistics', function () {
    $cachedData = [
        'data' => [
            'total_searches' => 1,
            'average_response_time' => 250.0,
            'top_queries' => [],
            'popular_hours' => [],
            'searches_by_type' => []
        ],
        'calculated_at' => now()->toISOString(),
        'cached_at' => now()->toISOString()
    ];

    Cache::shouldReceive('get')
        ->with('statistics:latest')
        ->andReturn($cachedData);

    $cached = $this->service->getLatestStatistics();

    expect($cached)->toBeArray()
        ->and($cached)->toHaveKey('data')
        ->and($cached['data'])->toHaveKey('total_searches');
});

test('top queries limited to 5', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('get')->andReturnUsing(function ($key) {
        if ($key === 'search:type:people:count') return '10';
        if ($key === 'search:type:movies:count') return '0';
        return '0';
    });
    Redis::shouldReceive('zrevrange')->andReturnUsing(function ($key, $start, $end, $options = []) {
        // For getTopQueries (with WITHSCORES)
        if (!empty($options) && isset($options['WITHSCORES'])) {
            if ($key === 'search:people:top') {
                return [
                    'Person1' => 10, 'Person2' => 9, 'Person3' => 8,
                    'Person4' => 7, 'Person5' => 6
                ];
            }
            return [];
        }
        // For getAverageResponseTime (without WITHSCORES)
        return [];
    });
    Redis::shouldReceive('hgetall')->andReturn([]);
    Cache::shouldReceive('put')->once();

    $stats = $this->service->calculateStatistics();

    expect(count($stats['top_queries']))->toBeLessThanOrEqual(5);
});

