<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DroneAircraft;
use App\Models\Faq;
use App\Models\ServiceOffering;
use App\Models\SiteContent;
use App\Models\Submission;
use App\Models\User;
use App\Support\Cms;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'password' => ['required', 'string'],
            'email' => ['nullable', 'email'],
        ]);

        $email = $data['email'] ?? 'admin@shagam.sa';
        $user = User::query()->where('email', $email)->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'ok' => false,
                'error' => 'كلمة المرور غير صحيحة',
            ], 401);
        }

        $token = Str::random(80);
        Cache::put('api.admin.'.$token, $user->id, now()->addDays(7));

        return response()->json([
            'ok' => true,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function session(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'authenticated' => true,
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ] : null,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->bearerToken() ?: $request->header('X-Admin-Token');
        if (is_string($token) && $token !== '') {
            Cache::forget('api.admin.'.$token);
        }

        return response()->json(['ok' => true]);
    }

    public function stats(): JsonResponse
    {
        $content = Cms::content('ar');
        $submissions = Submission::query()->latest()->get();

        return response()->json([
            'services' => is_array($content['services'] ?? null)
                ? count($content['services'])
                : ServiceOffering::query()->where('locale', 'ar')->count(),
            'faqs' => is_array($content['faqs'] ?? null)
                ? count($content['faqs'])
                : Faq::query()->where('locale', 'ar')->count(),
            'cities' => is_array($content['cities'] ?? null) ? count($content['cities']) : 0,
            'submissionsTotal' => $submissions->count(),
            'submissionsNew' => $submissions->where('status', 'new')->count(),
            'submissionsReviewed' => $submissions->where('status', 'reviewed')->count(),
            'submissionsArchived' => $submissions->where('status', 'archived')->count(),
            'aircraft' => DroneAircraft::query()->count(),
            'recentSubmissions' => $submissions->take(6)->map(fn (Submission $s) => Cms::serializeSubmission($s))->values(),
        ]);
    }

    public function content(): JsonResponse
    {
        return response()->json(Cms::localizedContent());
    }

    public function updateContent(Request $request): JsonResponse
    {
        $body = $request->all();

        if (isset($body['ar'], $body['en']) && is_array($body['ar']) && is_array($body['en'])) {
            Cms::saveLocalizedContent($body['ar'], $body['en']);
        } else {
            $current = Cms::localizedContent();
            Cms::saveLocalizedContent($body, $current['en'] ?? []);
        }

        return response()->json(['ok' => true]);
    }

    public function settings(): JsonResponse
    {
        return response()->json(Cms::localizedSettings());
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $body = $request->all();

        if (isset($body['ar'], $body['en']) && is_array($body['ar']) && is_array($body['en'])) {
            Cms::saveLocalizedSettings($body['ar'], $body['en']);
        } else {
            $current = Cms::localizedSettings();
            Cms::saveLocalizedSettings($body, $current['en'] ?? []);
        }

        return response()->json(['ok' => true]);
    }

    public function submissions(): JsonResponse
    {
        $items = Submission::query()
            ->latest()
            ->get()
            ->map(fn (Submission $s) => Cms::serializeSubmission($s))
            ->values();

        return response()->json($items);
    }

    public function updateSubmission(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['required'],
            'status' => ['required', 'in:new,reviewed,archived'],
        ]);

        $submission = Submission::query()->find($data['id']);
        if (! $submission) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $submission->update(['status' => $data['status']]);

        return response()->json(Cms::serializeSubmission($submission->fresh()));
    }

    public function destroySubmission(Request $request): JsonResponse
    {
        $id = $request->input('id');
        if ($id === null || $id === '') {
            return response()->json(['error' => 'Invalid body'], 400);
        }

        $submission = Submission::query()->find($id);
        if (! $submission) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $submission->delete();

        return response()->json(['ok' => true]);
    }

    public function catalog(): JsonResponse
    {
        $catalog = Cms::catalogPayload();

        return response()->json([
            ...$catalog,
            'manufacturersCount' => count($catalog['manufacturers']),
            'modelsCount' => collect($catalog['manufacturers'])->sum(fn ($m) => count($m['models'] ?? [])),
        ]);
    }

    public function updateCatalog(Request $request): JsonResponse
    {
        $manufacturers = $request->input('manufacturers');
        if (! is_array($manufacturers)) {
            return response()->json(['error' => 'Invalid body'], 400);
        }

        Cms::replaceCatalog([
            'version' => (int) $request->input('version', 1),
            'source' => (string) $request->input('source', 'admin'),
            'manufacturers' => $manufacturers,
        ]);

        return response()->json(['ok' => true]);
    }

    public function upload(Request $request): BinaryFileResponse|JsonResponse
    {
        $file = (string) $request->query('file', '');
        if ($file === '' || str_contains($file, '..') || str_contains($file, '/') || str_contains($file, '\\')) {
            return response()->json(['error' => 'Invalid file'], 400);
        }

        $path = storage_path('app/public/uploads/'.$file);
        if (! is_file($path)) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->file($path);
    }
}
