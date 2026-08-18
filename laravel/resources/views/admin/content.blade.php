@extends('layouts.admin')

@section('title', 'المحتوى')

@section('content')
    <h1 class="text-2xl font-semibold">محتوى الموقع</h1>
    <p class="mt-2 text-sm text-ink-dark-muted">عدّل JSON ثم احفظ. استخدم JSON صالحاً بالأحرف العربية.</p>

    @error('payload')
        <p class="mt-3 text-sm text-red-600">{{ $message }}</p>
    @enderror

    <form method="post" action="{{ route('admin.content.update') }}" class="mt-6 grid gap-4">
        @csrf
        <label class="grid gap-2 text-sm font-semibold">المحتوى
            <textarea name="payload" rows="18" class="rounded-xl border border-brand/15 bg-white p-3 font-mono text-xs" dir="ltr">{{ old('payload', json_encode($content->payload ?? [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) }}</textarea>
        </label>
        <label class="grid gap-2 text-sm font-semibold">الإعدادات
            <textarea name="settings" rows="10" class="rounded-xl border border-brand/15 bg-white p-3 font-mono text-xs" dir="ltr">{{ old('settings', json_encode($settings->payload ?? [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) }}</textarea>
        </label>
        <button class="w-fit rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink">حفظ</button>
    </form>
@endsection
