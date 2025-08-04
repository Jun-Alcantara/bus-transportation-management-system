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
    public function show(Request $request, UploadBatch $uploadBatch)
    {
        // Load uploaded files with search filter if provided
        $uploadBatch->load(['creator', 'updater']);
        
        // Apply search filter to uploaded files if provided
        if ($request->filled('files_search')) {
            $search = $request->get('files_search');
            $uploadBatch->load(['uploadedFiles' => function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('original_filename', 'like', "%{$search}%")
                      ->orWhere('status', 'like', "%{$search}%");
                })->with('uploader');
            }]);
        } else {
            $uploadBatch->load(['uploadedFiles.uploader']);
        }

        $studentValidations = null;
        $studentInformation = null;
        
        // If the batch status indicates processing is underway or complete, fetch validation data
        if (in_array($uploadBatch->status, ['processing', 'uploaded'])) {
            $query = \App\Models\StudentRoutesValidation::query()
                ->whereHas('uploadedFile', function ($query) use ($uploadBatch) {
                    $query->where('upload_batch_id', $uploadBatch->id);
                })
                ->with('uploadedFile');

            // Apply search filter if provided
            if ($request->filled('students_search')) {
                $search = $request->get('students_search');
                $query->where(function ($q) use ($search) {
                    $q->where('stu_autoid', 'like', "%{$search}%")
                      ->orWhere('stu_firstname', 'like', "%{$search}%")
                      ->orWhere('stu_lastname', 'like', "%{$search}%")
                      ->orWhere('sch_name', 'like', "%{$search}%")
                      ->orWhere('loc_loc', 'like', "%{$search}%")
                      ->orWhere('ugeocode__', 'like', "%{$search}%");
                });
            }

            $studentValidations = $query->paginate(50)->withQueryString();

            // Fetch student information data
            $studentInfoQuery = \App\Models\SrvStudentInformation::query()
                ->where('upload_batch_id', $uploadBatch->id);

            // Apply search filter for student information if provided
            if ($request->filled('student_info_search')) {
                $search = $request->get('student_info_search');
                $studentInfoQuery->where(function ($q) use ($search) {
                    $q->where('stu_autoid', 'like', "%{$search}%");
                });
            }

            $studentInformation = $studentInfoQuery->paginate(50, ['*'], 'student_info_page')->withQueryString();
        }

        return Inertia::render('StudentDataUpload/Show', [
            'uploadBatch' => $uploadBatch,
            'studentValidations' => $studentValidations,
            'studentInformation' => $studentInformation,
            'filters' => [
                'files_search' => $request->get('files_search', ''),
                'students_search' => $request->get('students_search', ''),
                'student_info_search' => $request->get('student_info_search', ''),
            ]
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
