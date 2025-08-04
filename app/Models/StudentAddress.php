<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAddress extends Model
{
    protected $fillable = [
        'student_id',
        'address_code',
        'zip_code',
        'street_number',
        'apt_number',
        'street_name',
        'corner_street',
        'city',
        'address_district',
        'state',
        'google_maps_link',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function getFullAddressAttribute(): string
    {
        $address = $this->street_number . ' ' . $this->street_name;
        
        if ($this->apt_number) {
            $address .= ', Apt ' . $this->apt_number;
        }
        
        $address .= ', ' . $this->city . ', ' . $this->state . ' ' . $this->zip_code;
        
        return $address;
    }
}
