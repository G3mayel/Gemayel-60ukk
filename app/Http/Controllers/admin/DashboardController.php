<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'pending'     => Report::where('status', 'pending')->count(),
            'on_progress' => Report::where('status', 'on_progress')->count(),
            'completed'   => Report::where('status', 'completed')->count(),
            'rejected'    => Report::where('status', 'rejected')->count(),
        ];

        $chartData = Report::selectRaw("DATE_FORMAT(created_at, '%b') as month, MONTH(created_at) as month_num, COUNT(*) as total")
            ->whereYear('created_at', now()->year)
            ->groupByRaw("DATE_FORMAT(created_at, '%b'), MONTH(created_at)")
            ->orderBy('month_num')
            ->get()
            ->map(fn($r) => ['month' => $r->month, 'total' => $r->total]);

        $recent = Report::with(['category'])
            ->latest()
            ->take(4)
            ->get()
            ->map(fn($r) => [
                'id'       => $r->id,
                'title'    => $r->title,
                'category' => $r->category?->category_name ?? 'Uncategorized',
                'location' => $r->location ?? '-',
                'time'     => $r->created_at->format('H:i'),
                'status'   => $r->status,
            ]);

        return Inertia::render('admin/dashboard', [
            'stats'     => $stats,
            'chartData' => $chartData,
            'recent'    => $recent,
        ]);
    }
}