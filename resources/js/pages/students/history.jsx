import React, { useState, useEffect, useRef } from "react";
import { Link, router, Head, usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import {
    ArrowLeft, History, Search, SlidersHorizontal, ClipboardList,
    Tag, MapPin, Image as ImageIcon, Hourglass, CheckCircle2,
    Clock3, XCircle, ChevronLeft, ChevronRight,
} from "lucide-react";

import { StudentHeader } from "@/components/layouts/StudentsHeader";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";

import {
    AlertDialog, AlertDialogCancel, AlertDialogContent,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup,
    DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

function statusConfig(status) {
    switch (status) {
        case "selesai":
            return { label: "Selesai", className: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 };
        case "ditolak":
            return { label: "Ditolak", className: "bg-red-100 text-red-700", icon: XCircle };
        case "proses":
            return { label: "Dikerjakan", className: "bg-blue-100 text-blue-700", icon: Clock3 };
        default:
            return { label: "Terkirim", className: "bg-amber-100 text-amber-700", icon: Clock3 };
    }
}

function getTimelineSteps(item) {
    if (!item) return [];
    if (item.status === "ditolak") {
        return [
            { key: "diterima", title: "Laporan Diterima" },
            { key: "review", title: "Sedang Ditinjau" },
            { key: "ditolak", title: "Laporan Ditolak" },
        ];
    }
    return [
        { key: "diterima", title: "Laporan Diterima" },
        { key: "proses", title: "Sedang Dikerjakan" },
        { key: "selesai", title: "Selesai" },
    ];
}

function getTimelineIndex(status) {
    if (status === "proses") return 1;
    if (status === "selesai" || status === "ditolak") return 2;
    return 0;
}

export default function AspirationHistory({ user, reports = { data: [] }, filters = {} }) {
    const { flash } = usePage().props;
    const items = reports.data ?? [];
    const pagination = reports;

    const [selectedUid, setSelectedUid] = useState(items[0]?.uid ?? null);
    const [search, setSearch] = useState(filters.search ?? "");
    const [filterStatuses, setFilterStatuses] = useState(filters.statuses ?? []);
    const [sortBy, setSortBy] = useState(filters.sort ?? "latest");

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        if (items.length > 0 && !items.some((i) => i.uid === selectedUid)) {
            setSelectedUid(items[0].uid);
        }
    }, [items]);

    const selected = items.find((i) => i.uid === selectedUid) ?? items[0] ?? null;
    const searchTimeout = useRef(null);

    function applyFilters({ newSearch, newStatuses, newSort, page } = {}) {
        const resolvedStatuses = newStatuses ?? filterStatuses;
        const params = {
            search: newSearch ?? search,
            sort: newSort ?? sortBy,
            page: page ?? 1,
            ...(resolvedStatuses.length > 0 && { statuses: resolvedStatuses }),
        };

        router.get("/history", params, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function handleSearchChange(e) {
        const val = e.target.value;
        setSearch(val);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => applyFilters({ newSearch: val }), 400);
    }

    function toggleStatus(value) {
        const next = filterStatuses.includes(value)
            ? filterStatuses.filter((v) => v !== value)
            : [...filterStatuses, value];
        setFilterStatuses(next);
        applyFilters({ newStatuses: next });
    }

    function handleSort(value) {
        setSortBy(value);
        applyFilters({ newSort: value });
    }

    function handleReset() {
        setSearch("");
        setFilterStatuses([]);
        setSortBy("latest");
        applyFilters({ newSearch: "", newStatuses: [], newSort: "latest", page: 1 });
    }

    function goToPage(page) {
        applyFilters({ page });
    }

    const totalPages = pagination.last_page ?? 1;
    const currentPage = pagination.current_page ?? 1;
    const startItem = pagination.from ?? 0;
    const endItem = pagination.to ?? 0;
    const totalItems = pagination.total ?? 0;

    return (
        <>
            <Head title="Riwayat Aspirasi - SarprasKu">
                <link rel="icon" type="image/svg+xml" href="/img/logo-s-siswa.svg" />
            </Head>
            <div className="relative min-h-screen bg-[radial-gradient(1200px_700px_at_0%_0%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(900px_700px_at_100%_15%,rgba(147,51,234,0.18),transparent_55%),linear-gradient(to_bottom_right,#f8fafc,#eef2ff,#f1f5f9)]">
                <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
                <StudentHeader user={user} />

            <main className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6 md:pt-28">
                <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_0.85fr]">

                    {/* Left Column */}
                    <div className="space-y-5">
                        <Link
                            href="/dashboard"
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 transition"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke home page
                        </Link>

                        <Card className="rounded-[26px] border-white/60 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur">
                            <div className="px-5 py-4 sm:px-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                        <History className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                        Riwayat Aspirasi
                                    </h1>
                                </div>

                                {/* Search & Filter */}
                                <div className="mb-4 flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={search}
                                            onChange={handleSearchChange}
                                            placeholder="Cari aspirasi..."
                                            className="h-10 rounded-xl border-slate-200 bg-white pl-9 shadow-sm"
                                        />
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            type="button"
                                            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 focus:outline-none shadow-sm transition"
                                        >
                                            <SlidersHorizontal className="h-4 w-4" />
                                            Filter
                                            {filterStatuses.length > 0 && (
                                                <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
                                                    {filterStatuses.length}
                                                </span>
                                            )}
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" sideOffset={8} className="w-[420px] rounded-xl p-2 shadow-lg border-slate-200/70">
                                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                                                <div className="pr-2">
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuLabel className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</DropdownMenuLabel>
                                                        {[
                                                            { v: "diterima", t: "Terkirim / Diterima" },
                                                            { v: "proses", t: "Sedang Dikerjakan" },
                                                            { v: "selesai", t: "Selesai" },
                                                            { v: "ditolak", t: "Ditolak" },
                                                        ].map((s) => (
                                                            <DropdownMenuCheckboxItem
                                                                key={s.v}
                                                                checked={filterStatuses.includes(s.v)}
                                                                onSelect={(e) => e.preventDefault()}
                                                                onCheckedChange={() => toggleStatus(s.v)}
                                                                className="font-medium cursor-pointer rounded-md"
                                                            >
                                                                {s.t}
                                                            </DropdownMenuCheckboxItem>
                                                        ))}
                                                    </DropdownMenuGroup>
                                                </div>

                                                <div className="pl-2">
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuLabel className="text-xs text-slate-500 font-bold uppercase tracking-wider">Urutkan</DropdownMenuLabel>
                                                        <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSort}>
                                                            <DropdownMenuRadioItem value="latest" className="font-medium cursor-pointer rounded-md">Terbaru</DropdownMenuRadioItem>
                                                            <DropdownMenuRadioItem value="oldest" className="font-medium cursor-pointer rounded-md">Terlama</DropdownMenuRadioItem>
                                                            <DropdownMenuRadioItem value="title-asc" className="font-medium cursor-pointer rounded-md">Judul A–Z</DropdownMenuRadioItem>
                                                            <DropdownMenuRadioItem value="title-desc" className="font-medium cursor-pointer rounded-md">Judul Z–A</DropdownMenuRadioItem>
                                                        </DropdownMenuRadioGroup>
                                                    </DropdownMenuGroup>
                                                </div>
                                            </div>

                                            <DropdownMenuSeparator />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleReset();
                                                }}
                                                className="w-full rounded-md px-2 py-1.5 text-left text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                            >
                                                Reset filter
                                            </button>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* List Data */}
                                <div className="space-y-3">
                                    {items.map((item) => {
                                        const cfg = statusConfig(item.status);
                                        const StatusIcon = cfg.icon;
                                        const isActive = item.uid === selected?.uid;

                                        return (
                                            <button
                                                key={item.uid}
                                                type="button"
                                                onClick={() => setSelectedUid(item.uid)}
                                                className={cn(
                                                    "w-full rounded-2xl border bg-white/70 p-4 text-left transition shadow-sm",
                                                    "hover:border-blue-300 hover:bg-white",
                                                    isActive ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"
                                                )}
                                            >
                                                <div className="mb-2 flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="truncate text-lg font-bold text-slate-900">{item.title}</div>
                                                        <div className="mt-1 space-y-1 text-xs font-medium text-slate-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <Tag className="h-3.5 w-3.5" />
                                                                <span>{item.category}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="h-3.5 w-3.5" />
                                                                <span>{item.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 border border-slate-200">
                                                        {item.date}
                                                    </div>
                                                </div>

                                                <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 font-medium">
                                                    {item.description}
                                                </p>

                                                <div className="mt-3 flex items-center justify-between gap-3">
                                                    <div className="truncate text-[10px] font-bold text-slate-500">
                                                        {item.id}
                                                    </div>
                                                    <div className={cn("inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold", cfg.className)}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {cfg.label}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}

                                    {items.length === 0 && (
                                        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-8 text-center text-sm font-semibold text-slate-500">
                                            Tidak ada data aspirasi yang ditemukan.
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {totalItems > 0 && (
                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-xs font-medium text-slate-500">
                                            Menampilkan <span className="font-bold text-slate-900">{startItem}–{endItem}</span> dari <span className="font-bold text-slate-900">{totalItems}</span> data
                                        </p>

                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                type="button" variant="outline" size="sm"
                                                className="h-8 rounded-lg font-bold shadow-sm bg-white"
                                                disabled={currentPage === 1}
                                                onClick={() => goToPage(currentPage - 1)}
                                            >
                                                <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                                            </Button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page} type="button" size="sm"
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    className={cn("h-8 min-w-8 rounded-lg px-2 font-bold shadow-sm bg-white", currentPage === page && "bg-blue-700 text-white hover:bg-blue-800")}
                                                    onClick={() => goToPage(page)}
                                                >
                                                    {page}
                                                </Button>
                                            ))}

                                            <Button
                                                type="button" variant="outline" size="sm"
                                                className="h-8 rounded-lg font-bold shadow-sm bg-white"
                                                disabled={currentPage === totalPages}
                                                onClick={() => goToPage(currentPage + 1)}
                                            >
                                                Next <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        {/* Detail Card */}
                        <Card className="rounded-[26px] border-white/60 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur">
                            <div className="px-5 py-4 sm:px-6">
                                <div className="mb-4 flex items-center gap-2.5">
                                    <ClipboardList className="h-5 w-5 text-slate-900" />
                                    <h2 className="text-lg font-extrabold text-slate-900">Informasi Aspirasi</h2>
                                </div>

                                {selected ? (
                                    <>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Judul Aspirasi", value: selected.title },
                                                { label: "Kategori Masalah", value: selected.category },
                                                { label: "Lokasi", value: selected.location },
                                            ].map((f) => (
                                                <div key={f.label}>
                                                    <div className="mb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">{f.label}</div>
                                                    <div className="text-lg font-extrabold leading-tight text-slate-900">{f.value}</div>
                                                </div>
                                            ))}
                                            <div>
                                                <div className="mb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</div>
                                                <p className="text-sm font-medium leading-relaxed text-slate-700">{selected.description}</p>
                                            </div>
                                        </div>

                                        <AlertDialog>
                                            <AlertDialogTrigger
                                                type="button"
                                                disabled={!selected.hasPhoto}
                                                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 transition"
                                            >
                                                <ImageIcon className="mr-2 h-4 w-4" />
                                                {selected.hasPhoto ? "Lihat Bukti Foto" : "Tidak Ada Bukti Foto"}
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden bg-white border-slate-200/70 shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                                                <AlertDialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                                                    <AlertDialogTitle className="font-extrabold text-lg text-slate-800">Bukti Foto</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <div className="p-6 bg-slate-50/50">
                                                    {selected.photoUrl ? (
                                                        <img
                                                            src={selected.photoUrl}
                                                            alt={`Bukti foto ${selected.title}`}
                                                            className="max-h-[60vh] w-full object-contain rounded-xl shadow-sm border border-slate-200/60"
                                                        />
                                                    ) : (
                                                        <div className="grid h-64 place-items-center text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-xl">
                                                            Foto tidak tersedia.
                                                        </div>
                                                    )}
                                                </div>
                                                <AlertDialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                                                    <AlertDialogCancel className="rounded-xl font-bold bg-white shadow-sm h-10 px-6">Tutup</AlertDialogCancel>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white/50 p-6 text-center text-sm font-medium text-slate-500">
                                        Pilih data aspirasi untuk melihat detail.
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Timeline Card */}
                        <Card className="rounded-[26px] border-white/60 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur">
                            <div className="px-5 py-4 sm:px-6">
                                <div className="mb-4 flex items-center gap-2.5">
                                    <Hourglass className="h-5 w-5 text-slate-900" />
                                    <h2 className="text-lg font-extrabold text-slate-900">Timeline Laporan</h2>
                                </div>

                                {selected ? (
                                    <>
                                        <div className="mb-5 rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Saat Ini</div>
                                                <div className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold", statusConfig(selected.status).className)}>
                                                    {React.createElement(statusConfig(selected.status).icon, { className: "h-3.5 w-3.5" })}
                                                    {statusConfig(selected.status).label}
                                                </div>
                                            </div>
                                            <div className="text-xs font-medium text-slate-500">
                                                Update terakhir: <span className="font-bold text-slate-700">{selected.date} • {selected.time}</span>
                                            </div>

                                            {selected.note && (
                                                <div className={cn("mt-4 rounded-xl border p-3.5", selected.status === "ditolak" ? "border-red-200 bg-red-50/50" : "border-blue-200 bg-blue-50/50")}>
                                                    <div className={cn("mb-1 text-xs font-extrabold uppercase tracking-wider", selected.status === "ditolak" ? "text-red-700" : "text-blue-700")}>
                                                        Catatan Admin
                                                    </div>
                                                    <p className={cn("text-sm font-medium leading-relaxed", selected.status === "ditolak" ? "text-red-900" : "text-blue-900")}>
                                                        {selected.note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative pl-8">
                                            <div className="absolute bottom-1 left-[11px] top-1 w-[2px] bg-slate-200 rounded-full" />
                                            {getTimelineSteps(selected).map((step, i) => {
                                                const steps = getTimelineSteps(selected);
                                                const activeIndex = getTimelineIndex(selected.status);
                                                const isDone = i < activeIndex;
                                                const isCurrent = i === activeIndex;
                                                const isFuture = i > activeIndex;
                                                const isRejected = selected.status === "ditolak" && isCurrent;
                                                const historyEntry = selected.histories?.[i] ?? null;

                                                return (
                                                    <div key={step.key} className={cn(i !== steps.length - 1 && "mb-5")}>
                                                        <div className="relative">
                                                            <div
                                                                className={cn(
                                                                    "absolute -left-[32px] top-1 grid h-6 w-6 place-items-center rounded-full border-2 bg-white",
                                                                    isDone && "border-blue-600 bg-blue-600 text-white",
                                                                    isCurrent && !isRejected && "border-blue-600 text-blue-600",
                                                                    isCurrent && isRejected && "border-red-600 text-red-600",
                                                                    isFuture && "border-slate-300 text-slate-300"
                                                                )}
                                                            >
                                                                {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : isRejected ? <XCircle className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                                                            </div>

                                                            <div
                                                                className={cn(
                                                                    "rounded-xl border bg-white p-3 shadow-sm",
                                                                    isCurrent && !isRejected && "border-blue-200 bg-blue-50/50",
                                                                    isCurrent && isRejected && "border-red-200 bg-red-50/50",
                                                                    isDone && "border-slate-200",
                                                                    isFuture && "border-slate-100 bg-slate-50/50"
                                                                )}
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div
                                                                        className={cn(
                                                                            "text-sm font-extrabold",
                                                                            isCurrent && !isRejected && "text-blue-800",
                                                                            isCurrent && isRejected && "text-red-800",
                                                                            isDone && "text-slate-900",
                                                                            isFuture && "text-slate-400"
                                                                        )}
                                                                    >
                                                                        {step.title}
                                                                    </div>
                                                                    {historyEntry && (
                                                                        <div className="shrink-0 text-[10px] font-bold text-slate-500">
                                                                            {historyEntry.changed_at}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {isCurrent && (
                                                                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-600">
                                                                        {isRejected
                                                                            ? "Laporan tidak dapat diproses. Silakan cek catatan admin."
                                                                            : step.key === "diterima"
                                                                                ? "Laporan berhasil masuk ke sistem dan menunggu tindak lanjut petugas."
                                                                                : step.key === "proses"
                                                                                    ? "Petugas sedang menangani laporan kamu secara langsung."
                                                                                    : "Laporan sudah selesai ditangani oleh petugas."}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white/50 p-6 text-center text-sm font-medium text-slate-500">
                                        Tidak ada timeline untuk ditampilkan.
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
            </div>
        </>
    );
}
