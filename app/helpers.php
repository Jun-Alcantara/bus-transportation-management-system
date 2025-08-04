<?php

use App\Helpers\SchoolHelper;
use App\Models\SchoolYear;
use App\Models\SchoolTerm;

if (!function_exists('active_school_year')) {
    /**
     * Get the currently active school year.
     */
    function active_school_year(): ?SchoolYear
    {
        return SchoolHelper::getActiveSchoolYear();
    }
}

if (!function_exists('active_school_term')) {
    /**
     * Get the currently active school term.
     */
    function active_school_term(): ?SchoolTerm
    {
        return SchoolHelper::getActiveSchoolTerm();
    }
}

if (!function_exists('active_period')) {
    /**
     * Get both active school year and term.
     */
    function active_period(): array
    {
        return SchoolHelper::getActivePeriod();
    }
}

if (!function_exists('active_period_string')) {
    /**
     * Get a formatted string of the current active period.
     */
    function active_period_string(): string
    {
        return SchoolHelper::getActivePeriodString();
    }
}

if (!function_exists('has_active_period')) {
    /**
     * Check if there's an active school year and term.
     */
    function has_active_period(): bool
    {
        return SchoolHelper::hasActivePeriod();
    }
}