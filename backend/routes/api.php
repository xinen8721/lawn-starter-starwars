<?php

use App\Http\Controllers\SearchController;
use App\Http\Controllers\StatisticsController;
use Illuminate\Support\Facades\Route;

// Search endpoints - 1000 requests per minute (very relaxed for demo)
Route::middleware('throttle:1000,1')->group(function () {
    Route::post('/search', [SearchController::class, 'search']);
    Route::get('/people/{id}', [SearchController::class, 'getPerson']);
    Route::get('/movies/{id}', [SearchController::class, 'getMovie']);
});

// Statistics endpoint - 1000 requests per minute (very relaxed for demo)
Route::middleware('throttle:1000,1')->get('/statistics', [StatisticsController::class, 'index']);
