<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\School;
use App\Models\SpecialNeed;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Student::with(['school', 'address', 'emergencyContacts', 'specialNeeds', 'createdBy', 'updatedBy']);

        // Search
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('student_code', 'like', "%{$search}%")
                  ->orWhere('primary_contact_number', 'like', "%{$search}%")
                  ->orWhereHas('school', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'last_name');
        $sortDirection = $request->get('direction', 'asc');
        
        $allowedSorts = ['first_name', 'last_name', 'student_code', 'birthday', 'is_active', 'created_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('last_name', 'asc');
        }

        // Pagination
        $students = $query->paginate(10)->withQueryString();

        return Inertia::render('Students/Index', [
            'students' => $students,
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
        $schools = School::where('is_active', true)->orderBy('name')->get();
        $specialNeeds = SpecialNeed::orderBy('spn_name')->get();
        
        return Inertia::render('Students/Form', [
            'student' => null,
            'schools' => $schools,
            'specialNeeds' => $specialNeeds,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_code' => 'required|string|max:50|unique:students,student_code',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'birthday' => 'required|date',
            'primary_contact_number' => 'required|string|max:255',
            'secondary_contact_number' => 'nullable|string|max:255',
            'boces' => 'boolean',
            'displaced' => 'boolean',
            'school_id' => 'required|exists:schools,id',
            
            // Address validation
            'address.address_code' => 'required|string|max:255',
            'address.zip_code' => 'required|string|max:20',
            'address.street_number' => 'required|string|max:255',
            'address.apt_number' => 'nullable|string|max:255',
            'address.street_name' => 'required|string|max:255',
            'address.corner_street' => 'nullable|string|max:255',
            'address.city' => 'required|string|max:255',
            'address.address_district' => 'required|string|max:255',
            'address.state' => 'required|string|max:255',
            'address.google_maps_link' => 'nullable|url',
            
            // Emergency contacts validation
            'emergency_contacts' => 'required|array|min:1',
            'emergency_contacts.*.person_to_notify' => 'required|string|max:255',
            'emergency_contacts.*.relationship' => 'required|string|max:255',
            'emergency_contacts.*.contact_number' => 'required|string|max:255',
            'emergency_contacts.*.drop_off_location' => 'required|string|max:255',
            
            // Special needs validation
            'special_needs' => 'array',
            'special_needs.*' => 'exists:special_needs,id',
        ]);

        DB::transaction(function () use ($validated) {
            $student = Student::create([
                'student_code' => $validated['student_code'],
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'],
                'last_name' => $validated['last_name'],
                'birthday' => $validated['birthday'],
                'primary_contact_number' => $validated['primary_contact_number'],
                'secondary_contact_number' => $validated['secondary_contact_number'],
                'boces' => $validated['boces'] ?? false,
                'displaced' => $validated['displaced'] ?? false,
                'school_id' => $validated['school_id'],
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            // Create address
            $student->address()->create($validated['address']);

            // Create emergency contacts
            foreach ($validated['emergency_contacts'] as $contactData) {
                $student->emergencyContacts()->create($contactData);
            }

            // Attach special needs
            if (!empty($validated['special_needs'])) {
                $student->specialNeeds()->attach($validated['special_needs']);
            }
        });

        return redirect()->route('students.index')
            ->with('success', 'Student created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        $student->load(['address', 'emergencyContacts', 'specialNeeds']);
        $schools = School::where('is_active', true)->orderBy('name')->get();
        $specialNeeds = SpecialNeed::orderBy('spn_name')->get();
        
        return Inertia::render('Students/Form', [
            'student' => $student,
            'schools' => $schools,
            'specialNeeds' => $specialNeeds,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'birthday' => 'required|date',
            'primary_contact_number' => 'required|string|max:255',
            'secondary_contact_number' => 'nullable|string|max:255',
            'boces' => 'boolean',
            'displaced' => 'boolean',
            'school_id' => 'required|exists:schools,id',
            
            // Address validation
            'address.address_code' => 'required|string|max:255',
            'address.zip_code' => 'required|string|max:20',
            'address.street_number' => 'required|string|max:255',
            'address.apt_number' => 'nullable|string|max:255',
            'address.street_name' => 'required|string|max:255',
            'address.corner_street' => 'nullable|string|max:255',
            'address.city' => 'required|string|max:255',
            'address.address_district' => 'required|string|max:255',
            'address.state' => 'required|string|max:255',
            'address.google_maps_link' => 'nullable|url',
            
            // Emergency contacts validation
            'emergency_contacts' => 'required|array|min:1',
            'emergency_contacts.*.person_to_notify' => 'required|string|max:255',
            'emergency_contacts.*.relationship' => 'required|string|max:255',
            'emergency_contacts.*.contact_number' => 'required|string|max:255',
            'emergency_contacts.*.drop_off_location' => 'required|string|max:255',
            
            // Special needs validation
            'special_needs' => 'array',
            'special_needs.*' => 'exists:special_needs,id',
        ]);

        DB::transaction(function () use ($validated, $student) {
            $student->update([
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'],
                'last_name' => $validated['last_name'],
                'birthday' => $validated['birthday'],
                'primary_contact_number' => $validated['primary_contact_number'],
                'secondary_contact_number' => $validated['secondary_contact_number'],
                'boces' => $validated['boces'] ?? false,
                'displaced' => $validated['displaced'] ?? false,
                'school_id' => $validated['school_id'],
                'updated_by' => auth()->id(),
            ]);

            // Update address
            $student->address()->updateOrCreate(
                ['student_id' => $student->id],
                $validated['address']
            );

            // Update emergency contacts
            $student->emergencyContacts()->delete();
            foreach ($validated['emergency_contacts'] as $contactData) {
                $student->emergencyContacts()->create($contactData);
            }

            // Update special needs
            $student->specialNeeds()->sync($validated['special_needs'] ?? []);
        });

        return redirect()->route('students.index')
            ->with('success', 'Student updated successfully.');
    }

    /**
     * Disable the specified resource.
     */
    public function disable(Student $student)
    {
        $student->update([
            'is_active' => false,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('students.index')
            ->with('success', 'Student disabled successfully.');
    }

    /**
     * Enable the specified resource.
     */
    public function enable(Student $student)
    {
        $student->update([
            'is_active' => true,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('students.index')
            ->with('success', 'Student enabled successfully.');
    }
}
