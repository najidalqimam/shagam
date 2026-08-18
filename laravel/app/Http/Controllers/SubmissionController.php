<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubmissionController extends Controller
{
    public function storeService(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'fullName' => ['required', 'string', 'max:120'],
            'organization' => ['nullable', 'string', 'max:160'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:160'],
            'city' => ['required', 'string', 'max:80'],
            'service' => ['required', 'string', 'max:160'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        Submission::query()->create([
            'type' => 'service_request',
            'status' => 'new',
            'payload' => $data,
        ]);

        return back()->with('success', 'تم استلام طلبك وسنتواصل معك قريباً.');
    }

    public function storeOperator(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'fullName' => ['required', 'string', 'max:120'],
            'organization' => ['nullable', 'string', 'max:160'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:160'],
            'city' => ['required', 'string', 'max:80'],
            'operatingSector' => ['nullable', 'string', 'max:160'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'license' => ['nullable', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png'],
        ]);

        $path = null;
        if ($request->hasFile('license')) {
            $file = $request->file('license');
            $name = Str::uuid().'_'.preg_replace('/[^\w.\-]+/', '_', $file->getClientOriginalName());
            $path = $file->storeAs('uploads', $name, 'public');
            $data['license'] = [
                'originalName' => $file->getClientOriginalName(),
                'storedName' => $name,
                'mimeType' => $file->getMimeType(),
                'size' => $file->getSize(),
            ];
        }

        Submission::query()->create([
            'type' => 'operator_join',
            'status' => 'new',
            'payload' => $data,
            'license_path' => $path,
        ]);

        return back()->with('success', 'تم استلام تسجيلك وسنراجع ملفك بعد التحقق.');
    }
}
