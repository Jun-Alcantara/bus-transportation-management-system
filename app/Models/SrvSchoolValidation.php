<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SrvSchoolValidation extends Model
{
    protected $fillable = [
        'upload_batch_id',
        'school_code',
        'sch_name',
        'is_unknown_school',
        'record_count',
    ];

    protected $casts = [
        'is_unknown_school' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function uploadBatch(): BelongsTo
    {
        return $this->belongsTo(UploadBatch::class);
    }
}
