<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>دخول لوحة شاغم</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="grid min-h-screen place-items-center bg-brand text-ink antialiased">
    <form method="post" action="{{ route('admin.login.store') }}" class="w-full max-w-sm rounded-2xl border border-white/15 bg-white/5 p-6">
        @csrf
        <img src="{{ asset('logo-shagam-white.png') }}" alt="شاغم" class="mb-4 h-10 w-auto max-w-[180px] object-contain">
        <h1 class="text-2xl font-semibold">لوحة شاغم</h1>
        <p class="mt-2 text-sm text-mint">سجّل الدخول لإدارة المحتوى والطلبات.</p>
        <label class="mt-6 grid gap-1 text-sm">البريد
            <input type="email" name="email" value="{{ old('email') }}" required class="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
        </label>
        <label class="mt-3 grid gap-1 text-sm">كلمة المرور
            <input type="password" name="password" required class="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
        </label>
        @error('email')
            <p class="mt-3 text-sm text-red-300">{{ $message }}</p>
        @enderror
        <button class="mt-5 w-full rounded-full bg-sand py-2.5 font-semibold text-ink-dark">دخول</button>
    </form>
</body>
</html>
