<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceOffering extends Model
{
    protected $fillable = ['locale', 'sort_order', 'title', 'body', 'meta', 'kind'];
}
