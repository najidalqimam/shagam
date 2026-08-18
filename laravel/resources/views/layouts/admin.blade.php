<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>لوحة شاغم — @yield('title', 'الإدارة')</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-bg-soft text-ink-dark antialiased">
    <div class="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside class="bg-brand p-5 text-ink">
            <a href="{{ route('admin.dashboard') }}" class="block text-xl font-bold">شاغم</a>
            <p class="mt-1 text-xs text-mint">لوحة التحكم</p>
            <nav class="mt-8 grid gap-1 text-sm">
                <a href="{{ route('admin.dashboard') }}" class="rounded-lg px-3 py-2 hover:bg-white/10">نظرة عامة</a>
                <a href="{{ route('admin.content') }}" class="rounded-lg px-3 py-2 hover:bg-white/10">المحتوى</a>
                <a href="{{ route('admin.submissions') }}" class="rounded-lg px-3 py-2 hover:bg-white/10">الطلبات</a>
                <a href="{{ route('admin.catalog') }}" class="rounded-lg px-3 py-2 hover:bg-white/10">كتالوج الطائرات</a>
                <a href="{{ route('home') }}" class="rounded-lg px-3 py-2 hover:bg-white/10" target="_blank">الموقع</a>
            </nav>
            <form method="post" action="{{ route('admin.logout') }}" class="mt-8">
                @csrf
                <button class="text-sm text-mint hover:text-ink">خروج</button>
            </form>
        </aside>
        <div class="p-6">
            @if (session('success'))
                <p class="mb-4 rounded-xl bg-brand/10 px-4 py-3 text-sm text-brand">{{ session('success') }}</p>
            @endif
            @yield('content')
        </div>
    </div>
</body>
</html>
