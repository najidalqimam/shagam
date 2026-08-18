<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'ok' => true,
        'service' => 'shagam-api',
        'message' => 'Laravel API only. The public site and admin UI are served by Next.js.',
        'endpoints' => [
            'GET /api/content',
            'GET /api/catalog',
            'POST /api/submissions',
            'POST /api/admin/login',
        ],
    ]);
});
