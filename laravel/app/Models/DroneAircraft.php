<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DroneAircraft extends Model
{
    protected $table = 'drone_aircraft';

    protected $fillable = ['drone_manufacturer_id', 'external_id', 'name'];

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(DroneManufacturer::class, 'drone_manufacturer_id');
    }
}
