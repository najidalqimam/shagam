<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Cms;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(Cms::catalogPayload());
    }
}
