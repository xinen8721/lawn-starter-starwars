<?php

use App\Http\Controllers\SearchController;
use App\Http\Controllers\StatisticsController;
use Illuminate\Support\Facades\Route;

// Search endpoints - 60 requests per minute
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/search', [SearchController::class, 'search']);
    Route::get('/people/{id}', [SearchController::class, 'getPerson']);
    Route::get('/movies/{id}', [SearchController::class, 'getMovie']);
});

// Statistics endpoint - 30 requests per minute
Route::middleware('throttle:30,1')->get('/statistics', [StatisticsController::class, 'index']);
