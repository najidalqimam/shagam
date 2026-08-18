@extends('layouts.site')

@section('content')
    @php
        $hero = $content['hero'] ?? [];
        $how = $content['how'] ?? [];
        $why = $content['why'] ?? [];
        $enterprise = $content['enterprise'] ?? [];
        $compliance = $content['compliance'] ?? [];
        $faq = $content['faq'] ?? [];
        $contact = $content['contact'] ?? [];
        $servicesSection = $content['servicesSection'] ?? [];
        $steps = $content['steps'] ?? [];
        $whyItems = $content['whyItems'] ?? [];
        $enterpriseItems = $content['enterpriseItems'] ?? [];
        $complianceItems = $content['complianceItems'] ?? [];
        $stats = $content['stats'] ?? [];
    @endphp

    <section class="section-pad mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-2 lg:items-center">
        <div>
            <p class="mb-2 text-sm tracking-[0.2em] text-sand">{{ $hero['eyebrow'] ?? '' }}</p>
            <h1 class="max-w-[18ch] text-3xl font-semibold leading-snug">{{ $hero['title'] ?? '' }}</h1>
            <p class="mt-4 max-w-xl text-mint">{{ $hero['body'] ?? '' }}</p>
            <div class="mt-6 flex flex-wrap gap-2">
                <a href="{{ route('request-service') }}" class="rounded-full bg-sand px-5 py-2.5 text-sm font-semibold text-ink-dark">{{ $hero['primaryCta'] ?? 'اطلب خدمة' }}</a>
                <a href="#how" class="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold">{{ $hero['secondaryCta'] ?? '' }}</a>
            </div>
        </div>
        <div class="grid gap-2 sm:grid-cols-3">
            @foreach (array_slice($content['heroCards'] ?? [['title'=>'طلب محدد','body'=>'تحدد متطلبات المهمة'],['title'=>'مشغّل مؤهّل','body'=>'نطابق المشغّل المناسب'],['title'=>'نتيجة موثّقة','body'=>'تسليم بإثبات إنجاز']], 0, 3) as $i => $card)
                <article class="rounded-xl border border-white/12 bg-white/5 p-4">
                    <p class="text-xs text-sand">{{ str_pad($i + 1, 2, '0', STR_PAD_LEFT) }}</p>
                    <h3 class="mt-2 font-semibold">{{ is_array($card) ? ($card['title'] ?? '') : '' }}</h3>
                    <p class="mt-1 text-sm text-mint">{{ is_array($card) ? ($card['body'] ?? '') : '' }}</p>
                </article>
            @endforeach
        </div>
    </section>

    <section class="border-t border-white/10">
        <div class="section-pad mx-auto grid max-w-6xl gap-3 py-6 sm:grid-cols-2 lg:grid-cols-4">
            @foreach ($stats as $stat)
                <div class="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <p class="text-xl font-semibold text-sand">{{ $stat['value'] ?? '' }}</p>
                    <p class="text-sm text-mint">{{ $stat['label'] ?? '' }}</p>
                </div>
            @endforeach
        </div>
    </section>

    <section id="how" class="border-t border-white/10 bg-bg-soft py-12 text-ink-dark">
        <div class="section-pad mx-auto max-w-6xl">
            <p class="text-center text-sm tracking-[0.2em] text-sand">{{ $how['eyebrow'] ?? '' }}</p>
            <h2 class="mt-2 text-center text-2xl font-semibold">{{ $how['title'] ?? '' }}</h2>
            <p class="mx-auto mt-3 max-w-2xl text-center text-ink-dark-muted">{{ $how['body'] ?? '' }}</p>
            <div class="mt-8 grid gap-3 md:grid-cols-5">
                @foreach ($steps as $step)
                    <article class="rounded-xl border border-brand/15 bg-white p-4">
                        <p class="text-xs text-sand">{{ $step['num'] ?? '' }}</p>
                        <h3 class="mt-2 font-semibold">{{ $step['title'] ?? '' }}</h3>
                        <p class="mt-2 text-sm text-ink-dark-muted">{{ $step['body'] ?? '' }}</p>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section id="services" class="section-pad mx-auto max-w-6xl py-12">
        <p class="text-sm tracking-[0.2em] text-sand">{{ $servicesSection['eyebrow'] ?? '' }}</p>
        <div class="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
                <h2 class="text-2xl font-semibold">{{ $servicesSection['title'] ?? '' }}</h2>
                <p class="mt-2 max-w-2xl text-mint">{{ $servicesSection['body'] ?? '' }}</p>
            </div>
            <a href="{{ route('request-service') }}" class="rounded-full bg-sand px-5 py-2.5 text-sm font-semibold text-ink-dark">{{ $servicesSection['cta'] ?? '' }}</a>
        </div>
        <div class="mt-6 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
            @foreach ($services as $service)
                <details class="px-4 py-3">
                    <summary class="cursor-pointer font-semibold">{{ $service->title }}</summary>
                    <p class="mt-2 text-sm text-mint">{{ $service->body }}</p>
                </details>
            @endforeach
        </div>
    </section>

    <section id="why" class="section-pad mx-auto max-w-6xl py-10">
        <p class="text-sm tracking-[0.2em] text-sand">{{ $why['eyebrow'] ?? '' }}</p>
        <h2 class="mt-2 text-2xl font-semibold">{{ $why['title'] ?? '' }}</h2>
        <p class="mt-3 max-w-2xl text-mint">{{ $why['body'] ?? '' }}</p>
        <div class="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            @foreach ($whyItems as $i => $item)
                <article class="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p class="text-xs text-sand">{{ str_pad($i + 1, 2, '0', STR_PAD_LEFT) }}</p>
                    <h3 class="mt-2 font-semibold">{{ $item['title'] ?? '' }}</h3>
                    <p class="mt-1 text-sm text-mint">{{ $item['body'] ?? '' }}</p>
                </article>
            @endforeach
        </div>
    </section>

    <section id="enterprise" class="bg-bg-soft py-10 text-ink-dark">
        <div class="section-pad mx-auto max-w-6xl">
            <p class="text-sm tracking-[0.2em] text-brand">{{ $enterprise['eyebrow'] ?? '' }}</p>
            <h2 class="mt-2 text-2xl font-semibold">{{ $enterprise['title'] ?? '' }}</h2>
            <p class="mt-3 max-w-2xl text-ink-dark-muted">{{ $enterprise['body'] ?? '' }}</p>
            <div class="mt-6 grid gap-2 sm:grid-cols-3">
                @foreach ($enterpriseItems as $i => $item)
                    <article class="rounded-xl border border-brand/10 bg-white p-3">
                        <p class="text-xs text-brand">{{ str_pad($i + 1, 2, '0', STR_PAD_LEFT) }}</p>
                        <h3 class="mt-2 font-semibold">{{ $item['title'] ?? '' }}</h3>
                        <p class="mt-1 text-sm text-ink-dark-muted">{{ $item['body'] ?? '' }}</p>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section id="compliance" class="section-pad mx-auto max-w-6xl py-10">
        <p class="text-sm tracking-[0.2em] text-sand">{{ $compliance['eyebrow'] ?? '' }}</p>
        <h2 class="mt-2 text-2xl font-semibold">{{ $compliance['title'] ?? '' }}</h2>
        <p class="mt-3 max-w-2xl text-mint">{{ $compliance['body'] ?? '' }}</p>
        <div class="mt-6 grid gap-2 sm:grid-cols-2">
            @foreach ($complianceItems as $i => $item)
                <article class="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-mint">
                    <span class="me-2 text-sand">{{ str_pad($i + 1, 2, '0', STR_PAD_LEFT) }}</span>{{ $item }}
                </article>
            @endforeach
        </div>
    </section>

    <section id="faq" class="section-pad mx-auto max-w-6xl py-10">
        <p class="text-center text-sm tracking-[0.2em] text-sand">{{ $faq['eyebrow'] ?? '' }}</p>
        <h2 class="mt-2 text-center text-2xl font-semibold">{{ $faq['title'] ?? '' }}</h2>
        <div class="mt-6 grid gap-2 md:grid-cols-2">
            @foreach ($faqs as $item)
                <details class="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <summary class="cursor-pointer font-semibold">{{ $item->question }}</summary>
                    <p class="mt-2 text-sm text-mint">{{ $item->answer }}</p>
                </details>
            @endforeach
        </div>
    </section>

    <section id="contact" class="section-pad mx-auto max-w-6xl py-12">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p class="text-sm tracking-[0.2em] text-sand">{{ $contact['eyebrow'] ?? '' }}</p>
            <h2 class="mt-2 text-2xl font-semibold">{{ $contact['title'] ?? '' }}</h2>
            <p class="mt-3 max-w-xl text-mint">{{ $contact['body'] ?? '' }}</p>
            <div class="mt-4 grid gap-1 text-sm text-mint">
                @if (!empty($settings['contactEmail']))
                    <a href="mailto:{{ $settings['contactEmail'] }}">{{ $settings['contactEmail'] }}</a>
                @endif
                @if (!empty($settings['contactPhone']))
                    <p dir="ltr">{{ $settings['contactPhone'] }}</p>
                @endif
            </div>
            <div class="mt-5 flex flex-wrap gap-2">
                <a href="{{ route('request-service') }}" class="rounded-full bg-sand px-5 py-2.5 text-sm font-semibold text-ink-dark">{{ $locale === 'ar' ? 'اطلب خدمة' : 'Request a service' }}</a>
                <a href="{{ route('join-operator') }}" class="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold">{{ $locale === 'ar' ? 'انضم كمشغّل' : 'Join as operator' }}</a>
            </div>
        </div>
    </section>
@endsection
