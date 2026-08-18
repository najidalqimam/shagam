<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SubmissionController extends Controller
{
    public function index(): View
    {
        return view('admin.submissions', [
            'submissions' => Submission::query()->latest()->paginate(20),
        ]);
    }

    public function update(Request $request, Submission $submission): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,reviewed,archived'],
        ]);

        $submission->update($data);

        return back()->with('success', 'تم تحديث حالة الطلب.');
    }
}
