<?php

namespace App\Models\System;

use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'date',
        'type',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }
}
