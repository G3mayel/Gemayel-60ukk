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
    Plus,
    Pencil,
    Trash2,
    Save,
    TriangleAlert,
    Menu,
    X,
    LogOut,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
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

export default function ManageKategori({ categories = {} }) {
    const PAGE_SIZE = 15;
    const { flash } = usePage().props;

    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ✨ State baru untuk menampung error
    const [errors, setErrors] = useState({});

    const rawCategories = useMemo(() => {
        const list = Array.isArray(categories)
            ? categories
            : (categories?.data ?? []);
        return list.map((cat) => ({
            id: cat.id,
            name: cat.category_name,
            description: cat.category_desc ?? "",
        }));
    }, [categories]);

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rawCategories.filter(
            (item) =>
                !q ||
                item.name.toLowerCase().includes(q) ||
                (item.description ?? "").toLowerCase().includes(q) ||
                String(item.id).toLowerCase().includes(q),
        );
    }, [rawCategories, query]);

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

    useEffect(() => {
        setCurrentPage(1);
    }, [query]);
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return items.slice(start, start + PAGE_SIZE);
    }, [items, currentPage]);

    const startItem =
        items.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(currentPage * PAGE_SIZE, items.length);

    const handleOpenAdd = () => {
        setFormData({ id: "", name: "", description: "" });
        setErrors({}); // Reset error
        setIsEditing(false);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setFormData({
            id: item.id,
            name: item.name,
            description: item.description,
        });
        setErrors({}); // Reset error
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const handleOpenDelete = (item) => {
        setSelectedCategory(item);
        setIsDeleteOpen(true);
    };

    // ✨ Handler dengan Validasi
    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Validasi Client-Side
        let formErrors = {};
        if (formData.name.trim().length < 3) {
            formErrors.category_name = "Nama kategori minimal 3 karakter.";
        }

        // Jika ada error, stop dan tampilkan
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Lanjut ke server
        setErrors({});
        setSaving(true);
        const payload = {
            category_name: formData.name,
            category_desc: formData.description,
        };

        if (isEditing) {
            router.put(`/admin/categories/${formData.id}`, payload, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    setSaving(false);
                    toast.success("Kategori berhasil diperbarui.");
                    router.get("/admin/categories");
                },
                onError: (serverErrors) => {
                    setSaving(false);
                    setErrors(serverErrors); // Tangkap error validasi server
                    toast.error("Gagal memperbarui kategori.");
                },
            });
        } else {
            router.post("/admin/categories", payload, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    setSaving(false);
                    toast.success("Kategori baru berhasil ditambahkan.");
                },
                onError: (serverErrors) => {
                    setSaving(false);
                    setErrors(serverErrors); // Tangkap error validasi server
                    toast.error("Gagal menambahkan kategori.");
                },
            });
        }
    };

    const handleDelete = () => {
        if (!selectedCategory) return;
        setDeleting(true);
        router.delete(`/admin/categories/${selectedCategory.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedCategory(null);
                setDeleting(false);
                toast.success("Kategori berhasil dihapus.");
            },
            onError: () => {
                setDeleting(false);
                toast.error("Gagal menghapus kategori.");
            },
        });
    };

    return (
        <>
            <Head title="Admin - Kelola Kategori">
                <link rel="icon" type="image/svg+xml" href="/img/logo-s-admin.svg" />
            </Head>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                {/* Toaster untuk Notifikasi */}
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
                            <NavItem
                                href="/admin/dashboard"
                                icon={LayoutDashboard}
                                label="Dashboard"
                                onClick={() => setMobileNavOpen(false)}
                            />
                            <NavItem
                                href="/admin/reports"
                                icon={MessageSquareText}
                                label="Aspirasi"
                                onClick={() => setMobileNavOpen(false)}
                            />
                            <NavItem
                                href="/admin/categories"
                                icon={ListChecks}
                                label="Kategori Aspirasi"
                                active
                                onClick={() => setMobileNavOpen(false)}
                            />
                            <NavItem
                                href="/admin/users"
                                icon={Users}
                                label="Siswa"
                                onClick={() => setMobileNavOpen(false)}
                            />
                        </nav>
                        <div className="mt-auto">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full rounded-md border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => setLogoutConfirmOpen(true)}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Desktop Sidebar */}
                <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block">
                    <div className="flex h-full flex-col px-4 py-6">
                        <div className="flex justify-center">
                            <img
                                src={logoAdmin}
                                alt="logo Admin"
                                className="h-10"
                            />
                        </div>
                        <nav className="mt-6 space-y-1">
                            <NavItem
                                href="/admin/dashboard"
                                icon={LayoutDashboard}
                                label="Dashboard"
                            />
                            <NavItem
                                href="/admin/reports"
                                icon={MessageSquareText}
                                label="Aspirasi"
                            />
                            <NavItem
                                href="/admin/categories"
                                icon={ListChecks}
                                label="Kategori Aspirasi"
                                active
                            />
                            <NavItem
                                href="/admin/users"
                                icon={Users}
                                label="Siswa"
                            />
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

                {/* Main */}
                <main className="flex-1 p-6 sm:p-8 flex flex-col">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileNavOpen(true)}
                                className="p-2 hover:bg-slate-100 rounded-md lg:hidden"
                            >
                                <Menu className="h-6 w-6 text-slate-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-950">
                                    Kategori Aspirasi
                                </h1>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    Kelola pengelompokan masalah agar laporan lebih rapi.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative w-full sm:w-[280px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Cari kategori..."
                                    className="pl-9 h-10 bg-white border-slate-200 shadow-sm rounded-md"
                                />
                            </div>
                            <Button
                                onClick={handleOpenAdd}
                                className="h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 shadow-sm"
                            >
                                <Plus className="mr-1.5 h-4 w-4" /> Tambah Kategori
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className={cn(shell, "overflow-hidden relative")}>
                        <Table>
                            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                                <TableRow>
                                    <TableHead className="w-[120px] text-center font-extrabold text-slate-800">
                                        ID
                                    </TableHead>
                                    <TableHead className="w-[250px] text-center font-extrabold text-slate-800">
                                        Nama Kategori
                                    </TableHead>
                                    <TableHead className="text-center font-extrabold text-slate-800">
                                        Deskripsi Singkat
                                    </TableHead>
                                    <TableHead className="w-[120px] text-center font-extrabold text-slate-800">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-12 text-center text-slate-500 font-medium"
                                        >
                                            Tidak ada kategori ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedItems.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-slate-50/80 transition-colors"
                                        >
                                            <TableCell className="text-center font-medium text-slate-500">
                                                CTR-{item.id}
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-slate-900">
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-center text-slate-600 text-sm font-medium">
                                                {item.description || "-"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="Edit Kategori"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDelete(item)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Hapus Kategori"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
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
                        <div className="mt-5 flex items-center justify-between text-sm font-medium text-slate-500">
                            <div>
                                Menampilkan{" "}
                                <span className="text-slate-900 font-bold">
                                    {startItem}–{endItem}
                                </span>{" "}
                                dari{" "}
                                <span className="text-slate-900 font-bold">
                                    {items.length}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="bg-white rounded-md shadow-sm font-bold"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" />{" "}
                                    Prev
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="bg-white rounded-md shadow-sm font-bold"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Next{" "}
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Tambah / Edit */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="p-0 gap-0 overflow-hidden bg-white sm:max-w-[500px] border-slate-200/70 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                    <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-row items-center gap-3 m-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700 shrink-0">
                            {isEditing ? (
                                <Pencil className="h-4 w-4" />
                            ) : (
                                <ListChecks className="h-4 w-4" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-base font-extrabold text-slate-800 text-left">
                                {isEditing
                                    ? "Edit Kategori"
                                    : "Tambah Kategori Baru"}
                            </DialogTitle>
                            <p className="text-xs text-slate-500 text-left mt-0.5">
                                {isEditing ? "Ubah detail kategori." : "Buat kategori pelaporan baru."}
                            </p>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="p-6 space-y-5 bg-white">
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-slate-800 text-left">
                                    Nama Kategori
                                </label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (errors.category_name) setErrors({ ...errors, category_name: null });
                                    }}
                                    placeholder="Contoh: Keamanan Sekolah"
                                    className={cn(
                                        "h-11 bg-white shadow-sm rounded-md",
                                        errors.category_name ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-blue-600"
                                    )}
                                />
                                {errors.category_name && <p className="mt-1.5 text-xs font-semibold text-red-500 text-left">{errors.category_name}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-slate-800 text-left">
                                    Deskripsi Singkat{" "}
                                    <span className="text-slate-400 font-normal">
                                        (Opsional)
                                    </span>
                                </label>
                                <Textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData({ ...formData, description: e.target.value });
                                        if (errors.category_desc) setErrors({ ...errors, category_desc: null });
                                    }}
                                    placeholder="Berikan panduan singkat agar siswa tidak salah pilih kategori..."
                                    className={cn(
                                        "resize-none bg-white shadow-sm rounded-md font-medium",
                                        errors.category_desc ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-blue-600"
                                    )}
                                />
                                {errors.category_desc && <p className="mt-1.5 text-xs font-semibold text-red-500 text-left">{errors.category_desc}</p>}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 px-5 font-bold rounded-md bg-white border-slate-300"
                                onClick={() => setIsFormOpen(false)}
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
                                {saving ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="p-0 gap-0 overflow-hidden bg-white sm:max-w-[440px] border-slate-200/70 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                    <div className="flex flex-col bg-white">
                        <div className="p-6 flex items-start gap-4 mt-2">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                                <TriangleAlert className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="pt-1">
                                <DialogTitle className="text-lg font-extrabold text-slate-900 mb-1 text-left">
                                    Hapus Kategori?
                                </DialogTitle>
                                <p className="text-sm text-slate-500 leading-relaxed text-left mt-1">
                                    Apakah kamu yakin ingin menghapus kategori{" "}
                                    <span className="font-bold text-slate-800">
                                        "{selectedCategory?.name}"
                                    </span>
                                    ? Tindakan ini tidak bisa dibatalkan. <br />
                                </p>
                                <p className="mt-5 text-left text-sm text-slate-500"><b className="text-slate-800">Seluruh Aspirasi yang menggunakan kategori ini akan hilang.</b></p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 px-5 font-bold rounded-md bg-white border-slate-300"
                                onClick={() => setIsDeleteOpen(false)}
                                disabled={deleting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                disabled={deleting}
                                className="h-10 px-6 font-bold rounded-md bg-red-600 hover:bg-red-700 text-white shadow-sm"
                                onClick={handleDelete}
                            >
                                {deleting ? "Menghapus..." : "Ya, Hapus"}
                            </Button>
                        </div>
                    </div>
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
