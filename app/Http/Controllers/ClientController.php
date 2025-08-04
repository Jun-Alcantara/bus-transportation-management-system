<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\District;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Client::with(['district', 'contactPersons', 'createdBy', 'updatedBy']);

        // Search
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('state', 'like', "%{$search}%")
                  ->orWhereHas('district', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        
        $allowedSorts = ['name', 'category', 'city', 'state', 'is_active', 'created_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('name', 'asc');
        }

        // Pagination
        $clients = $query->paginate(10)->withQueryString();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
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
        
        return Inertia::render('Clients/Form', [
            'client' => null,
            'districts' => $districts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:ADA,ADULT,CAMPS,DISTRICT,FIXED,MISCELLANEOUS,PRIVATE,SHUTTLES',
            'district_id' => 'required|exists:districts,id',
            'suffolk_company' => 'required|in:SBC,STC,STR,STS,SYS',
            'address' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'number_of_decimals' => 'required|integer|min:0|max:9',
            'attention' => 'nullable|string',
            'contact_persons' => 'required|array|min:1',
            'contact_persons.*.name' => 'required|string|max:255',
            'contact_persons.*.title' => 'required|string|max:255',
            'contact_persons.*.mobile_number' => 'required|string|max:255',
            'contact_persons.*.telephone_number' => 'nullable|string|max:255',
            'contact_persons.*.email' => 'required|email|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            $client = Client::create([
                'name' => $validated['name'],
                'category' => $validated['category'],
                'district_id' => $validated['district_id'],
                'suffolk_company' => $validated['suffolk_company'],
                'address' => $validated['address'],
                'address_line_2' => $validated['address_line_2'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip' => $validated['zip'],
                'number_of_decimals' => $validated['number_of_decimals'],
                'attention' => $validated['attention'],
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            foreach ($validated['contact_persons'] as $contactData) {
                $client->contactPersons()->create($contactData);
            }
        });

        return redirect()->route('clients.index')
            ->with('success', 'Client created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        $client->load('contactPersons');
        $districts = District::orderBy('name')->get();
        
        return Inertia::render('Clients/Form', [
            'client' => $client,
            'districts' => $districts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:ADA,ADULT,CAMPS,DISTRICT,FIXED,MISCELLANEOUS,PRIVATE,SHUTTLES',
            'district_id' => 'required|exists:districts,id',
            'suffolk_company' => 'required|in:SBC,STC,STR,STS,SYS',
            'address' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'number_of_decimals' => 'required|integer|min:0|max:9',
            'attention' => 'nullable|string',
            'contact_persons' => 'required|array|min:1',
            'contact_persons.*.name' => 'required|string|max:255',
            'contact_persons.*.title' => 'required|string|max:255',
            'contact_persons.*.mobile_number' => 'required|string|max:255',
            'contact_persons.*.telephone_number' => 'nullable|string|max:255',
            'contact_persons.*.email' => 'required|email|max:255',
        ]);

        DB::transaction(function () use ($validated, $client) {
            $client->update([
                'name' => $validated['name'],
                'category' => $validated['category'],
                'district_id' => $validated['district_id'],
                'suffolk_company' => $validated['suffolk_company'],
                'address' => $validated['address'],
                'address_line_2' => $validated['address_line_2'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip' => $validated['zip'],
                'number_of_decimals' => $validated['number_of_decimals'],
                'attention' => $validated['attention'],
                'updated_by' => auth()->id(),
            ]);

            // Delete existing contact persons and create new ones
            $client->contactPersons()->delete();
            foreach ($validated['contact_persons'] as $contactData) {
                $client->contactPersons()->create($contactData);
            }
        });

        return redirect()->route('clients.index')
            ->with('success', 'Client updated successfully.');
    }

    /**
     * Disable the specified resource.
     */
    public function disable(Client $client)
    {
        $client->update([
            'is_active' => false,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('clients.index')
            ->with('success', 'Client disabled successfully.');
    }

    /**
     * Enable the specified resource.
     */
    public function enable(Client $client)
    {
        $client->update([
            'is_active' => true,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('clients.index')
            ->with('success', 'Client enabled successfully.');
    }
}
