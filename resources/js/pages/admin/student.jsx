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
    Trash2,
    Save,
    TriangleAlert,
    KeySquare,
    UserPlus,
    Menu,
    X,
    LogOut,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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
const PAGE_SIZE = 15;

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

const EMPTY_ADD_FORM = { nisn: "", full_name: "", class: "", password: "" };

export default function ManageSiswa({ students = [] }) {
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

    // State Modal
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditPwdOpen, setIsEditPwdOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // State Form & Action
    const [selectedUser, setSelectedUser] = useState(null);
    const [addFormData, setAddFormData] = useState(EMPTY_ADD_FORM);
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // ✨ State baru untuk menampung error form
    const [errors, setErrors] = useState({});

    const rawUsers = useMemo(() => {
        const list = Array.isArray(students)
            ? students
            : (students?.data ?? []);
        return list.map((s) => ({
            id: s.id,
            nisn: s.nisn,
            name: s.full_name,
            class: s.class ?? "-",
            joinedDate: new Date(s.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "2-digit",
            }),
        }));
    }, [students]);

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rawUsers.filter(
            (item) =>
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.nisn.includes(q) ||
                item.class.toLowerCase().includes(q),
        );
    }, [rawUsers, query]);

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

    // Buka Modal Tambah
    const handleOpenAdd = () => {
        setAddFormData(EMPTY_ADD_FORM);
        setErrors({}); // Reset error saat modal dibuka
        setIsAddOpen(true);
    };

    // Buka Modal Reset Password
    const handleOpenEditPwd = (item) => {
        setSelectedUser(item);
        setNewPassword("");
        setErrors({}); // Reset error
        setIsEditPwdOpen(true);
    };

    // Buka Modal Hapus
    const handleOpenDelete = (item) => {
        setSelectedUser(item);
        setIsDeleteOpen(true);
    };

    // ✨ Handler Form Tambah (Dengan Validasi)
    const handleAddSubmit = (e) => {
        e.preventDefault();

        // 1. Validasi Client-Side
        let formErrors = {};
        if (addFormData.nisn.length < 5) {
            formErrors.nisn = "NISN minimal 5 karakter.";
        }
        if (addFormData.full_name.trim().length < 3) {
            formErrors.full_name = "Nama lengkap minimal 3 huruf.";
        }
        if (addFormData.class.trim().length === 0) {
            formErrors.class = "Kelas tidak boleh kosong.";
        }
        if (addFormData.password.length < 6) {
            formErrors.password = "Password minimal 6 karakter.";
        }

        // Jika ada error, hentikan submit dan set state errors
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Jika lolos validasi client, lanjut ke server
        setErrors({});
        setSaving(true);
        router.post("/admin/users", addFormData, {
            onSuccess: () => {
                setIsAddOpen(false);
                setSaving(false);
                toast.success("Akun siswa berhasil dibuat.");
            },
            onError: (serverErrors) => {
                setSaving(false);
                setErrors(serverErrors); // Tangkap error validasi dari Laravel
                toast.error(
                    "Gagal membuat akun. Periksa kembali data yang diisi.",
                );
            },
        });
    };

    // ✨ Handler Form Reset Password (Dengan Validasi)
    const handleEditPwdSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        // Validasi client-side password
        if (newPassword.length < 6) {
            setErrors({ password: "Password baru minimal 6 karakter." });
            return;
        }

        setErrors({});
        setSaving(true);
        router.put(
            `/admin/users/${selectedUser.id}`,
            { password: newPassword },
            {
                onSuccess: () => {
                    setIsEditPwdOpen(false);
                    setSaving(false);
                    toast.success("Password berhasil diperbarui.");
                    router.get("/admin/users");
                },
                onError: (serverErrors) => {
                    setSaving(false);
                    setErrors(serverErrors);
                    toast.error("Gagal memperbarui password.");
                },
            },
        );
    };

    const handleDelete = () => {
        if (!selectedUser) return;
        setDeleting(true);
        router.delete(`/admin/users/${selectedUser.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedUser(null);
                setDeleting(false);
                toast.success("Akun siswa berhasil dihapus.");
            },
            onError: () => {
                setDeleting(false);
                toast.error("Gagal menghapus akun siswa.");
            },
        });
    };

    return (
        <>
            <Head title="Admin - Kelola Siswa">
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/img/logo-s-admin.svg"
                />
            </Head>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <Toaster
                    position="top-center"
                    toastOptions={{ duration: 3500 }}
                />
                {/* Mobile menu backdrop */}
                {mobileNavOpen && (
                    <div
                        className="fixed inset-0 top-0 z-30 bg-black/50 lg:hidden"
                        onClick={() => setMobileNavOpen(false)}
                    />
                )}
                <div className="flex min-h-screen">
                    {/* Mobile sidebar */}
                    <aside
                        className={cn(
                            "fixed inset-y-0 left-0 z-40 w-[240px] overflow-y-auto border-r border-slate-200 bg-white transition-transform lg:hidden",
                            mobileNavOpen
                                ? "translate-x-0"
                                : "-translate-x-full",
                        )}
                    >
                        <div className="flex h-full flex-col px-4 py-6">
                            <div className="flex justify-between items-center mb-4">
                                <img
                                    src={logoAdmin}
                                    alt="logo Admin"
                                    className="h-10"
                                />
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
                                    onClick={() => setMobileNavOpen(false)}
                                />
                                <NavItem
                                    href="/admin/users"
                                    icon={Users}
                                    label="Siswa"
                                    active
                                    onClick={() => setMobileNavOpen(false)}
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
                    {/* Sidebar */}
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
                                />
                                <NavItem
                                    href="/admin/users"
                                    icon={Users}
                                    label="Siswa"
                                    active
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
                                        Kelola Akun Siswa
                                    </h1>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Manajemen akses siswa ke dalam sistem
                                        pelaporan aspirasi.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative w-full sm:w-[280px]">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        placeholder="Cari NISN atau Nama..."
                                        className="pl-9 h-10 bg-white border-slate-200 shadow-sm rounded-md"
                                    />
                                </div>
                                <Button
                                    onClick={handleOpenAdd}
                                    className="h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 shadow-sm"
                                >
                                    <Plus className="mr-1.5 h-4 w-4" /> Buat
                                    Akun Siswa
                                </Button>
                            </div>
                        </div>

                        <div className={cn(shell, "overflow-hidden relative")}>
                            <Table>
                                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                                    <TableRow>
                                        <TableHead className="w-[100px] text-center font-extrabold text-slate-800">
                                            ID
                                        </TableHead>
                                        <TableHead className="w-[140px] text-center font-extrabold text-slate-800">
                                            NISN
                                        </TableHead>
                                        <TableHead className="text-center font-extrabold text-slate-800">
                                            Nama Lengkap
                                        </TableHead>
                                        <TableHead className="w-[120px] text-center font-extrabold text-slate-800">
                                            Kelas
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
                                                colSpan={5}
                                                className="py-12 text-center text-slate-500 font-medium"
                                            >
                                                Tidak ada akun siswa ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedItems.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-slate-50/80 transition-colors"
                                            >
                                                <TableCell className="text-center font-medium text-slate-500">
                                                    USR-{item.id}
                                                </TableCell>
                                                <TableCell className="text-center font-medium text-slate-900">
                                                    {item.nisn}
                                                </TableCell>
                                                <TableCell className="text-center font-medium text-slate-700">
                                                    {item.name}
                                                </TableCell>
                                                <TableCell className="text-center text-sm font-medium text-slate-600">
                                                    {item.class}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleOpenEditPwd(
                                                                    item,
                                                                )
                                                            }
                                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                            title="Ganti Password"
                                                        >
                                                            <KeySquare className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleOpenDelete(
                                                                    item,
                                                                )
                                                            }
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Hapus Akun"
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
                                        className="bg-white rounded-md shadow-sm"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((p) => p - 1)
                                        }
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" />{" "}
                                        Prev
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="bg-white rounded-md shadow-sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((p) => p + 1)
                                        }
                                    >
                                        Next{" "}
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                {/* Modal: Tambah Akun */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="p-0 gap-0 overflow-hidden bg-white sm:max-w-[480px] border-slate-200/70 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-row items-center gap-3 m-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700 shrink-0">
                                <UserPlus className="h-4 w-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-extrabold text-slate-800 text-left">
                                    Buat Akun Siswa
                                </DialogTitle>
                                <p className="text-xs text-slate-500 text-left mt-0.5">
                                    Isi data siswa secara manual.
                                </p>
                            </div>
                        </DialogHeader>
                        <form
                            onSubmit={handleAddSubmit}
                            className="flex flex-col"
                        >
                            <div className="p-6 space-y-4 bg-white">
                                {/* Input NISN */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-slate-800">
                                        NISN
                                    </label>
                                    <Input
                                        value={addFormData.nisn}
                                        onChange={(e) => {
                                            setAddFormData({
                                                ...addFormData,
                                                nisn: e.target.value,
                                            });
                                            if (errors.nisn)
                                                setErrors({
                                                    ...errors,
                                                    nisn: null,
                                                });
                                        }}
                                        placeholder="Contoh: 0087776285"
                                        // ✨ Ganti warna border jika ada error
                                        className={cn(
                                            "h-11 bg-white shadow-sm rounded-md",
                                            errors.nisn
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : "border-slate-300 focus-visible:ring-blue-600",
                                        )}
                                    />
                                    {/* ✨ Munculkan teks error */}
                                    {errors.nisn && (
                                        <p className="mt-1.5 text-xs font-semibold text-red-500">
                                            {errors.nisn}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Input Nama */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-slate-800">
                                            Nama Lengkap
                                        </label>
                                        <Input
                                            value={addFormData.full_name}
                                            onChange={(e) => {
                                                setAddFormData({
                                                    ...addFormData,
                                                    full_name: e.target.value,
                                                });
                                                if (errors.full_name)
                                                    setErrors({
                                                        ...errors,
                                                        full_name: null,
                                                    });
                                            }}
                                            placeholder="Contoh: Budi Santoso"
                                            className={cn(
                                                "h-11 bg-white shadow-sm rounded-md",
                                                errors.full_name
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : "border-slate-300 focus-visible:ring-blue-600",
                                            )}
                                        />
                                        {errors.full_name && (
                                            <p className="mt-1.5 text-xs font-semibold text-red-500">
                                                {errors.full_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Input Kelas */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-slate-800">
                                            Kelas
                                        </label>
                                        <Input
                                            value={addFormData.class}
                                            onChange={(e) => {
                                                setAddFormData({
                                                    ...addFormData,
                                                    class: e.target.value,
                                                });
                                                if (errors.class)
                                                    setErrors({
                                                        ...errors,
                                                        class: null,
                                                    });
                                            }}
                                            placeholder="Contoh: 12 RPL 1"
                                            className={cn(
                                                "h-11 bg-white shadow-sm rounded-md",
                                                errors.class
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : "border-slate-300 focus-visible:ring-blue-600",
                                            )}
                                        />
                                        {errors.class && (
                                            <p className="mt-1.5 text-xs font-semibold text-red-500">
                                                {errors.class}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Input Password */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-slate-800">
                                        Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={addFormData.password}
                                        onChange={(e) => {
                                            setAddFormData({
                                                ...addFormData,
                                                password: e.target.value,
                                            });
                                            if (errors.password)
                                                setErrors({
                                                    ...errors,
                                                    password: null,
                                                });
                                        }}
                                        placeholder="Ketik password untuk siswa..."
                                        className={cn(
                                            "h-11 bg-white shadow-sm rounded-md",
                                            errors.password
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : "border-slate-300 focus-visible:ring-blue-600",
                                        )}
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs font-semibold text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 px-5 font-bold rounded-md bg-white"
                                    onClick={() => setIsAddOpen(false)}
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
                                    {saving ? "Menyimpan..." : "Buat Akun"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal: Reset Password */}
                <Dialog open={isEditPwdOpen} onOpenChange={setIsEditPwdOpen}>
                    <DialogContent className="p-0 gap-0 overflow-hidden bg-white sm:max-w-[440px] border-slate-200/70 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-row items-center gap-3 m-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-100 text-amber-700 shrink-0">
                                <KeySquare className="h-4 w-4" />
                            </div>
                            <DialogTitle className="text-base font-extrabold text-slate-800 text-left">
                                Reset Password Siswa
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={handleEditPwdSubmit}
                            className="flex flex-col"
                        >
                            <div className="p-6 space-y-5 bg-white">
                                {selectedUser && (
                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                            Info Siswa
                                        </div>
                                        <div className="font-bold text-slate-900">
                                            {selectedUser.name}
                                        </div>
                                        <div className="text-xs font-medium text-slate-600 mt-0.5">
                                            {selectedUser.nisn} • Kelas{" "}
                                            {selectedUser.class}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-slate-800 text-left">
                                        Password Baru
                                    </label>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (errors.password)
                                                setErrors({
                                                    ...errors,
                                                    password: null,
                                                });
                                        }}
                                        placeholder="Ketik password baru..."
                                        className={cn(
                                            "h-11 bg-white shadow-sm rounded-md",
                                            errors.password
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : "border-slate-300 focus-visible:ring-amber-600",
                                        )}
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs font-semibold text-red-500 text-left">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 px-5 font-bold rounded-md bg-white"
                                    onClick={() => setIsEditPwdOpen(false)}
                                    disabled={saving}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="h-10 px-6 font-bold rounded-md bg-amber-600 hover:bg-amber-700 shadow-sm text-white"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving
                                        ? "Menyimpan..."
                                        : "Simpan Password"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal: Hapus Akun */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="p-0 gap-0 overflow-hidden bg-white sm:max-w-[420px] border-slate-200/70 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                        <div className="flex flex-col bg-white">
                            <div className="p-6 flex items-start gap-4 mt-2">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                                    <TriangleAlert className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="pt-1">
                                    <DialogTitle className="text-lg font-extrabold text-slate-900 mb-1 text-left">
                                        Hapus Akun Siswa?
                                    </DialogTitle>
                                    <p className="text-sm text-slate-500 leading-relaxed text-left mt-1">
                                        Apakah kamu yakin ingin menghapus akses
                                        akun milik{" "}
                                        <span className="font-bold text-slate-800">
                                            "{selectedUser?.name}"
                                        </span>
                                        ?
                                    </p>
                                    <p className="mt-5 text-left text-sm text-slate-500">
                                        <b className="text-slate-800">
                                            Semua riwayat laporan yang dibuat
                                            oleh siswa ini akan hilang.
                                        </b>
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 px-5 font-bold rounded-md bg-white"
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
                                    {deleting
                                        ? "Menghapus..."
                                        : "Ya, Hapus Akses"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Logout Confirmation Dialog */}
                <AlertDialog
                    open={logoutConfirmOpen}
                    onOpenChange={setLogoutConfirmOpen}
                >
                    <AlertDialogContent className="rounded-2xl border-slate-200/70 shadow-lg max-w-md">
                        <AlertDialogHeader className="space-y-2">
                            <AlertDialogTitle className="text-lg font-extrabold text-slate-900">
                                Keluar dari Panel Admin?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium text-slate-600">
                                Anda yakin ingin keluar dari akun admin? Anda
                                harus login kembali untuk mengakses panel ini.
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
