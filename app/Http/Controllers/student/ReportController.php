<?php

namespace App\Http\Controllers\Student;

use Inertia\Inertia;
use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with('category', 'photo')
            ->where('student_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Student/Reports/Index', [
            'reports' => $reports
        ]);
    }

    public function store(Request $request)
    {
        try {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:100',
            'location' => 'required|string|max:100',
            'description' => 'required|string|max:1000',
            'photos' => 'nullable|array',
            'photos.*' => 'nullable|image|max:2048'
        ]);

        $report = Report::create([
            'student_id' => auth()->id(),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'location' => $validated['location'],
            'description' => $validated['description'],
            'status' => 'pending'
        ]);

        if ($request->hasFile('photos') && is_array($request->file('photos'))) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('reports', 'public');

                $report->photo()->create([
                    'photo_path' => $path
                ]);
            }
        }

        return redirect('/dashboard')->with('success', 'Aspirasi berhasil dikirim!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengirim aspirasi: ' . $e->getMessage());
        }
    }

    public function history(Request $request)
    {
        $query = Report::with('category', 'photo', 'statushistory')
            ->where('student_id', auth()->id());

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->statuses && is_array($request->statuses)) {
            $statusMap = [
                'diterima' => 'pending',
                'proses' => 'on_progress',
                'selesai' => 'completed',
                'ditolak' => 'rejected'
            ];
            $mappedStatuses = array_map(fn($s) => $statusMap[$s] ?? $s, $request->statuses);
            $query->whereIn('status', $mappedStatuses);
        }

        $sort = $request->sort ?? 'latest';
        $statusPriority = [
            'pending' => 0,
            'on_progress' => 1,
            'completed' => 2,
            'rejected' => 3,
        ];
        
        $cases = collect($statusPriority)->map(function ($priority, $status) {
            return "WHEN '$status' THEN $priority";
        })->join(' ');
        
        $caseStatement = "CASE status $cases ELSE 4 END";
        
        match ($sort) {
            'oldest' => $query->orderByRaw($caseStatement)->oldest(),
            'title-asc' => $query->orderByRaw($caseStatement)->orderBy('title', 'asc'),
            'title-desc' => $query->orderByRaw($caseStatement)->orderBy('title', 'desc'),
            default => $query->orderByRaw($caseStatement)->latest(),
        };

        $reports = $query->paginate(4)->appends($request->query());

        $data = $reports->map(function ($report) {
            $firstPhoto = $report->photo->first();
            $photoUrl = null;

            if ($firstPhoto && $firstPhoto->photo_path) {
                $photoUrl = asset('storage/' . $firstPhoto->photo_path);
            }

            return [
                'uid' => $report->id,
                'id' => 'ASP-' . $report->id,
                'title' => $report->title,
                'category' => $report->category?->category_name ?? '-',
                'location' => $report->location,
                'description' => $report->description,
                'status' => $this->mapStatus($report->status),
                'date' => $report->updated_at->format('d M Y'),
                'time' => $report->updated_at->format('H:i'),
                'hasPhoto' => $report->photo->count() > 0,
                'photoUrl' => $photoUrl,
                'note' => $report->admin_notes,
                'histories' => $report->statushistory?->map(fn($h) => [
                    'changed_at' => $h->changed_at
                ])->toArray() ?? []
            ];
        });

        return inertia('students/history', [
            'user' => auth()->user(),
            'reports' => [
                'data' => $data,
                'current_page' => $reports->currentPage(),
                'last_page' => $reports->lastPage(),
                'from' => $reports->firstItem(),
                'to' => $reports->lastItem(),
                'total' => $reports->total(),
            ],
            'filters' => [
                'search' => $request->search ?? '',
                'statuses' => $request->statuses ?? [],
                'sort' => $request->sort ?? 'latest',
            ]
        ]);
    }

    private function mapStatus($status)
    {
        return match ($status) {
            'on_progress' => 'proses',
            'completed' => 'selesai',
            'rejected' => 'ditolak',
            'pending' => 'diterima',
            default => $status,
        };
    }

    public function show($id)
    {
        $report = Report::with('category', 'photo')
            ->where('student_id', auth()->id()) 
            ->findOrFail($id);

        return Inertia::render('Student/Reports/Show', [
            'report' => $report
        ]);
    }
}