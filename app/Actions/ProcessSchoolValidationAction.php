<?php

namespace App\Actions;

use App\Models\UploadBatch;
use App\Models\SrvSchoolValidation;
use App\Models\SchoolMap;
use App\Models\StudentRoutesValidation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProcessSchoolValidationAction
{
    public function execute(UploadBatch $uploadBatch): void
    {
        DB::transaction(function () use ($uploadBatch) {
            // Get all student routes validation records for this batch
            $studentRoutesData = $this->getStudentRoutesData($uploadBatch);
            
            // Process tripasgn_sch_code validation only
            $this->processSchoolCodes($uploadBatch, $studentRoutesData);
        });
    }

    private function getStudentRoutesData(UploadBatch $uploadBatch): Collection
    {
        return StudentRoutesValidation::whereHas('uploadedFile', function ($query) use ($uploadBatch) {
            $query->where('upload_batch_id', $uploadBatch->id);
        })->get();
    }

    private function processSchoolCodes(UploadBatch $uploadBatch, Collection $studentRoutesData): void
    {
        // Group by tripasgn_sch_code to get unique codes and count occurrences
        $groupedByCodes = $studentRoutesData
            ->whereNotNull('tripasgn_sch_code')
            ->where('tripasgn_sch_code', '!=', '')
            ->groupBy('tripasgn_sch_code');

        foreach ($groupedByCodes as $schoolCode => $records) {
            $this->validateSchoolCode($uploadBatch, $schoolCode, $records);
        }
    }

    private function validateSchoolCode(UploadBatch $uploadBatch, string $schoolCode, Collection $records): void
    {
        // Use SchoolMap::findSchoolByCode to check if school exists
        $school = SchoolMap::findSchoolByCode($schoolCode);
        $isUnknownSchool = $school === null;

        // Get the sch_name from the first record (they should be the same for the same school code)
        $schName = $records->first()->sch_name;

        // Create or update school validation record
        SrvSchoolValidation::updateOrCreate(
            [
                'upload_batch_id' => $uploadBatch->id,
                'school_code' => $schoolCode,
            ],
            [
                'sch_name' => $schName,
                'is_unknown_school' => $isUnknownSchool,
                'record_count' => $records->count(),
            ]
        );
    }
}