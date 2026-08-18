@extends('layouts.admin')

@section('title', 'الطلبات')

@section('content')
    <h1 class="text-2xl font-semibold">الطلبات والتسجيلات</h1>
    <div class="mt-6 overflow-x-auto rounded-xl border border-brand/10 bg-white">
        <table class="w-full min-w-[720px] text-right text-sm">
            <thead class="bg-brand/5 text-ink-dark-muted">
                <tr>
                    <th class="px-3 py-2 font-medium">النوع</th>
                    <th class="px-3 py-2 font-medium">الاسم</th>
                    <th class="px-3 py-2 font-medium">الجوال</th>
                    <th class="px-3 py-2 font-medium">الحالة</th>
                    <th class="px-3 py-2 font-medium">التاريخ</th>
                    <th class="px-3 py-2 font-medium"></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($submissions as $submission)
                    <tr class="border-t border-brand/10">
                        <td class="px-3 py-2">{{ $submission->type === 'operator_join' ? 'مشغّل' : 'خدمة' }}</td>
                        <td class="px-3 py-2">{{ $submission->payload['fullName'] ?? '—' }}</td>
                        <td class="px-3 py-2" dir="ltr">{{ $submission->payload['phone'] ?? '—' }}</td>
                        <td class="px-3 py-2">{{ $submission->status }}</td>
                        <td class="px-3 py-2">{{ $submission->created_at?->format('Y-m-d H:i') }}</td>
                        <td class="px-3 py-2">
                            <form method="post" action="{{ route('admin.submissions.update', $submission) }}" class="flex gap-1">
                                @csrf
                                @method('patch')
                                <select name="status" class="rounded-lg border border-brand/20 px-2 py-1 text-xs">
                                    @foreach (['new', 'reviewed', 'archived'] as $status)
                                        <option value="{{ $status }}" @selected($submission->status === $status)>{{ $status }}</option>
                                    @endforeach
                                </select>
                                <button class="rounded-lg bg-brand px-2 py-1 text-xs text-ink">تحديث</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="px-3 py-8 text-center text-ink-dark-muted">لا توجد طلبات بعد.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="mt-4">{{ $submissions->links() }}</div>
@endsection
