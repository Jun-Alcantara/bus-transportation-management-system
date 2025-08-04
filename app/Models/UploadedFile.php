<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UploadedFile extends Model
{
    protected $fillable = [
        'upload_batch_id',
        'original_filename',
        'stored_filename',
        'file_path',
        'mime_type',
        'file_size',
        'total_records',
        'processed_records',
        'status',
        'error_message',
        'uploaded_by',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'total_records' => 'integer',
        'processed_records' => 'integer',
    ];

    public function uploadBatch(): BelongsTo
    {
        return $this->belongsTo(UploadBatch::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function studentRoutesValidations(): HasMany
    {
        return $this->hasMany(StudentRoutesValidation::class);
    }
}
