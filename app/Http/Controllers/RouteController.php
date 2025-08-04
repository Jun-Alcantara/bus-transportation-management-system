<?php

namespace App\Http\Controllers;

use App\Models\Route;
use App\Models\District;
use App\Models\Run;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Route::with(['schoolYear', 'schoolTerm', 'district', 'runs', 'createdBy', 'updatedBy']);

        // Search
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('district', function ($districtQuery) use ($search) {
                      $districtQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        
        $allowedSorts = ['name', 'code', 'status', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('name', 'asc');
        }

        // Pagination
        $routes = $query->paginate(10)->withQueryString();

        return Inertia::render('Routes/Index', [
            'routes' => $routes,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort' => $sortField,
                'direction' => $sortDirection,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $districts = District::orderBy('name')->get();
        
        return Inertia::render('Routes/Create', [
            'districts' => $districts,
            'activeSchoolYear' => active_school_year(),
            'activeSchoolTerm' => active_school_term(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:routes,code',
            'district_id' => 'required|exists:districts,id',
            'description' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
            'date_activated' => 'nullable|date',
            'date_deactivated' => 'nullable|date',
            'runs' => 'array',
            'runs.*.run_code' => 'required|string|max:255',
            'runs.*.status' => 'required|string|in:active,inactive',
            'runs.*.date_activated' => 'nullable|date',
            'runs.*.date_deactivated' => 'nullable|date',
        ]);

        $route = Route::create([
            'school_year_id' => active_school_year()->id,
            'school_term_id' => active_school_term()->id,
            'district_id' => $validated['district_id'],
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'date_activated' => $validated['date_activated'],
            'date_deactivated' => $validated['date_deactivated'],
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        // Create runs if provided
        if (!empty($validated['runs'])) {
            foreach ($validated['runs'] as $runData) {
                Run::create([
                    'school_year_id' => active_school_year()->id,
                    'school_term_id' => active_school_term()->id,
                    'route_id' => $route->id,
                    'run_code' => $runData['run_code'],
                    'status' => $runData['status'],
                    'date_activated' => $runData['date_activated'] ?? null,
                    'date_deactivated' => $runData['date_deactivated'] ?? null,
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]);
            }
        }

        return redirect()->route('routes.index')
            ->with('success', 'Route created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Route $route)
    {
        $route->load(['schoolYear', 'schoolTerm', 'district', 'runs', 'createdBy', 'updatedBy']);
        
        return Inertia::render('Routes/Show', [
            'route' => $route,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Route $route)
    {
        $route->load(['runs']);
        $districts = District::orderBy('name')->get();
        
        return Inertia::render('Routes/Edit', [
            'route' => $route,
            'districts' => $districts,
            'activeSchoolYear' => active_school_year(),
            'activeSchoolTerm' => active_school_term(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Route $route)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:routes,code,' . $route->id,
            'district_id' => 'required|exists:districts,id',
            'description' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
            'date_activated' => 'nullable|date',
            'date_deactivated' => 'nullable|date',
            'runs' => 'array',
            'runs.*.id' => 'nullable|exists:runs,id',
            'runs.*.run_code' => 'required|string|max:255',
            'runs.*.status' => 'required|string|in:active,inactive',
            'runs.*.date_activated' => 'nullable|date',
            'runs.*.date_deactivated' => 'nullable|date',
        ]);

        $route->update([
            'district_id' => $validated['district_id'],
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'date_activated' => $validated['date_activated'],
            'date_deactivated' => $validated['date_deactivated'],
            'updated_by' => auth()->id(),
        ]);

        // Handle runs updates
        if (!empty($validated['runs'])) {
            $submittedRunIds = [];
            
            foreach ($validated['runs'] as $runData) {
                if (isset($runData['id'])) {
                    // Update existing run
                    $run = Run::find($runData['id']);
                    if ($run && $run->route_id == $route->id) {
                        $run->update([
                            'run_code' => $runData['run_code'],
                            'status' => $runData['status'],
                            'date_activated' => $runData['date_activated'] ?? null,
                            'date_deactivated' => $runData['date_deactivated'] ?? null,
                            'updated_by' => auth()->id(),
                        ]);
                        $submittedRunIds[] = $run->id;
                    }
                } else {
                    // Create new run
                    $newRun = Run::create([
                        'school_year_id' => $route->school_year_id,
                        'school_term_id' => $route->school_term_id,
                        'route_id' => $route->id,
                        'run_code' => $runData['run_code'],
                        'status' => $runData['status'],
                        'date_activated' => $runData['date_activated'] ?? null,
                        'date_deactivated' => $runData['date_deactivated'] ?? null,
                        'created_by' => auth()->id(),
                        'updated_by' => auth()->id(),
                    ]);
                    $submittedRunIds[] = $newRun->id;
                }
            }
            
            // Delete runs that were not submitted
            $route->runs()->whereNotIn('id', $submittedRunIds)->delete();
        } else {
            // Delete all runs if none submitted
            $route->runs()->delete();
        }

        return redirect()->route('routes.index')
            ->with('success', 'Route updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Route $route)
    {
        $route->delete();

        return redirect()->route('routes.index')
            ->with('success', 'Route deleted successfully.');
    }
}
