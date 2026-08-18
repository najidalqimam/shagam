<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\SiteSetting;
use App\Support\Cms;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ContentController extends Controller
{
    public function edit(): View
    {
        return view('admin.content', [
            'content' => SiteContent::query()->where('locale', 'ar')->first(),
            'settings' => SiteSetting::query()->where('locale', 'ar')->first(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $payload = $request->validate([
            'payload' => ['required', 'string'],
            'settings' => ['required', 'string'],
        ]);

        $content = json_decode($payload['payload'], true);
        $settings = json_decode($payload['settings'], true);

        if (! is_array($content) || ! is_array($settings)) {
            return back()->withErrors(['payload' => 'JSON غير صالح.']);
        }

        SiteContent::query()->updateOrCreate(['locale' => 'ar'], ['payload' => $content]);
        SiteSetting::query()->updateOrCreate(['locale' => 'ar'], ['payload' => $settings]);
        Cms::forget();

        return back()->with('success', 'تم حفظ المحتوى.');
    }
}
