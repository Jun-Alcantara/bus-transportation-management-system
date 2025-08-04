<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SchoolYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SchoolYearController extends Controller
{
    /**
     * Display the school years management page.
     */
    public function index(): Response
    {
        $schoolYears = SchoolYear::with('terms')->orderBy('start_date', 'desc')->get();
        
        return Inertia::render('Settings/YearAndTerms', [
            'schoolYears' => $schoolYears,
        ]);
    }

    /**
     * Store a new school year.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:school_years,name',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        SchoolYear::create($validated);

        return redirect()->back()->with('success', 'School year created successfully.');
    }

    /**
     * Update a school year.
     */
    public function update(Request $request, SchoolYear $schoolYear)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:school_years,name,' . $schoolYear->id,
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        $schoolYear->update($validated);

        return redirect()->back()->with('success', 'School year updated successfully.');
    }

    /**
     * Set a school year as active.
     */
    public function setActive(SchoolYear $schoolYear)
    {
        $schoolYear->setAsActive();

        return redirect()->back()->with('success', 'School year set as active successfully.');
    }

    /**
     * Delete a school year.
     */
    public function destroy(SchoolYear $schoolYear)
    {
        if ($schoolYear->is_active) {
            return redirect()->back()->withErrors(['error' => 'Cannot delete the active school year.']);
        }

        $schoolYear->delete();

        return redirect()->back()->with('success', 'School year deleted successfully.');
    }
}