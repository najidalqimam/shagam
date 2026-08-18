<?php

namespace Tests\Feature;

use App\Models\SiteContent;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_root_identifies_the_api(): void
    {
        $this->getJson('/')
            ->assertOk()
            ->assertJsonPath('service', 'shagam-api');
    }

    public function test_public_content_endpoint(): void
    {
        SiteContent::query()->create([
            'locale' => 'ar',
            'payload' => ['hero' => ['title' => 'شاغم']],
        ]);
        SiteContent::query()->create([
            'locale' => 'en',
            'payload' => ['hero' => ['title' => 'Shagam']],
        ]);
        SiteSetting::query()->create([
            'locale' => 'ar',
            'payload' => ['siteName' => 'شاغم'],
        ]);
        SiteSetting::query()->create([
            'locale' => 'en',
            'payload' => ['siteName' => 'Shagam'],
        ]);

        $this->getJson('/api/content')
            ->assertOk()
            ->assertJsonPath('content.ar.hero.title', 'شاغم')
            ->assertJsonPath('settings.ar.siteName', 'شاغم');
    }

    public function test_admin_login_and_protected_stats(): void
    {
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@shagam.sa',
            'password' => Hash::make('shagam-admin'),
        ]);

        $this->getJson('/api/admin/stats')->assertUnauthorized();

        $login = $this->postJson('/api/admin/login', [
            'password' => 'shagam-admin',
        ])->assertOk();

        $token = $login->json('token');
        $this->assertIsString($token);

        $this->withToken($token)
            ->getJson('/api/admin/stats')
            ->assertOk()
            ->assertJsonStructure(['services', 'faqs', 'submissionsTotal']);
    }
}
