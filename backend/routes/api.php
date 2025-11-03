<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StatisticsController;

Route::post('/search', [SearchController::class, 'search']);
Route::get('/people/{id}', [SearchController::class, 'getPerson']);
Route::get('/movies/{id}', [SearchController::class, 'getMovie']);
Route::get('/statistics', [StatisticsController::class, 'index']);

