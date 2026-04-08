import React, { useState, useMemo, useEffect } from "react";
import { Link, router, Head, usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import {
    LayoutDashboard,
    MessageSquareText,
    ListChecks,
    Users,
    Search,
    ChevronLeft,
    ChevronRight,
    ImageIcon,
    X,
    Save,
    Clock,
    Wrench,
    CheckCircle2,
    XCircle,
    ClipboardEdit,
    SlidersHorizontal,
    Menu,
    LogOut,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

const logoAdmin = "/img/logo-admin.svg";
const shell =
    "rounded-2xl border border-slate-200/70 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.06)]";

const STATUS_PRIORITY = {
    pending: 0,
    on_progress: 1,
    completed: 2,
    rejected: 3,
};

function mapReport(report, idx) {
    return {
        uid: `${report.id}-${idx}`,
        id: report.id,
        title: report.title ?? "Tanpa Judul",
        category: report.category?.category_name ?? "Uncategorized",
        location: report.location ?? "-",
        date: new Date(report.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "2-digit",
        }),
        time: new Date(report.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        status: report.status ?? "pending",
        description: report.description ?? "-",
        note: report.admin_notes ?? "",
        hasPhoto: Array.isArray(report.photo) && report.photo.length > 0,
        photoUrl:
            Array.isArray(report.photo) && report.photo.length > 0
                ? report.photo[0].photo_url
                : null,
    };
}

function NavItem({ href, icon: Icon, label, active, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            )}
        >
            <Icon
                className={cn(
                    "h-4 w-4",
                    active
                        ? "text-blue-700"
                        : "text-slate-500 group-hover:text-slate-700",
                )}
            />
            <span className="truncate">{label}</span>
        </Link>
    );
}

function StatusBadge({ status }) {
    const config = {
        pending: {
            label: "Pending",
            class: "bg-yellow-50 text-yellow-700 border-yellow-200",
            icon: Clock,
        },
        on_progress: {
            label: "Proses",
            class: "bg-blue-50 text-blue-700 border-blue-200",
            icon: Wrench,
        },
        completed: {
            label: "Selesai",
            class: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
        },
        rejected: {
            label: "Ditolak",
            class: "bg-red-50 text-red-700 border-red-200",
            icon: XCircle,
        },
    };
    const current = config[status] ?? config.pending;

    return (
        <span
            className={cn(
                "px-2.5 py-1 rounded-md border text-[11px] font-bold shadow-sm inline-flex items-center gap-1.5",
                current.class,
            )}
        >
            <current.icon className="h-3 w-3" />
            {current.label}
        </span>
    );
}

