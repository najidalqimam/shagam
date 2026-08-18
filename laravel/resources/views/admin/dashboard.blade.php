@extends('layouts.admin')

@section('title', 'نظرة عامة')

@section('content')
    <h1 class="text-2xl font-semibold">نظرة عامة</h1>
    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <article class="rounded-xl border border-brand/10 bg-white p-4">
            <p class="text-sm text-ink-dark-muted">الخدمات</p>
            <p class="mt-2 text-2xl font-semibold">{{ $stats['services'] }}</p>
        </article>
        <article class="rounded-xl border border-brand/10 bg-white p-4">
            <p class="text-sm text-ink-dark-muted">الأسئلة</p>
            <p class="mt-2 text-2xl font-semibold">{{ $stats['faqs'] }}</p>
        </article>
        <article class="rounded-xl border border-brand/10 bg-white p-4">
            <p class="text-sm text-ink-dark-muted">كل الطلبات</p>
            <p class="mt-2 text-2xl font-semibold">{{ $stats['submissions'] }}</p>
        </article>
        <article class="rounded-xl border border-brand/10 bg-white p-4">
            <p class="text-sm text-ink-dark-muted">جديدة</p>
            <p class="mt-2 text-2xl font-semibold">{{ $stats['new'] }}</p>
        </article>
        <article class="rounded-xl border border-brand/10 bg-white p-4">
            <p class="text-sm text-ink-dark-muted">طرازات الطائرات</p>
            <p class="mt-2 text-2xl font-semibold">{{ $stats['aircraft'] }}</p>
        </article>
    </div>
@endsection
