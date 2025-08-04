<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'student_code',
        'first_name',
        'middle_name',
        'last_name',
        'birthday',
        'primary_contact_number',
        'secondary_contact_number',
        'boces',
        'displaced',
        'school_id',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'birthday' => 'date',
        'boces' => 'boolean',
        'displaced' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function address(): HasOne
    {
        return $this->hasOne(StudentAddress::class);
    }

    public function emergencyContacts(): HasMany
    {
        return $this->hasMany(StudentEmergencyContact::class);
    }

    public function specialNeeds(): BelongsToMany
    {
        return $this->belongsToMany(SpecialNeed::class, 'student_special_need');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getFullNameAttribute(): string
    {
        $fullName = $this->first_name;
        
        if ($this->middle_name) {
            $fullName .= ' ' . $this->middle_name;
        }
        
        $fullName .= ' ' . $this->last_name;
        
        return $fullName;
    }

    public function getAgeAttribute(): int
    {
        return $this->birthday->diffInYears(now());
    }
}
