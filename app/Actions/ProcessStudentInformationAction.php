<?php

namespace App\Actions;

use App\Models\UploadBatch;
use App\Models\SrvStudentInformation;
use App\Models\Student;
use App\Models\SpecialNeed;
use App\Models\StudentRoutesValidation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProcessStudentInformationAction
{
    private const SPECIAL_NEEDS_MAPPING = [
        'SP-1' => 'stuneeds_need1',
        'SP-2' => 'stuneeds_need2',
        'SP-3' => 'stuneeds_need3',
        'SP-4' => 'stuneeds_need4',
        'SP-5' => 'stuneeds_need5',
        'SP-6' => 'stuneeds_need6',
        'SP-7' => 'stuneeds_need7',
        'SP-8' => 'stuneeds_need8',
        'SP-9' => 'stuneeds_need9',
        'SP-10' => 'stuneeds_need10',
        'SP-11' => 'stuothneeds_need5',
        'STUOTHNEEDS4' => 'stuothneeds_need4',
    ];

    public function execute(UploadBatch $uploadBatch): void
    {
        DB::transaction(function () use ($uploadBatch) {
            // Get all student routes validation records for this batch through uploaded files
            $studentRoutesData = $this->getStudentRoutesData($uploadBatch);
            
            // Group by stu_autoid to get unique students
            $uniqueStudents = $studentRoutesData->groupBy('stu_autoid');
            
            foreach ($uniqueStudents as $stuAutoId => $studentRecords) {
                $this->processStudentRecord($uploadBatch, $stuAutoId, $studentRecords);
            }
        });
    }

    private function getStudentRoutesData(UploadBatch $uploadBatch): Collection
    {
        return StudentRoutesValidation::whereHas('uploadedFile', function ($query) use ($uploadBatch) {
            $query->where('upload_batch_id', $uploadBatch->id);
        })->get();
    }

    private function processStudentRecord(UploadBatch $uploadBatch, string $stuAutoId, Collection $studentRecords): void
    {
        // Check if student exists
        $existingStudent = Student::where('student_code', $stuAutoId)->first();
        $isNewStudent = !$existingStudent;

        // Extract special needs from all records for this student
        $specialNeedsData = $this->extractSpecialNeedsData($studentRecords);
        
        // Check for inconsistencies in special needs across records
        $inconsistencies = $this->checkSpecialNeedsInconsistencies($studentRecords);
        $hasInconsistencies = !empty($inconsistencies);

        // Check for changes in special needs if student exists
        $hasChanges = false;
        $currentSpecialNeeds = [];
        
        if (!$isNewStudent) {
            $currentSpecialNeeds = $this->getCurrentStudentSpecialNeeds($existingStudent);
            $hasChanges = $this->hasSpecialNeedsChanged($currentSpecialNeeds, $specialNeedsData);
        }

        // Create or update SrvStudentInformation record
        SrvStudentInformation::updateOrCreate(
            [
                'stu_autoid' => $stuAutoId,
                'upload_batch_id' => $uploadBatch->id,
            ],
            [
                'is_new_student' => $isNewStudent,
                'has_inconsistent_special_needs' => $hasInconsistencies,
                'has_special_needs_changes' => $hasChanges,
                'special_needs_data' => [
                    'current' => $currentSpecialNeeds,
                    'new' => $specialNeedsData,
                ],
                'inconsistencies_data' => $inconsistencies,
            ]
        );
    }

    private function extractSpecialNeedsData(Collection $studentRecords): array
    {
        // Take the first record as the baseline for special needs
        $firstRecord = $studentRecords->first();
        $specialNeeds = [];

        foreach (self::SPECIAL_NEEDS_MAPPING as $spnCode => $column) {
            if ($firstRecord->$column) {
                $specialNeeds[] = $spnCode;
            }
        }

        return $specialNeeds;
    }

    private function checkSpecialNeedsInconsistencies(Collection $studentRecords): array
    {
        if ($studentRecords->count() <= 1) {
            return [];
        }

        $inconsistencies = [];
        $firstRecord = $studentRecords->first();

        foreach (self::SPECIAL_NEEDS_MAPPING as $spnCode => $column) {
            $firstValue = $firstRecord->$column;
            
            foreach ($studentRecords->skip(1) as $index => $record) {
                if ($record->$column !== $firstValue) {
                    $inconsistencies[] = [
                        'special_need' => $spnCode,
                        'column' => $column,
                        'first_record_value' => $firstValue,
                        'conflicting_record_index' => $index + 1,
                        'conflicting_value' => $record->$column,
                    ];
                    break; // Only report first inconsistency per special need
                }
            }
        }

        return $inconsistencies;
    }

    private function getCurrentStudentSpecialNeeds(Student $student): array
    {
        return $student->specialNeeds()
            ->pluck('spn_code')
            ->toArray();
    }

    private function hasSpecialNeedsChanged(array $currentNeeds, array $newNeeds): bool
    {
        sort($currentNeeds);
        sort($newNeeds);
        
        return $currentNeeds !== $newNeeds;
    }
}