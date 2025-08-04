<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolYear extends Model
{
    use HasFactory;

    protected $fillable = [
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
     * Get all terms for this school year.
     */
    public function terms(): HasMany
    {
        return $this->hasMany(SchoolTerm::class);
    }

    /**
     * Get the active term for this school year.
     */
    public function activeTerm()
    {
        return $this->terms()->where('is_active', true)->first();
    }

    /**
     * Set this school year as active (deactivates all others).
     */
    public function setAsActive(): void
    {
        // Deactivate all other school years
        static::where('id', '!=', $this->id)->update(['is_active' => false]);
        
        // Activate this school year
        $this->update(['is_active' => true]);
    }

    /**
     * Get the currently active school year.
     */
    public static function getActive()
    {
        return static::where('is_active', true)->first();
    }

    /**
     * Scope to get active school year.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}