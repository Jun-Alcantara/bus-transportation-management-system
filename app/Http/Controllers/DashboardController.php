<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ],
            'activePeriod' => [
                'school_year' => active_school_year(),
                'school_term' => active_school_term(),
                'period_string' => active_period_string(),
                'has_active_period' => has_active_period()
            ]
        ]);
    }
}