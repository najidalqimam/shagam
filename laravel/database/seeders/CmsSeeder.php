<?php

namespace Database\Seeders;

use App\Models\DroneAircraft;
use App\Models\DroneManufacturer;
use App\Models\Faq;
use App\Models\ServiceOffering;
use App\Models\SiteContent;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@shagam.sa'],
            [
                'name' => 'Admin',
                'password' => Hash::make('shagam-admin'),
            ],
        );

        $content = $this->readJson('site-content.json');
        $settings = $this->readJson('settings.json');

        foreach (['ar', 'en'] as $locale) {
            if (! empty($content[$locale])) {
                SiteContent::query()->updateOrCreate(
                    ['locale' => $locale],
                    ['payload' => $content[$locale]],
                );

                Faq::query()->where('locale', $locale)->delete();
                foreach ($content[$locale]['faqs'] ?? [] as $i => $faq) {
                    Faq::query()->create([
                        'locale' => $locale,
                        'sort_order' => $i,
                        'question' => $faq['q'] ?? '',
                        'answer' => $faq['a'] ?? '',
                    ]);
                }

                ServiceOffering::query()->where('locale', $locale)->delete();
                foreach ($content[$locale]['services'] ?? [] as $i => $service) {
                    ServiceOffering::query()->create([
                        'locale' => $locale,
                        'sort_order' => $i,
                        'title' => $service['title'] ?? '',
                        'body' => $service['body'] ?? '',
                        'meta' => $service['meta'] ?? null,
                        'kind' => $service['kind'] ?? null,
                    ]);
                }
            }

            if (! empty($settings[$locale])) {
                SiteSetting::query()->updateOrCreate(
                    ['locale' => $locale],
                    ['payload' => $settings[$locale]],
                );
            }
        }

        $catalog = $this->readJson('drone-catalog.json');
        foreach ($catalog['manufacturers'] ?? [] as $maker) {
            $manufacturer = DroneManufacturer::query()->updateOrCreate(
                ['external_id' => $maker['id'] ?? null],
                ['name' => $maker['name'] ?? ''],
            );

            foreach ($maker['models'] ?? [] as $model) {
                DroneAircraft::query()->updateOrCreate(
                    ['external_id' => $model['id'] ?? null],
                    [
                        'drone_manufacturer_id' => $manufacturer->id,
                        'name' => $model['name'] ?? '',
                    ],
                );
            }
        }
    }

    private function readJson(string $file): array
    {
        $path = database_path('seeders/data/'.$file);
        if (! is_file($path)) {
            return [];
        }

        return json_decode((string) file_get_contents($path), true) ?: [];
    }
}
