<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\District;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = School::with(['district', 'contactPersons', 'createdBy', 'updatedBy']);

        // Search
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('school_code', 'like', "%{$search}%")
                  ->orWhere('street', 'like', "%{$search}%")
                  ->orWhere('zip_code', 'like', "%{$search}%")
                  ->orWhereHas('district', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        
        $allowedSorts = ['name', 'school_code', 'street', 'zip_code', 'is_active', 'created_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('name', 'asc');
        }

        // Pagination
        $schools = $query->paginate(10)->withQueryString();

        return Inertia::render('Schools/Index', [
            'schools' => $schools,
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
        
        return Inertia::render('Schools/Form', [
            'school' => null,
            'districts' => $districts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_code' => 'required|string|max:50|unique:schools,school_code',
            'name' => 'required|string|max:255',
            'district_id' => 'required|exists:districts,id',
            'street' => 'required|string|max:255',
            'street_number' => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
            'contact_persons' => 'required|array|min:1',
            'contact_persons.*.name' => 'required|string|max:255',
            'contact_persons.*.title' => 'required|string|max:255',
            'contact_persons.*.mobile_number' => 'required|string|max:255',
            'contact_persons.*.telephone_number' => 'nullable|string|max:255',
            'contact_persons.*.email' => 'required|email|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            $school = School::create([
                'school_code' => $validated['school_code'],
                'name' => $validated['name'],
                'district_id' => $validated['district_id'],
                'street' => $validated['street'],
                'street_number' => $validated['street_number'],
                'zip_code' => $validated['zip_code'],
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            foreach ($validated['contact_persons'] as $contactData) {
                $school->contactPersons()->create($contactData);
            }
        });

        return redirect()->route('schools.index')
            ->with('success', 'School created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(School $school)
    {
        $school->load('contactPersons');
        $districts = District::orderBy('name')->get();
        
        return Inertia::render('Schools/Form', [
            'school' => $school,
            'districts' => $districts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, School $school)
    {
        $validated = $request->validate([
            'school_code' => 'required|string|max:50|unique:schools,school_code,' . $school->id,
            'name' => 'required|string|max:255',
            'district_id' => 'required|exists:districts,id',
            'street' => 'required|string|max:255',
            'street_number' => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
            'contact_persons' => 'required|array|min:1',
            'contact_persons.*.name' => 'required|string|max:255',
            'contact_persons.*.title' => 'required|string|max:255',
            'contact_persons.*.mobile_number' => 'required|string|max:255',
            'contact_persons.*.telephone_number' => 'nullable|string|max:255',
            'contact_persons.*.email' => 'required|email|max:255',
        ]);

        DB::transaction(function () use ($validated, $school) {
            $school->update([
                'school_code' => $validated['school_code'],
                'name' => $validated['name'],
                'district_id' => $validated['district_id'],
                'street' => $validated['street'],
                'street_number' => $validated['street_number'],
                'zip_code' => $validated['zip_code'],
                'updated_by' => auth()->id(),
            ]);

            // Delete existing contact persons and create new ones
            $school->contactPersons()->delete();
            foreach ($validated['contact_persons'] as $contactData) {
                $school->contactPersons()->create($contactData);
            }
        });

        return redirect()->route('schools.index')
            ->with('success', 'School updated successfully.');
    }

    /**
     * Disable the specified resource.
     */
    public function disable(School $school)
    {
        $school->update([
            'is_active' => false,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('schools.index')
            ->with('success', 'School disabled successfully.');
    }

    /**
     * Enable the specified resource.
     */
    public function enable(School $school)
    {
        $school->update([
            'is_active' => true,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('schools.index')
            ->with('success', 'School enabled successfully.');
    }
}
