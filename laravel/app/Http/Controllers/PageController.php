<?php

namespace App\Http\Controllers;

use App\Models\DroneManufacturer;
use App\Support\Cms;
use Illuminate\View\View;

class PageController extends Controller
{
    public function requestService(): View
    {
        return view('pages.request-service', [
            'content' => Cms::content(),
            'settings' => Cms::settings(),
            'services' => Cms::services(),
            'cities' => Cms::content()['cities'] ?? [],
        ]);
    }

    public function joinOperator(): View
    {
        return view('pages.join-operator', [
            'content' => Cms::content(),
            'settings' => Cms::settings(),
            'cities' => Cms::content()['cities'] ?? [],
            'manufacturers' => DroneManufacturer::query()->with('aircraft')->orderBy('name')->get(),
        ]);
    }

    public function privacy(): View
    {
        return view('pages.privacy', [
            'settings' => Cms::settings(),
        ]);
    }

    public function terms(): View
    {
        return view('pages.terms', [
            'settings' => Cms::settings(),
        ]);
    }
}
