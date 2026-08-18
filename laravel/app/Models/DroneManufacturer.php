<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DroneManufacturer extends Model
{
    protected $fillable = ['external_id', 'name'];

    public function aircraft(): HasMany
    {
        return $this->hasMany(DroneAircraft::class);
    }
}
