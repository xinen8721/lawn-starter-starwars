<?php

use App\Services\SearchLogService;
use Illuminate\Support\Facades\Redis;

beforeEach(function () {
    $this->service = new SearchLogService();
});

test('logSearch stores search data in Redis', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('zincrby')->once()->with('search:people:top', 1, 'Luke');
    Redis::shouldReceive('expire')->times(4); // Called 4 times: top, meta, hour, type
    Redis::shouldReceive('hincrby')->twice()->andReturn(1, 250);
    Redis::shouldReceive('hset')->twice();
    Redis::shouldReceive('incr')->twice();
    
    $this->service->logSearch('people', 'Luke', 5, 250);
});

test('logSearch increments search count for repeated searches', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('zincrby')->twice();
    Redis::shouldReceive('expire')->times(8);
    Redis::shouldReceive('hincrby')->times(4)->andReturn(1, 250, 2, 430);
    Redis::shouldReceive('hset')->times(4);
    Redis::shouldReceive('incr')->times(4);
    
    $this->service->logSearch('people', 'Luke', 5, 250);
    $this->service->logSearch('people', 'Luke', 3, 180);
});

test('logSearch tracks searches by type', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('zincrby')->twice();
    Redis::shouldReceive('expire')->times(8);
    Redis::shouldReceive('hincrby')->times(4)->andReturn(1, 250, 1, 180);
    Redis::shouldReceive('hset')->times(4);
    Redis::shouldReceive('incr')->times(4);
    
    $this->service->logSearch('people', 'Luke', 5, 250);
    $this->service->logSearch('movies', 'Hope', 3, 180);
});

test('logSearch stores response time data in metadata', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('zincrby')->once();
    Redis::shouldReceive('expire')->times(4);
    Redis::shouldReceive('hincrby')
        ->once()
        ->with('search:people:Luke:meta', 'count', 1)
        ->andReturn(1);
    Redis::shouldReceive('hincrby')
        ->once()
        ->with('search:people:Luke:meta', 'total_response_time', 250)
        ->andReturn(250);
    Redis::shouldReceive('hset')->twice();
    Redis::shouldReceive('incr')->twice();
    
    $this->service->logSearch('people', 'Luke', 5, 250);
});

test('logSearch tracks searches by hour', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('zincrby')->once();
    Redis::shouldReceive('expire')->times(4);
    Redis::shouldReceive('hincrby')->twice()->andReturn(1, 250);
    Redis::shouldReceive('hset')->twice();
    Redis::shouldReceive('incr')->twice();
    
    $this->service->logSearch('people', 'Luke', 5, 250);
});

test('multiple searches aggregate correctly', function () {
    Redis::shouldReceive('connection')->andReturnSelf();
    Redis::shouldReceive('zincrby')->times(3);
    Redis::shouldReceive('expire')->times(12);
    Redis::shouldReceive('hincrby')->times(6)->andReturn(1, 250, 1, 180, 2, 450);
    Redis::shouldReceive('hset')->times(6);
    Redis::shouldReceive('incr')->times(6);
    
    $this->service->logSearch('people', 'Luke', 5, 250);
    $this->service->logSearch('people', 'Leia', 3, 180);
    $this->service->logSearch('people', 'Luke', 2, 200);
});

