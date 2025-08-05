<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolMap extends Model
{
    protected $fillable = [
        'sts_school_code',
        'import_school_code',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'sts_school_code', 'school_code');
    }

    /**
     * To update throw a validation of this return multiple result
     */
    public static function findSchoolByCode(string $schoolCode): ?School
    {
        $school = School::where('school_code', $schoolCode)->first();
        
        if ($school) {
            return $school;
        }

        $schoolMap = self::where('import_school_code', $schoolCode)->first();
        
        return $schoolMap ? $schoolMap->school : null;
    }
}
