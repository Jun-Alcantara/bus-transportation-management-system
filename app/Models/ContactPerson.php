<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactPerson extends Model
{
    protected $table = 'contact_persons';
    protected $fillable = [
        'client_id',
        'school_id',
        'name',
        'title',
        'mobile_number',
        'telephone_number',
        'email',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
