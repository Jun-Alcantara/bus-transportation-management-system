# School Year & Term Management

## Overview
Foundation system for managing academic periods - school years and terms.

## Database Schema

### school_years
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Academic year name (e.g., "2024-2025") |
| start_date | date | Year start date |
| end_date | date | Year end date |
| is_active | boolean | Only one active at a time |
| description | text | Optional description |

### school_terms  
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| school_year_id | bigint | Foreign key to school_years |
| name | string | Term name (e.g., "Term 1") |
| start_date | date | Term start date |
| end_date | date | Term end date |
| is_active | boolean | Only one active per school year |
| description | text | Optional description |

## Models

### SchoolYear Model
**Location**: `app/Models/SchoolYear.php`

**Key Methods**:
- `setAsActive()` - Activates this year, deactivates others
- `getActive()` - Static method to get active school year
- `terms()` - HasMany relationship to SchoolTerm
- `activeTerm()` - Gets active term for this year

### SchoolTerm Model  
**Location**: `app/Models/SchoolTerm.php`

**Key Methods**:
- `setAsActive()` - Activates this term, deactivates others in same year
- `getActive()` - Static method to get active term
- `schoolYear()` - BelongsTo relationship to SchoolYear

## Helper Functions

### Global Functions
**Location**: `app/helpers.php`

```php
active_school_year()        // Get active SchoolYear model
active_school_term()        // Get active SchoolTerm model  
active_period()            // Get both as array
active_period_string()     // Get formatted string "2024-2025 - Term 1"
has_active_period()        // Boolean check if both are set
```

### Helper Class
**Location**: `app/Helpers/SchoolHelper.php`

Contains all the core logic that the global functions wrap.

## Usage Examples

```php
// Check if system has active period set
if (has_active_period()) {
    $year = active_school_year();
    $term = active_school_term();
    $display = active_period_string(); // "2024-2025 - Term 1"
}

// Set a school year as active
$schoolYear = SchoolYear::find(1);
$schoolYear->setAsActive();

// Set a term as active
$term = SchoolTerm::find(1);
$term->setAsActive();
```