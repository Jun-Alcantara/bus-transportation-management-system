<?php

namespace App\Helpers;

use App\Models\SchoolYear;
use App\Models\SchoolTerm;

class SchoolHelper
{
    /**
     * Get the currently active school year.
     */
    public static function getActiveSchoolYear(): ?SchoolYear
    {
        return SchoolYear::getActive();
    }

    /**
     * Get the currently active school term.
     */
    public static function getActiveSchoolTerm(): ?SchoolTerm
    {
        return SchoolTerm::getActive();
    }

    /**
     * Get both active school year and term.
     */
    public static function getActivePeriod(): array
    {
        return [
            'school_year' => static::getActiveSchoolYear(),
            'school_term' => static::getActiveSchoolTerm(),
        ];
    }

    /**
     * Check if there's an active school year and term.
     */
    public static function hasActivePeriod(): bool
    {
        return static::getActiveSchoolYear() !== null && static::getActiveSchoolTerm() !== null;
    }

    /**
     * Get a formatted string of the current active period.
     */
    public static function getActivePeriodString(): string
    {
        $schoolYear = static::getActiveSchoolYear();
        $schoolTerm = static::getActiveSchoolTerm();

        if (!$schoolYear || !$schoolTerm) {
            return 'No active period set';
        }

        return "{$schoolYear->name} - {$schoolTerm->name}";
    }

    /**
     * Get the active school year ID (helper for relationships).
     */
    public static function getActiveSchoolYearId(): ?int
    {
        $activeYear = static::getActiveSchoolYear();
        return $activeYear?->id;
    }

    /**
     * Get the active school term ID (helper for relationships).
     */
    public static function getActiveSchoolTermId(): ?int
    {
        $activeTerm = static::getActiveSchoolTerm();
        return $activeTerm?->id;
    }
}