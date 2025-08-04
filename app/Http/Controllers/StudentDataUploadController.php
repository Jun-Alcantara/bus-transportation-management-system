<?php

namespace App\Http\Controllers;

use App\Models\UploadBatch;
use App\Models\UploadedFile;
use App\Jobs\ProcessStudentDataFile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudentDataUploadController extends Controller
{
    public function upload(Request $request, UploadBatch $uploadBatch)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'required|file|mimes:xls,xlsx|max:10240', // 10MB max
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $storedName = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('student-routes', $storedName, 'local');

            $uploadedFile = UploadedFile::create([
                'upload_batch_id' => $uploadBatch->id,
                'original_filename' => $originalName,
                'stored_filename' => $storedName,
                'file_path' => $filePath,
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'uploaded_by' => auth()->id(),
                'status' => 'pending',
            ]);

            $uploadedFiles[] = $uploadedFile;
        }

        // Update batch status to 'processing' immediately after files are uploaded
        $uploadBatch->update(['status' => 'processing']);

        // Dispatch jobs to process files in the background
        foreach ($uploadedFiles as $uploadedFile) {
            ProcessStudentDataFile::dispatch($uploadedFile);
        }

        

        return response()->json([
            'message' => 'Files uploaded successfully',
            'files' => $uploadedFiles,
        ]);
    }

}
