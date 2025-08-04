<?php

namespace App\Http\Controllers;

use App\Models\District;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DistrictController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = District::with(['createdBy', 'updatedBy']);

        // Search
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        
        $allowedSorts = ['name', 'code', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('name', 'asc');
        }

        // Pagination
        $districts = $query->paginate(10)->withQueryString();

        return Inertia::render('Districts/Index', [
            'districts' => $districts,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort' => $sortField,
                'direction' => $sortDirection,
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:districts,code',
        ]);

        District::create([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('districts.index')
            ->with('success', 'District created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, District $district)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:districts,code,' . $district->id,
        ]);

        $district->update([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('districts.index')
            ->with('success', 'District updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district)
    {
        $district->delete();

        return redirect()->route('districts.index')
            ->with('success', 'District deleted successfully.');
    }
}
