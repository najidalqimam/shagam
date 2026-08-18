<!DOCTYPE html>
<html lang="{{ $locale ?? 'ar' }}" dir="{{ $dir ?? 'rtl' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $settings['siteName'] ?? 'شاغم' }} — {{ $settings['tagline'] ?? '' }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-bg text-ink antialiased">
    <header class="sticky top-0 z-50 border-b border-white/10 bg-brand/95 backdrop-blur">
        <div class="section-pad mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3">
            <a href="{{ route('home') }}" class="justify-self-start">
                <img src="{{ asset('logo-shagam-white.png') }}" alt="شاغم — منصة خدمات الطائرات المسيّرة" class="h-10 w-auto max-w-[190px] object-contain">
            </a>
            <nav class="hidden items-center gap-1 rounded-full border border-white/12 bg-white/10 px-1.5 py-1 lg:flex">
                @foreach (($content['navLinks'] ?? []) as $link)
                    <a href="{{ str_starts_with($link['href'] ?? '', '#') ? url('/').$link['href'] : url($link['href']) }}" class="rounded-full px-3 py-1.5 text-sm font-semibold text-mint hover:bg-white/10 hover:text-ink">
                        {{ $link['label'] }}
                    </a>
                @endforeach
            </nav>
            <div class="flex items-center justify-end gap-2 justify-self-end">
                <form method="post" action="{{ route('locale', $locale === 'ar' ? 'en' : 'ar') }}">
                    @csrf
                    <button class="size-9 rounded-full border border-white/30 text-xs font-bold">{{ $locale === 'ar' ? 'EN' : 'عربي' }}</button>
                </form>
                <a href="{{ route('join-operator') }}" class="hidden whitespace-nowrap rounded-full border border-white/40 px-4 py-2 text-sm font-semibold lg:inline-flex">{{ $locale === 'ar' ? 'انضم كمشغّل' : 'Join as operator' }}</a>
                <a href="{{ route('request-service') }}" class="whitespace-nowrap rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink-dark">{{ $locale === 'ar' ? 'اطلب خدمة' : 'Request a service' }}</a>
            </div>
        </div>
    </header>

    <main>
        @yield('content')
    </main>

    <footer class="border-t border-white/10 bg-brand-deep py-8 text-sm text-mint">
        <div class="section-pad mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div>
                <img src="{{ asset('logo-shagam-white.png') }}" alt="شاغم" class="mb-3 h-10 w-auto max-w-[200px] object-contain">
                <p>{{ $settings['footerText'] ?? '' }}</p>
                <p class="mt-1">{{ $settings['copyrightName'] ?? '' }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-4">
                <a href="{{ route('privacy') }}" class="hover:text-ink">{{ $locale === 'ar' ? 'الخصوصية' : 'Privacy' }}</a>
                <a href="{{ route('terms') }}" class="hover:text-ink">{{ $locale === 'ar' ? 'الشروط' : 'Terms' }}</a>
            </div>
        </div>
    </footer>
</body>
</html>
