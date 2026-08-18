@extends('layouts.admin')

@section('title', 'الكتالوج')

@section('content')
    <h1 class="text-2xl font-semibold">كتالوج الطائرات</h1>
    <div class="mt-6 overflow-x-auto rounded-xl border border-brand/10 bg-white">
        <table class="w-full text-right text-sm">
            <thead class="bg-brand/5 text-ink-dark-muted">
                <tr>
                    <th class="px-3 py-2 font-medium">الشركة</th>
                    <th class="px-3 py-2 font-medium">عدد الطرازات</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($manufacturers as $maker)
                    <tr class="border-t border-brand/10">
                        <td class="px-3 py-2">{{ $maker->name }}</td>
                        <td class="px-3 py-2">{{ $maker->aircraft_count }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="mt-4">{{ $manufacturers->links() }}</div>
@endsection
