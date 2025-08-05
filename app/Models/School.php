<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class School extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'school_code',
        'name',
        'district_id',
        'street',
        'street_number',
        'zip_code',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function contactPersons(): HasMany
    {
        return $this->hasMany(ContactPerson::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function schoolMaps(): HasMany
    {
        return $this->hasMany(SchoolMap::class, 'sts_school_code', 'school_code');
    }

    public function getFullAddressAttribute(): string
    {
        return $this->street_number . ' ' . $this->street . ', ' . $this->zip_code;
    }
}
