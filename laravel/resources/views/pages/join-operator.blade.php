@extends('layouts.site')

@section('content')
    <section class="section-pad mx-auto max-w-3xl py-12">
        <h1 class="text-3xl font-semibold">انضم كمشغّل</h1>
        <p class="mt-3 text-mint">سجّل بياناتك وأرفق الترخيص للانضمام إلى شبكة شاغم.</p>

        @if (session('success'))
            <p class="mt-4 rounded-xl bg-sand/20 px-4 py-3 text-sand">{{ session('success') }}</p>
        @endif

        <form method="post" action="{{ route('join-operator.store') }}" enctype="multipart/form-data" class="mt-8 grid gap-4">
            @csrf
            <label class="grid gap-1 text-sm">الاسم
                <input name="fullName" required class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-ink" value="{{ old('fullName') }}">
            </label>
            <label class="grid gap-1 text-sm">المنشأة
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
            <label class="grid gap-1 text-sm">قطاع التشغيل
                <input name="operatingSector" class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-ink" value="{{ old('operatingSector') }}">
            </label>
            <label class="grid gap-1 text-sm">رخصة / شهادة
                <input type="file" name="license" accept=".pdf,.jpg,.jpeg,.png" class="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            </label>
            <label class="grid gap-1 text-sm">ملاحظات
                <textarea name="notes" rows="4" class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-ink">{{ old('notes') }}</textarea>
            </label>
            @if ($errors->any())
                <p class="text-sm text-red-300">{{ $errors->first() }}</p>
            @endif
            <button class="rounded-full bg-sand px-5 py-2.5 font-semibold text-ink-dark">إرسال التسجيل</button>
        </form>
    </section>
@endsection
