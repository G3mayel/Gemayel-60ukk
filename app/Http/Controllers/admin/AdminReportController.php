<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB};
use App\Http\Controllers\Controller;
use App\Models\{Category, Report, ReportStatusHistory};
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with(['student', 'category', 'photo']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        return Inertia::render('admin/report', [
            'reports'    => $query->latest()->paginate(15),
            'categories' => Category::all(),
            'filters'    => $request->only(['status', 'category_id']),
        ]);
    }

    public function show(Report $report)
    {
        return Inertia::render('Admin/ReportShow', [
            'report' => $report->load([
                'student',
                'category',
                'photo',
                'statusHistory',
            ]),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $report = Report::findOrFail($id);
            $request->validate([
                'status' => 'required|in:pending,on_progress,completed,rejected',
                'notes'  => 'nullable|string',
            ]);

            $report->update([
                'status'      => $request->status,
                'admin_notes' => $request->notes,
            ]);

            return redirect('/admin/reports', 303)->with('success', 'Status laporan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui status: ' . $e->getMessage());
        }
    }
}