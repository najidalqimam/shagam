<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Cms;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'content' => Cms::localizedContent(),
            'settings' => Cms::localizedSettings(),
        ]);
    }
}
