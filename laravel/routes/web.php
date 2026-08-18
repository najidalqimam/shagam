<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CatalogController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SubmissionController as AdminSubmissionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/locale/{locale}', [HomeController::class, 'locale'])->name('locale');

Route::get('/request-service', [PageController::class, 'requestService'])->name('request-service');
Route::post('/request-service', [SubmissionController::class, 'storeService'])->name('request-service.store');

Route::get('/join-operator', [PageController::class, 'joinOperator'])->name('join-operator');
Route::post('/join-operator', [SubmissionController::class, 'storeOperator'])->name('join-operator.store');

Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthController::class, 'show'])->name('login');
        Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    });
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::middleware('auth')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/content', [ContentController::class, 'edit'])->name('content');
        Route::post('/content', [ContentController::class, 'update'])->name('content.update');
        Route::get('/submissions', [AdminSubmissionController::class, 'index'])->name('submissions');
        Route::patch('/submissions/{submission}', [AdminSubmissionController::class, 'update'])->name('submissions.update');
        Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog');
    });
});
