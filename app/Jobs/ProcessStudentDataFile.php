<?php

namespace App\Jobs;

use App\Models\UploadedFile;
use App\Models\StudentRoutesValidation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;

class   ProcessStudentDataFile implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public UploadedFile $uploadedFile
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $this->uploadedFile->update(['status' => 'processing']);

            $filePath = Storage::path($this->uploadedFile->file_path);
            $spreadsheet = IOFactory::load($filePath);
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            // Skip header row
            $headers = array_shift($rows);
            $totalRecords = count($rows);
            $processedRecords = 0;

            $this->uploadedFile->update(['total_records' => $totalRecords]);

            foreach ($rows as $row) {
                $data = array_combine($headers, $row);
                
                // Convert boolean fields
                $booleanFields = [
                    'stuneeds_need1', 'stuneeds_need2', 'stuneeds_need3', 'stuneeds_need4',
                    'stuneeds_need5', 'stuneeds_need6', 'stuneeds_need7', 'stuneeds_need8',
                    'stuneeds_need9', 'stuneeds_need10', 'stuothneeds_need5', 'stuothneeds_need4'
                ];

                foreach ($booleanFields as $field) {
                    if (isset($data[$field])) {
                        $data[$field] = strtoupper($data[$field]) === 'TRUE';
                    }
                }

                $data['uploaded_file_id'] = $this->uploadedFile->id;

                StudentRoutesValidation::create($data);
                $processedRecords++;

                // Update progress periodically
                if ($processedRecords % 100 === 0) {
                    $this->uploadedFile->update(['processed_records' => $processedRecords]);
                }
            }

            $this->uploadedFile->update([
                'processed_records' => $processedRecords,
                'status' => 'completed',
            ]);

            // Update batch status if all files are completed
            $this->updateBatchStatus();

        } catch (\Exception $e) {
            $this->uploadedFile->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            // Update batch status to failed if any file fails
            $this->uploadedFile->uploadBatch->update(['status' => 'failed']);
        }
    }

    private function updateBatchStatus(): void
    {
        $batch = $this->uploadedFile->uploadBatch;
        $totalFiles = $batch->uploadedFiles()->count();
        $completedFiles = $batch->uploadedFiles()->where('status', 'completed')->count();
        $failedFiles = $batch->uploadedFiles()->where('status', 'failed')->count();

        if ($failedFiles > 0) {
            $batch->update(['status' => 'failed']);
        } elseif ($completedFiles === $totalFiles) {
            $batch->update(['status' => 'completed']);
        }
    }
}
