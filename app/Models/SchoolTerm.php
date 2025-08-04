<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolTerm extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_year_id',
        'name',
        'start_date',
        'end_date',
        'is_active',
        'description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the school year this term belongs to.
     */
    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class);
    }

    /**
     * Set this term as active (deactivates all other terms in the same school year).
     */
    public function setAsActive(): void
    {
        // Deactivate all other terms in the same school year
        static::where('school_year_id', $this->school_year_id)
            ->where('id', '!=', $this->id)
            ->update(['is_active' => false]);
        
        // Activate this term
        $this->update(['is_active' => true]);
    }

    /**
     * Get the currently active term.
     */
    public static function getActive()
    {
        $activeSchoolYear = SchoolYear::getActive();
        
        if (!$activeSchoolYear) {
            return null;
        }

        return static::where('school_year_id', $activeSchoolYear->id)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Scope to get active term.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get terms for the active school year.
     */
    public function scopeForActiveSchoolYear($query)
    {
        $activeSchoolYear = SchoolYear::getActive();
        
        if (!$activeSchoolYear) {
            return $query->whereRaw('1 = 0'); // Return empty result
        }

        return $query->where('school_year_id', $activeSchoolYear->id);
    }
}