<?php

namespace App\Support;

use App\Models\Faq;
use App\Models\ServiceOffering;
use App\Models\SiteContent;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class Cms
{
    public static function locale(): string
    {
        $locale = session('locale', config('app.locale', 'ar'));

        return in_array($locale, ['ar', 'en'], true) ? $locale : 'ar';
    }

    public static function dir(): string
    {
        return self::locale() === 'ar' ? 'rtl' : 'ltr';
    }

    public static function content(?string $locale = null): array
    {
        $locale ??= self::locale();

        return Cache::remember("cms.content.$locale", 60, function () use ($locale) {
            try {
                return SiteContent::query()->where('locale', $locale)->value('payload') ?? [];
            } catch (\Throwable) {
                return [];
            }
        });
    }

    public static function settings(?string $locale = null): array
    {
        $locale ??= self::locale();

        return Cache::remember("cms.settings.$locale", 60, function () use ($locale) {
            try {
                return SiteSetting::query()->where('locale', $locale)->value('payload') ?? [];
            } catch (\Throwable) {
                return [];
            }
        });
    }

    public static function faqs(?string $locale = null)
    {
        $locale ??= self::locale();

        return Faq::query()->where('locale', $locale)->orderBy('sort_order')->get();
    }

    public static function services(?string $locale = null)
    {
        $locale ??= self::locale();

        return ServiceOffering::query()->where('locale', $locale)->orderBy('sort_order')->get();
    }

    public static function forget(): void
    {
        Cache::forget('cms.content.ar');
        Cache::forget('cms.content.en');
        Cache::forget('cms.settings.ar');
        Cache::forget('cms.settings.en');
    }
}
