<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::get('/content', [ContentController::class, 'show']);
Route::get('/catalog', [CatalogController::class, 'show']);
Route::post('/submissions', [SubmissionController::class, 'store']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminController::class, 'login']);

    Route::middleware('admin.api')->group(function () {
        Route::get('/session', [AdminController::class, 'session']);
        Route::post('/logout', [AdminController::class, 'logout']);
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/content', [AdminController::class, 'content']);
        Route::put('/content', [AdminController::class, 'updateContent']);
        Route::get('/settings', [AdminController::class, 'settings']);
        Route::put('/settings', [AdminController::class, 'updateSettings']);
        Route::get('/submissions', [AdminController::class, 'submissions']);
        Route::patch('/submissions', [AdminController::class, 'updateSubmission']);
        Route::delete('/submissions', [AdminController::class, 'destroySubmission']);
        Route::get('/catalog', [AdminController::class, 'catalog']);
        Route::put('/catalog', [AdminController::class, 'updateCatalog']);
        Route::get('/uploads', [AdminController::class, 'upload']);
    });
});