export default function ManageAspirasi({ reports = {} }) {
    const PAGE_SIZE = 15;
    const { flash } = usePage().props;

    const [query, setQuery] = useState("");
    const [filterStatuses, setFilterStatuses] = useState([]);
    const [sortBy, setSortBy] = useState("latest");
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showPhoto, setShowPhoto] = useState(false);

    const [actionStatus, setActionStatus] = useState("pending");
    const [actionNote, setActionNote] = useState("");
    const [saving, setSaving] = useState(false);

    const rawData = useMemo(() => {
        const list = reports?.data ?? (Array.isArray(reports) ? reports : []);
        return list.map(mapReport);
    }, [reports]);

    const toggleStatusFilter = (value) =>
        setFilterStatuses((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value],
        );

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        let result = rawData.filter((item) => {
            const matchQuery =
                !q ||
                item.title.toLowerCase().includes(q) ||
                item.location.toLowerCase().includes(q) ||
                String(item.id).toLowerCase().includes(q);
            const matchStatus =
                filterStatuses.length === 0 ||
                filterStatuses.includes(item.status);
            return matchQuery && matchStatus;
        });

        if (sortBy === "latest" || sortBy === "oldest") {
            result = [...result].sort((a, b) => {
                const priorityDiff =
                    STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
                if (priorityDiff !== 0) return priorityDiff;
                return sortBy === "oldest" ? a.id - b.id : b.id - a.id;
            });
        } else if (sortBy === "title-asc") {
            result = [...result].sort((a, b) =>
                a.title.localeCompare(b.title),
            );
        } else if (sortBy === "title-desc") {
            result = [...result].sort((a, b) =>
                b.title.localeCompare(a.title),
            );
        }

        return result;
    }, [rawData, query, filterStatuses, sortBy]);

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

    useEffect(() => {
        setCurrentPage(1);
    }, [query, filterStatuses, sortBy]);
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return items.slice(start, start + PAGE_SIZE);
    }, [items, currentPage]);

    const startItem = items.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(currentPage * PAGE_SIZE, items.length);

    const openDialog = (item) => {
        setSelectedItem(item);
        setActionStatus(item.status);
        setActionNote(item.note ?? "");
        setShowPhoto(false);
        setIsDialogOpen(true);
    };

    const handleSaveAction = (e) => {
        e.preventDefault();
        if (!selectedItem?.id) return;

        setSaving(true);
        router.put(
            `/admin/reports/${selectedItem.id}/updateStatus`,
            { status: actionStatus, notes: actionNote },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSelectedItem(null);
                    setShowPhoto(false);
                    setSaving(false);
                    toast.success("Status aspirasi berhasil diperbarui.");
                },
                onError: (errors) => {
                    console.error("Error:", errors);
                    setSaving(false);
                    toast.error("Gagal memperbarui status aspirasi.");
                },
            },
        );
    };

    return (
        <>
            <Head title="Admin - Kelola Aspirasi">
                <link rel="icon" type="image/svg+xml" href="/img/logo-s-admin.svg" />
            </Head>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
            {/* Mobile menu backdrop */}
            {mobileNavOpen && (
                <div
                    className="fixed inset-0 top-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setMobileNavOpen(false)}
                />
            )}
            <div className="flex min-h-screen">
                {/* Mobile sidebar */}
                <aside className={cn(
                    "fixed inset-y-0 left-0 z-40 w-[240px] overflow-y-auto border-r border-slate-200 bg-white transition-transform lg:hidden",
                    mobileNavOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="flex h-full flex-col px-4 py-6">
                        <div className="flex justify-between items-center mb-4">
                            <img src={logoAdmin} alt="logo Admin" className="h-10" />
                            <button
                                onClick={() => setMobileNavOpen(false)}
                                className="p-1 hover:bg-slate-100 rounded-md"
                            >
                                <X className="h-5 w-5 text-slate-700" />
                            </button>
                        </div>
                        <nav className="mt-6 space-y-1">
                            <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setMobileNavOpen(false)} />
                            <NavItem href="/admin/reports" icon={MessageSquareText} label="Aspirasi" active onClick={() => setMobileNavOpen(false)} />
                            <NavItem href="/admin/categories" icon={ListChecks} label="Kategori Aspirasi" onClick={() => setMobileNavOpen(false)} />
                            <NavItem href="/admin/users" icon={Users} label="Siswa" onClick={() => setMobileNavOpen(false)} />
                        </nav>
                        <div className="mt-auto">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full rounded-md border-red-200 text-red-600 hover:bg-red-50 font-bold"
                                onClick={() => setLogoutConfirmOpen(true)}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </aside>
                {/* Sidebar */}
                <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block">
                    <div className="flex h-full flex-col px-4 py-6">
                        <div className="flex justify-center">
                            <img src={logoAdmin} alt="logo Admin" className="h-10" />
                        </div>
                        <nav className="mt-6 space-y-1">
                            <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                            <NavItem href="/admin/reports" icon={MessageSquareText} label="Aspirasi" active />
                            <NavItem href="/admin/categories" icon={ListChecks} label="Kategori Aspirasi" />
                            <NavItem href="/admin/users" icon={Users} label="Siswa" />
                        </nav>
                        <div className="mt-auto">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full rounded-md border-red-200 text-red-600 hover:bg-red-50 font-bold"
                                onClick={() => setLogoutConfirmOpen(true)}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 p-3 sm:p-6 md:p-8 flex flex-col">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <button
                                    onClick={() => setMobileNavOpen(true)}
                                    className="p-2 hover:bg-slate-100 rounded-md lg:hidden"
                                >
                                    <Menu className="h-6 w-6 text-slate-700" />
                                </button>
                                <div className="flex-1">
                                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                                        Kelola Aspirasi
                                    </h1>
                                    <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                                        Tinjau dan tindak lanjuti laporan siswa dengan cepat.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-[280px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Cari ID, Judul..."
                                    className="pl-9 h-10 bg-white border-slate-200 shadow-sm rounded-md text-xs sm:text-sm"
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    type="button"
                                    className="inline-flex h-10 items-center gap-2 rounded-md bg-white border border-slate-200 shadow-sm px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none transition"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="hidden sm:inline">Filter</span>
                                    {filterStatuses.length > 0 && (
                                        <span className="ml-1 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                                            {filterStatuses.length}
                                        </span>
                                    )}
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={8}
                                    className="w-[320px] sm:w-[420px] rounded-xl p-2 shadow-lg border-slate-200/70"
                                >
                                    <div className="grid grid-cols-2 divide-x divide-slate-200">
                                        <div className="pr-2">
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                                                    Status
                                                </DropdownMenuLabel>
                                                {[
                                                    { v: "pending", t: "Pending" },
                                                    { v: "on_progress", t: "Sedang Dikerjakan" },
                                                    { v: "completed", t: "Selesai" },
                                                    { v: "rejected", t: "Ditolak" },
                                                ].map((s) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={s.v}
                                                        checked={filterStatuses.includes(s.v)}
                                                        onSelect={(e) => e.preventDefault()}
                                                        onCheckedChange={() => toggleStatusFilter(s.v)}
                                                        className="font-medium cursor-pointer rounded-md"
                                                    >
                                                        {s.t}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuGroup>
                                        </div>

                                        <div className="pl-2">
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                                                    Urutkan
                                                </DropdownMenuLabel>
                                                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
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
                                            setFilterStatuses([]);
                                            setSortBy("latest");
                                        }}
                                        className="w-full rounded-md px-2 py-1.5 text-left text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                    >
                                        Reset filter
                                    </button>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    </div>

                    {/* Table */}
                    <div className={cn(shell, "overflow-x-auto relative")}>
                        <Table className="min-w-full">
                            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                                <TableRow>
                                    <TableHead className="w-[100px] sm:w-[130px] text-center font-extrabold text-xs sm:text-sm text-slate-800">ID Laporan</TableHead>
                                    <TableHead className="hidden sm:table-cell text-center font-extrabold text-sm text-slate-800">Waktu</TableHead>
                                    <TableHead className="text-center font-extrabold text-xs sm:text-sm text-slate-800">Aspirasi</TableHead>
                                    <TableHead className="hidden md:table-cell text-center font-extrabold text-sm text-slate-800">Lokasi</TableHead>
                                    <TableHead className="w-[100px] sm:w-[140px] text-center font-extrabold text-xs sm:text-sm text-slate-800">Status</TableHead>
                                    <TableHead className="w-[110px] sm:w-[160px] text-center font-extrabold text-xs sm:text-sm text-slate-800">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                                            Tidak ada data laporan ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedItems.map((item) => (
                                        <TableRow key={item.uid} className="hover:bg-slate-50/80 transition-colors">
                                            <TableCell className="text-center font-medium text-xs sm:text-sm text-slate-500">
                                                ASP-{item.id}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-center font-medium text-slate-900">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="text-sm">{item.date}</div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5">{item.time}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-xs sm:text-sm text-slate-900">
                                                {item.title}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-center font-medium text-slate-900">
                                                {item.location}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center">
                                                    <StatusBadge status={item.status} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 sm:px-5 py-1 sm:py-2 text-xs sm:text-sm shadow-sm rounded-md transition"
                                                        onClick={() => openDialog(item)}
                                                    >
                                                        Tindak Lanjut
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {items.length > 0 && (
                        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-medium text-slate-500">
                            <div>
                                Menampilkan{" "}
                                <span className="text-slate-900 font-bold">{startItem}–{endItem}</span>{" "}
                                dari{" "}
                                <span className="text-slate-900 font-bold">{items.length}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="bg-white rounded-md shadow-sm font-bold text-xs sm:text-sm px-2 sm:px-4"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" /> <span className="hidden sm:inline">Prev</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="bg-white rounded-md shadow-sm font-bold text-xs sm:text-sm px-2 sm:px-4"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Next <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ─── Detail / Action Dialog ─── */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    className={cn(
                        "p-0 overflow-hidden bg-transparent border-none shadow-none flex gap-4 transition-all duration-300 [&>button]:hidden",
                        showPhoto ? "sm:max-w-[1050px]" : "sm:max-w-[550px]",
                    )}
                >
                    {/* Form Panel */}
                    <div className={cn(shell, "flex-1 flex flex-col max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200/70 shadow-[0_18px_45px_rgba(0,0,0,0.10)]")}>
                        {selectedItem && (
                            <>
                                <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between m-0">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                                            <ClipboardEdit className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-base font-extrabold text-slate-800 text-left">
                                                Tindak Lanjut Laporan
                                            </DialogTitle>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors p-1.5 rounded-md"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </DialogHeader>

                                <div className="p-6 overflow-y-auto bg-white">
                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID / Waktu</div>
                                            <div className="mt-1 font-bold text-slate-900">ASP-{selectedItem.id}</div>
                                            <div className="text-xs font-medium text-slate-500 mt-0.5">{selectedItem.date} {selectedItem.time}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Judul Aspirasi</div>
                                            <div className="mt-1 font-bold text-slate-900">{selectedItem.title}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</div>
                                            <div className="mt-1 font-bold text-slate-900">{selectedItem.category}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lokasi</div>
                                            <div className="mt-1 font-bold text-slate-900">{selectedItem.location}</div>
                                        </div>
                                        <div className="col-span-2 border-t border-slate-100 pt-5 mt-1">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Deskripsi Masalah
                                            </div>
                                            <div className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-100 shadow-sm">
                                                {selectedItem.description}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tombol buka foto */}
                                    {selectedItem.hasPhoto && !showPhoto && (
                                        <Button
                                            type="button"
                                            className="w-full mb-6 font-bold bg-blue-600 text-white hover:bg-blue-700 h-11 shadow-sm rounded-md transition"
                                            onClick={() => setShowPhoto(true)}
                                        >
                                            <ImageIcon className="mr-2 h-4 w-4" />
                                            Buka Lampiran Foto
                                        </Button>
                                    )}

                                    {/* Action Form */}
                                    <form onSubmit={handleSaveAction} className="space-y-5 border-t border-slate-100 pt-6">
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-slate-800">
                                                Ubah Status
                                            </label>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                {[
                                                    { v: "pending", t: "Pending", bg: "bg-yellow-50", text: "text-yellow-800", ring: "ring-yellow-200", icon: Clock },
                                                    { v: "on_progress", t: "Proses", bg: "bg-blue-50", text: "text-blue-800", ring: "ring-blue-200", icon: Wrench },
                                                    { v: "completed", t: "Selesai", bg: "bg-emerald-50", text: "text-emerald-800", ring: "ring-emerald-200", icon: CheckCircle2 },
                                                    { v: "rejected", t: "Ditolak", bg: "bg-red-50", text: "text-red-800", ring: "ring-red-200", icon: XCircle },
                                                ].map((s) => (
                                                    <button
                                                        key={s.v}
                                                        type="button"
                                                        onClick={() => setActionStatus(s.v)}
                                                        className={cn(
                                                            "rounded-md border flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-bold transition-all duration-200",
                                                            actionStatus === s.v
                                                                ? `${s.bg} ${s.text} ring-2 ${s.ring} shadow-sm border-transparent`
                                                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300",
                                                        )}
                                                    >
                                                        <s.icon className="h-3.5 w-3.5" />
                                                        {s.t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-slate-800">
                                                Tanggapan{" "}
                                                <span className="text-slate-400 font-normal">(Opsional)</span>
                                            </label>
                                            <Textarea
                                                rows={3}
                                                value={actionNote}
                                                onChange={(e) => setActionNote(e.target.value)}
                                                placeholder="Ketik catatan tindak lanjut di sini..."
                                                className="resize-none bg-white border-slate-300 shadow-sm focus-visible:ring-blue-600 rounded-md font-medium"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-10 px-5 font-bold rounded-md bg-white border-slate-300"
                                                onClick={() => setIsDialogOpen(false)}
                                                disabled={saving}
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={saving}
                                                className="h-10 px-6 font-bold rounded-md bg-blue-600 hover:bg-blue-700 shadow-sm text-white"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Photo Panel */}
                    {showPhoto && selectedItem?.hasPhoto && (
                        <div className="w-[480px] flex flex-col bg-slate-900 rounded-2xl shadow-lg max-h-[90vh] overflow-hidden relative border border-slate-700">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-slate-400" />
                                    Lampiran Foto
                                </h3>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowPhoto(false);
                                    }}
                                    className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-slate-800"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex-1 p-6 flex items-center justify-center bg-slate-900 overflow-y-auto">
                                <img
                                    src={selectedItem.photoUrl}
                                    alt="Lampiran"
                                    className="max-w-full rounded-md shadow-lg ring-1 ring-white/10"
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
                <AlertDialogContent className="rounded-2xl border-slate-200/70 shadow-lg max-w-md">
                    <AlertDialogHeader className="space-y-2">
                        <AlertDialogTitle className="text-lg font-extrabold text-slate-900">
                            Keluar dari Panel Admin?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-slate-600">
                            Anda yakin ingin keluar dari akun admin? Anda harus login kembali untuk mengakses panel ini.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex flex-row gap-3 pt-2 justify-end">
                        <AlertDialogCancel className="h-10 rounded-lg border-slate-200 font-bold text-slate-700 hover:bg-slate-100">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.post("/logout")}
                            className="h-10 rounded-lg bg-red-600 font-bold hover:bg-red-700 text-white"
                        >
                            Ya, Keluar
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            </div>
        </>
    );
}
