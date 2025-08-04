<?php

namespace App\Http\Controllers;

use App\Models\UploadBatch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UploadBatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = UploadBatch::with(['creator', 'updater'])
            ->withCount('uploadedFiles');

        // Search
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%");
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $allowedSorts = ['name', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $uploadBatches = $query->paginate(10)->withQueryString();

        return Inertia::render('StudentDataUpload/Index', [
            'uploadBatches' => $uploadBatches,
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
        ]);

        UploadBatch::create([
            'name' => $validated['name'],
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('upload-batches.index')
            ->with('success', 'Upload Batch created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(UploadBatch $uploadBatch)
    {
        $uploadBatch->load(['creator', 'uploadedFiles.uploader']);

        $studentValidations = null;
        
        // If the batch status indicates processing is complete, fetch validation data
        if ($uploadBatch->status === 'uploaded') {
            $studentValidations = \App\Models\StudentRoutesValidation::query()
                ->whereHas('uploadedFile', function ($query) use ($uploadBatch) {
                    $query->where('upload_batch_id', $uploadBatch->id);
                })
                ->with('uploadedFile')
                ->paginate(50);
        }

        return Inertia::render('StudentDataUpload/Show', [
            'uploadBatch' => $uploadBatch,
            'studentValidations' => $studentValidations,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UploadBatch $uploadBatch)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $uploadBatch->update([
            'name' => $validated['name'],
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('upload-batches.index')
            ->with('success', 'Upload Batch updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UploadBatch $uploadBatch)
    {
        if (!$uploadBatch->canBeDeleted()) {
            return redirect()->route('upload-batches.index')
                ->with('error', 'Cannot delete upload batch that has files attached.');
        }

        $uploadBatch->delete();

        return redirect()->route('upload-batches.index')
            ->with('success', 'Upload Batch deleted successfully.');
    }
}
