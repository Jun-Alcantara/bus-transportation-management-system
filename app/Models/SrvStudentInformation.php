<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SrvStudentInformation extends Model
{
    protected $table = 'srv_student_information';

    protected $fillable = [
        'stu_autoid',
        'upload_batch_id',
        'is_new_student',
        'has_inconsistent_special_needs',
        'has_special_needs_changes',
        'special_needs_data',
        'inconsistencies_data',
    ];

    protected $casts = [
        'is_new_student' => 'boolean',
        'has_inconsistent_special_needs' => 'boolean',
        'has_special_needs_changes' => 'boolean',
        'special_needs_data' => 'array',
        'inconsistencies_data' => 'array',
    ];

    public function uploadBatch(): BelongsTo
    {
        return $this->belongsTo(UploadBatch::class);
    }
}
