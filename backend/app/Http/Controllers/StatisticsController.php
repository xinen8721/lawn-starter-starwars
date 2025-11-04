<?php

namespace App\Http\Controllers;

use App\Services\StatisticsService;
use Illuminate\Http\JsonResponse;

class StatisticsController extends Controller
{
    public function __construct(
        private StatisticsService $statisticsService
    ) {}

    /**
     * Get latest statistics
     */
    public function index(): JsonResponse
    {
        try {
            $statistics = $this->statisticsService->getLatestStatistics();

            return response()->json($statistics);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch statistics',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
