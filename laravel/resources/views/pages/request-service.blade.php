@extends('layouts.site')

@section('content')
    <section class="section-pad mx-auto max-w-3xl py-12">
        <h1 class="text-3xl font-semibold">اطلب خدمة</h1>
        <p class="mt-3 text-mint">أخبرنا بالمهمة وسنتواصل معك بعد مطابقة مشغّل مناسب.</p>

        @if (session('success'))
            <p class="mt-4 rounded-xl bg-sand/20 px-4 py-3 text-sand">{{ session('success') }}</p>
        @endif

        <form method="post" action="{{ route('request-service.store') }}" class="mt-8 grid gap-4">
            @csrf
            <label class="grid gap-1 text-sm">الاسم
                <input name="fullName" required class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-ink" value="{{ old('fullName') }}">
            </label>
            <label class="grid gap-1 text-sm">الجهة
                <input name="organization" class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-ink" value="{{ old('organization') }}">
            </label>
            <label class="grid gap-1 text-sm">الجوال
                <input name="phone" required class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-ink" value="{{ old('phone') }}">
            </label>
            <label class="grid gap-1 text-sm">البريد
                <input type="email" name="email" required class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-ink" value="{{ old('email') }}">
            </label>
            <label class="grid gap-1 text-sm">المدينة
                <select name="city" required class="rounded-xl border border-white/15 bg-brand px-3 py-2">
                    @foreach ($cities as $city)
                        <option value="{{ $city }}">{{ $city }}</option>
                    @endforeach
                </select>
            </label>
            <label class="grid gap-1 text-sm">الخدمة
                <select name="service" required class="rounded-xl border border-white/15 bg-brand px-3 py-2">
                    @foreach ($services as $service)
                        <option value="{{ $service->title }}">{{ $service->title }}</option>
                    @endforeach
                </select>
            </label>
            <label class="grid gap-1 text-sm">تفاصيل إضافية
                <textarea name="notes" rows="4" class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-ink">{{ old('notes') }}</textarea>
            </label>
            @if ($errors->any())
                <p class="text-sm text-red-300">{{ $errors->first() }}</p>
            @endif
            <button class="rounded-full bg-sand px-5 py-2.5 font-semibold text-ink-dark">إرسال الطلب</button>
        </form>
    </section>
@endsection
