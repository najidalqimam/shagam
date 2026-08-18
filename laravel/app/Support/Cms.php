<?php

namespace App\Support;

use App\Models\DroneAircraft;
use App\Models\DroneManufacturer;
use App\Models\Faq;
use App\Models\ServiceOffering;
use App\Models\SiteContent;
use App\Models\SiteSetting;
use App\Models\Submission;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class Cms
{
    public static function content(?string $locale = null): array
    {
        $locale ??= 'ar';

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
        $locale ??= 'ar';

        return Cache::remember("cms.settings.$locale", 60, function () use ($locale) {
            try {
                return SiteSetting::query()->where('locale', $locale)->value('payload') ?? [];
            } catch (\Throwable) {
                return [];
            }
        });
    }

    /**
     * @return array{ar: array<string, mixed>, en: array<string, mixed>}
     */
    public static function localizedContent(): array
    {
        return [
            'ar' => self::content('ar'),
            'en' => self::content('en'),
        ];
    }

    /**
     * @return array{ar: array<string, mixed>, en: array<string, mixed>}
     */
    public static function localizedSettings(): array
    {
        $ar = self::settings('ar');
        $en = self::syncSharedSettings($ar, self::settings('en'));

        return ['ar' => $ar, 'en' => $en];
    }

    /**
     * @param  array<string, mixed>  $ar
     * @param  array<string, mixed>  $en
     */
    public static function saveLocalizedContent(array $ar, array $en): void
    {
        SiteContent::query()->updateOrCreate(['locale' => 'ar'], ['payload' => $ar]);
        SiteContent::query()->updateOrCreate(['locale' => 'en'], ['payload' => $en]);
        self::syncLists('ar', $ar);
        self::syncLists('en', $en);
        self::forget();
    }

    /**
     * @param  array<string, mixed>  $ar
     * @param  array<string, mixed>  $en
     */
    public static function saveLocalizedSettings(array $ar, array $en): void
    {
        $en = self::syncSharedSettings($ar, $en);
        SiteSetting::query()->updateOrCreate(['locale' => 'ar'], ['payload' => $ar]);
        SiteSetting::query()->updateOrCreate(['locale' => 'en'], ['payload' => $en]);
        self::forget();
    }

    public static function forget(): void
    {
        Cache::forget('cms.content.ar');
        Cache::forget('cms.content.en');
        Cache::forget('cms.settings.ar');
        Cache::forget('cms.settings.en');
    }

    /**
     * @return array{version: int, generatedAt: string, source: string, manufacturers: list<array{id: string, name: string, models: list<array{id: string, name: string}>}>}
     */
    public static function catalogPayload(): array
    {
        $manufacturers = DroneManufacturer::query()
            ->with(['aircraft' => fn ($q) => $q->orderBy('name')])
            ->orderBy('name')
            ->get()
            ->map(function (DroneManufacturer $maker) {
                return [
                    'id' => $maker->external_id ?: (string) $maker->id,
                    'name' => $maker->name,
                    'models' => $maker->aircraft->map(fn (DroneAircraft $aircraft) => [
                        'id' => $aircraft->external_id ?: (string) $aircraft->id,
                        'name' => $aircraft->name,
                    ])->values()->all(),
                ];
            })
            ->values()
            ->all();

        return [
            'version' => 1,
            'generatedAt' => now()->toIso8601String(),
            'source' => 'database',
            'manufacturers' => $manufacturers,
        ];
    }

    /**
     * @param  array{version?: int, source?: string, manufacturers?: list<array<string, mixed>>}  $catalog
     */
    public static function replaceCatalog(array $catalog): void
    {
        DB::transaction(function () use ($catalog) {
            DroneAircraft::query()->delete();
            DroneManufacturer::query()->delete();

            foreach ($catalog['manufacturers'] ?? [] as $maker) {
                if (! is_array($maker)) {
                    continue;
                }

                $manufacturer = DroneManufacturer::query()->create([
                    'external_id' => (string) ($maker['id'] ?? ''),
                    'name' => (string) ($maker['name'] ?? ''),
                ]);

                foreach ($maker['models'] ?? [] as $model) {
                    if (! is_array($model)) {
                        continue;
                    }

                    DroneAircraft::query()->create([
                        'drone_manufacturer_id' => $manufacturer->id,
                        'external_id' => (string) ($model['id'] ?? ''),
                        'name' => (string) ($model['name'] ?? ''),
                    ]);
                }
            }
        });
    }

    /**
     * @return array{id: string, createdAt: string, status: string, payload: array<string, mixed>}
     */
    public static function serializeSubmission(Submission $submission): array
    {
        return [
            'id' => (string) $submission->id,
            'createdAt' => optional($submission->created_at)?->toIso8601String() ?? now()->toIso8601String(),
            'status' => $submission->status,
            'payload' => is_array($submission->payload) ? $submission->payload : [],
        ];
    }

    /**
     * Shared contact channels stay identical across locales.
     *
     * @param  array<string, mixed>  $primary
     * @param  array<string, mixed>  $secondary
     * @return array<string, mixed>
     */
    public static function syncSharedSettings(array $primary, array $secondary): array
    {
        foreach ([
            'contactEmail',
            'contactPhone',
            'whatsapp',
            'facebookUrl',
            'instagramUrl',
            'twitterUrl',
            'linkedinUrl',
            'adminNotes',
        ] as $key) {
            if (array_key_exists($key, $primary)) {
                $secondary[$key] = $primary[$key];
            }
        }

        return $secondary;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public static function syncLists(string $locale, array $payload): void
    {
        Faq::query()->where('locale', $locale)->delete();
        foreach ($payload['faqs'] ?? [] as $i => $faq) {
            if (! is_array($faq)) {
                continue;
            }
            Faq::query()->create([
                'locale' => $locale,
                'sort_order' => $i,
                'question' => (string) ($faq['q'] ?? ''),
                'answer' => (string) ($faq['a'] ?? ''),
            ]);
        }

        ServiceOffering::query()->where('locale', $locale)->delete();
        foreach ($payload['services'] ?? [] as $i => $service) {
            if (! is_array($service)) {
                continue;
            }
            ServiceOffering::query()->create([
                'locale' => $locale,
                'sort_order' => $i,
                'title' => (string) ($service['title'] ?? ''),
                'body' => (string) ($service['body'] ?? ''),
                'meta' => is_scalar($service['meta'] ?? null) ? (string) $service['meta'] : null,
                'kind' => is_scalar($service['kind'] ?? null) ? (string) $service['kind'] : null,
            ]);
        }
    }
}
