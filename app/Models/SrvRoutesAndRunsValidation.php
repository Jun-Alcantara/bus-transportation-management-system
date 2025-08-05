<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SrvRoutesAndRunsValidation extends Model
{
    protected $fillable = [
        'upload_batch_id',
        'rte_id',
        'run_idx',
        'ugeocode__',
        'run_freq',
        'runs_count',
        'is_new_route',
        'has_inconsistent_frequency',
        'has_stacked_runs',
        'validation_details',
    ];

    protected $casts = [
        'is_new_route' => 'boolean',
        'has_inconsistent_frequency' => 'boolean',
        'has_stacked_runs' => 'boolean',
        'validation_details' => 'array',
    ];

    public function uploadBatch(): BelongsTo
    {
        return $this->belongsTo(UploadBatch::class);
    }
}
