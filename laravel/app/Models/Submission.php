<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = ['type', 'status', 'payload', 'license_path'];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
        ];
    }
}
