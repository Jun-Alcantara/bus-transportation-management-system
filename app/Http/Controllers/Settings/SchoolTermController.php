<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SchoolTerm;
use App\Models\SchoolYear;
use Illuminate\Http\Request;

class SchoolTermController extends Controller
{
    /**
     * Store a new school term.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_year_id' => 'required|exists:school_years,id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        // Validate that the term dates are within the school year dates
        $schoolYear = SchoolYear::find($validated['school_year_id']);
        
        if ($validated['start_date'] < $schoolYear->start_date || $validated['end_date'] > $schoolYear->end_date) {
            return redirect()->back()->withErrors([
                'error' => 'Term dates must be within the school year period.'
            ]);
        }

        SchoolTerm::create($validated);

        return redirect()->back()->with('success', 'School term created successfully.');
    }

    /**
     * Update a school term.
     */
    public function update(Request $request, SchoolTerm $schoolTerm)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        // Validate that the term dates are within the school year dates
        $schoolYear = $schoolTerm->schoolYear;
        
        if ($validated['start_date'] < $schoolYear->start_date || $validated['end_date'] > $schoolYear->end_date) {
            return redirect()->back()->withErrors([
                'error' => 'Term dates must be within the school year period.'
            ]);
        }

        $schoolTerm->update($validated);

        return redirect()->back()->with('success', 'School term updated successfully.');
    }

    /**
     * Set a school term as active.
     */
    public function setActive(SchoolTerm $schoolTerm)
    {
        $schoolTerm->setAsActive();

        return redirect()->back()->with('success', 'School term set as active successfully.');
    }

    /**
     * Delete a school term.
     */
    public function destroy(SchoolTerm $schoolTerm)
    {
        if ($schoolTerm->is_active) {
            return redirect()->back()->withErrors(['error' => 'Cannot delete the active school term.']);
        }

        $schoolTerm->delete();

        return redirect()->back()->with('success', 'School term deleted successfully.');
    }
}