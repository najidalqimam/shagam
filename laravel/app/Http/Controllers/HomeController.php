<?php

namespace App\Http\Controllers;

use App\Support\Cms;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function index(): View
    {
        return view('home', [
            'content' => Cms::content(),
            'settings' => Cms::settings(),
            'faqs' => Cms::faqs(),
            'services' => Cms::services(),
        ]);
    }

    public function locale(string $locale): RedirectResponse
    {
        if (! in_array($locale, ['ar', 'en'], true)) {
            $locale = 'ar';
        }

        session(['locale' => $locale]);

        return back();
    }
}
