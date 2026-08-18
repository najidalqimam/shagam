<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DroneAircraft;
use App\Models\Faq;
use App\Models\ServiceOffering;
use App\Models\Submission;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        return view('admin.dashboard', [
            'stats' => [
                'services' => ServiceOffering::query()->where('locale', 'ar')->count(),
                'faqs' => Faq::query()->where('locale', 'ar')->count(),
                'submissions' => Submission::query()->count(),
                'new' => Submission::query()->where('status', 'new')->count(),
                'aircraft' => DroneAircraft::query()->count(),
            ],
        ]);
    }
}
