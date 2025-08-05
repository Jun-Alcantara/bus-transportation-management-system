<?php

namespace App\Actions;

use App\Models\UploadBatch;
use App\Models\SrvRoutesAndRunsValidation;
use App\Models\Route;
use App\Models\StudentRoutesValidation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProcessRoutesAndRunsValidationAction
{
    public function execute(UploadBatch $uploadBatch): void
    {
        DB::transaction(function () use ($uploadBatch) {
            $studentRoutesData = $this->getStudentRoutesData($uploadBatch);
            
            $this->processRoutesAndRuns($uploadBatch, $studentRoutesData);
        });
    }

    private function getStudentRoutesData(UploadBatch $uploadBatch): Collection
    {
        return StudentRoutesValidation::whereHas('uploadedFile', function ($query) use ($uploadBatch) {
            $query->where('upload_batch_id', $uploadBatch->id);
        })->get();
    }

    private function processRoutesAndRuns(UploadBatch $uploadBatch, Collection $studentRoutesData): void
    {
        // Group by route and run (without ugeocode) for main validation
        $groupedByRouteRun = $studentRoutesData
            ->whereNotNull('rte_id')
            ->where('rte_id', '!=', '')
            ->whereNotNull('run_idx')
            ->where('run_idx', '!=', '')
            ->groupBy(function ($item) {
                return $item->rte_id . '|' . $item->run_idx;
            });

        foreach ($groupedByRouteRun as $groupKey => $records) {
            [$rteId, $runIdx] = explode('|', $groupKey);
            $this->validateRouteAndRun($uploadBatch, $rteId, $runIdx, $records);
        }
    }

    private function validateRouteAndRun(UploadBatch $uploadBatch, string $rteId, string $runIdx, Collection $records): void
    {
        $isNewRoute = $this->checkIfRouteExists($rteId);
        
        // Count total runs for this route across all data
        $runsCount = $this->countRunsForRoute($rteId, $uploadBatch);
        
        // Check frequency consistency by ugeocode
        $hasInconsistentFrequency = $this->checkFrequencyConsistency($rteId, $runIdx, $records);
        
        // Check for stacked runs (multiple schools for same run)
        $hasStackedRuns = $this->checkForStackedRuns($records);

        $firstRecord = $records->first();
        $runFreq = $firstRecord->run_freq ?? '';
        $ugeocode = $firstRecord->ugeocode__ ?? '';

        $validationDetails = [
            'total_records' => $records->count(),
            'unique_frequencies' => $records->pluck('run_freq')->unique()->values()->toArray(),
            'unique_schools' => $records->pluck('tripasgn_sch_code')->unique()->values()->toArray(),
            'unique_geocodes' => $records->pluck('ugeocode__')->unique()->values()->toArray(),
            'sample_records' => $records->take(3)->map(function ($record) {
                return [
                    'stu_autoid' => $record->stu_autoid,
                    'run_freq' => $record->run_freq,
                    'tripasgn_sch_code' => $record->tripasgn_sch_code,
                    'ugeocode__' => $record->ugeocode__,
                ];
            })->toArray(),
        ];

        SrvRoutesAndRunsValidation::updateOrCreate(
            [
                'upload_batch_id' => $uploadBatch->id,
                'rte_id' => $rteId,
                'run_idx' => $runIdx,
            ],
            [
                'ugeocode__' => $ugeocode,
                'run_freq' => $runFreq,
                'runs_count' => $runsCount,
                'is_new_route' => $isNewRoute,
                'has_inconsistent_frequency' => $hasInconsistentFrequency,
                'has_stacked_runs' => $hasStackedRuns,
                'validation_details' => $validationDetails,
            ]
        );
    }

    private function checkIfRouteExists(string $rteId): bool
    {
        return !Route::where('code', $rteId)->exists();
    }

    private function countRunsForRoute(string $rteId, UploadBatch $uploadBatch): int
    {
        return StudentRoutesValidation::whereHas('uploadedFile', function ($query) use ($uploadBatch) {
            $query->where('upload_batch_id', $uploadBatch->id);
        })
        ->where('rte_id', $rteId)
        ->distinct('run_idx')
        ->count('run_idx');
    }

    private function checkFrequencyConsistency(string $rteId, string $runIdx, Collection $records): bool
    {
        // Group by ugeocode and check if each ugeocode has consistent frequency
        $groupedByGeocode = $records->groupBy('ugeocode__');
        
        foreach ($groupedByGeocode as $ugeocode => $geocodeRecords) {
            if (empty($ugeocode)) continue;
            
            // Check if this ugeocode+run combination has multiple frequencies
            $frequencies = $geocodeRecords->pluck('run_freq')->unique()->filter();
            if ($frequencies->count() > 1) {
                return true; // Inconsistent frequency found
            }
            
            // Check against other records in the database for same rte_id, run_idx, ugeocode
            $currentFrequency = $frequencies->first();
            if ($currentFrequency) {
                $otherRecordsWithDifferentFreq = StudentRoutesValidation::where('rte_id', $rteId)
                    ->where('run_idx', $runIdx)
                    ->where('ugeocode__', $ugeocode)
                    ->where('run_freq', '!=', $currentFrequency)
                    ->exists();
                    
                if ($otherRecordsWithDifferentFreq) {
                    return true;
                }
            }
        }
        
        return false;
    }

    private function checkForStackedRuns(Collection $records): bool
    {
        // Check if this run serves multiple schools
        $uniqueSchools = $records->pluck('tripasgn_sch_code')->unique()->filter();
        
        return $uniqueSchools->count() > 1;
    }
}