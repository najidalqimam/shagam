<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubmissionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $isMultipart = str_contains((string) $request->header('Content-Type'), 'multipart/form-data');

        if ($isMultipart) {
            return $this->storeMultipart($request);
        }

        $payload = $request->json()->all();
        if (! is_array($payload) || $payload === []) {
            $payload = $request->all();
        }

        unset($payload['_token']);

        $submission = Submission::query()->create([
            'type' => $this->resolveType($payload, false),
            'status' => 'new',
            'payload' => $payload,
        ]);

        return response()->json([
            'ok' => true,
            'id' => (string) $submission->id,
        ], 201);
    }

    private function storeMultipart(Request $request): JsonResponse
    {
        $role = (string) $request->input('role', '');
        $isOperator = $this->isOperatorRole($role);

        $fleet = null;
        $fleetRaw = $request->input('fleet');
        if (is_string($fleetRaw) && trim($fleetRaw) !== '') {
            $decoded = json_decode($fleetRaw, true);
            if (! is_array($decoded)) {
                return response()->json(['error' => 'Invalid fleet payload'], 400);
            }
            $fleet = $decoded;
        }

        $payload = [
            'role' => $role,
            'fullName' => (string) $request->input('fullName', ''),
            'organization' => (string) $request->input('organization', ''),
            'phone' => (string) $request->input('phone', ''),
            'email' => (string) $request->input('email', ''),
            'city' => (string) $request->input('city', ''),
            'service' => $isOperator ? null : (string) $request->input('service', ''),
            'operatingSector' => $isOperator ? (string) $request->input('operatingSector', '') : null,
            'notes' => (string) $request->input('notes', ''),
        ];

        if (is_array($fleet)) {
            $payload = array_merge($payload, $fleet);
        }

        $licensePath = null;
        if ($isOperator) {
            $request->validate([
                'license' => ['required', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png'],
            ]);

            $file = $request->file('license');
            $originalName = preg_replace('/[^\w.\-()\x{0600}-\x{06FF} ]+/u', '_', $file->getClientOriginalName() ?: 'license') ?: 'license';
            $storedName = 'sub_'.Str::lower(Str::random(12)).'_'.$originalName;
            $licensePath = $file->storeAs('uploads', $storedName, 'public');

            $payload['license'] = [
                'originalName' => $file->getClientOriginalName(),
                'storedName' => $storedName,
                'mimeType' => $file->getMimeType(),
                'size' => $file->getSize(),
            ];
        }

        $submission = Submission::query()->create([
            'type' => $this->resolveType($payload, $isOperator),
            'status' => 'new',
            'payload' => $payload,
            'license_path' => $licensePath,
        ]);

        return response()->json([
            'ok' => true,
            'id' => (string) $submission->id,
        ], 201);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function resolveType(array $payload, bool $isOperator): string
    {
        if ($isOperator || $this->isOperatorRole((string) ($payload['role'] ?? ''))) {
            return 'operator_join';
        }

        return 'service_request';
    }

    private function isOperatorRole(string $role): bool
    {
        return str_contains($role, 'مشغ') || str_contains(strtolower($role), 'operator');
    }
}
