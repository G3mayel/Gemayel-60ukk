import React, { useState, useRef } from "react";
import { Link, useForm, Head } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import {
    ArrowLeft,
    AlertCircle,
    Lightbulb,
    UploadCloud,
    X,
} from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

import { StudentHeader } from "@/components/layouts/StudentsHeader";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function AspirationCreate({ categories, user }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const { data, setData, post, processing, errors, setError, clearErrors, reset } = useForm({
        category_id: "",
        title: "",
        location: "",
        description: "",
        photos: [],
    });

    function handleFileChange(e) {
        const files = Array.from(e.target.files || []);

        if (files.length > 1) {
            toast.error("Maksimal 1 foto saja yang diizinkan.");
            return;
        }

        const validFiles = files.filter((file) => {
            if (file.size > 2048 * 1024) {
                toast.error(`Ukuran ${file.name} terlalu besar (maks 2MB).`);
                return false;
            }

            const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
            const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
            const fileExt = file.name.toLowerCase().split(".").pop();
            const isValidExt = validExtensions.includes(`.${fileExt}`);
            const isValidMime = validMimeTypes.includes(file.type);

            if (!isValidExt && !isValidMime) {
                toast.error(`${file.name} bukan format gambar yang valid (JPEG, PNG, GIF).`);
                return false;
            }
            return true;
        });

        setSelectedFiles(validFiles);
        setData("photos", validFiles);
        if (errors.photos) clearErrors("photos");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function removeFile() {
        setSelectedFiles([]);
        setData("photos", []);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleReset() {
        reset();
        clearErrors();
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        clearErrors(); 

        let hasError = false;

        if (!data.title || data.title.trim().length < 3) {
            setError("title", "Judul aspirasi minimal 3 karakter.");
            hasError = true;
        }
        if (!data.category_id) {
            setError("category_id", "Kategori masalah harus dipilih.");
            hasError = true;
        }
        if (!data.location || data.location.trim().length < 3) {
            setError("location", "Lokasi spesifik minimal 3 karakter.");
            hasError = true;
        }
        if (!data.description || data.description.trim().length < 10) {
            setError("description", "Deskripsi minimal 10 karakter.");
            hasError = true;
        }

        if (hasError) {
            toast.error("Mohon periksa kembali form Anda.");
            return;
        }

        setConfirmDialogOpen(true);
    }

    function confirmSubmit() {
        setConfirmDialogOpen(false);
        post("/reports", {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Aspirasi berhasil dikirim!");
                handleReset();
            },
            onError: (serverErrors) => {
                toast.error("Gagal mengirim aspirasi. Silakan cek kembali data Anda.");
            },
        });
    }

    const guide = [
        "Gunakan bahasa yang sopan, jelas, dan mudah dipahami.",
        "Pastikan kategori masalah yang dipilih sesuai dengan aspirasi.",
        "Lokasi harus spesifik agar mudah ditindaklanjuti oleh petugas.",
        "Lampirkan bukti foto jika ada kerusakan fisik untuk mempercepat proses.",
    ];

    return (
        <>
            <Head title="Buat Aspirasi - SarprasKu">
                <link rel="icon" type="image/svg+xml" href="/img/logo-s-siswa.svg" />
            </Head>
            <div className="relative min-h-screen bg-[radial-gradient(1200px_700px_at_0%_0%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(900px_700px_at_100%_15%,rgba(147,51,234,0.18),transparent_55%),linear-gradient(to_bottom_right,#f8fafc,#eef2ff,#f1f5f9)]">
                <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
                <StudentHeader user={user} />

            <main className="mx-auto max-w-6xl px-6 pb-10 pt-6 md:pt-28">
                <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_0.85fr]">

                    {/* LEFT: Form */}
                    <div className="space-y-5">
                        <Link href="/dashboard">
                            <div className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-700 px-4 mb-5 text-sm font-semibold text-white hover:bg-blue-800 transition">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke home page
                            </div>
                        </Link>

                        <Card className="rounded-[26px] border-white/60 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur">
                            <div className="px-5 py-4 sm:px-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
                                        <AlertCircle className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                        Form Aspirasi
                                    </h1>
                                </div>

                                <form className="space-y-5" onSubmit={handleSubmit}>

                                    {/* Judul */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wide text-slate-900">
                                            JUDUL ASPIRASI <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            placeholder="Contoh: Kaca jendela pecah"
                                            value={data.title}
                                            onChange={(e) => {
                                                setData("title", e.target.value);
                                                if (errors.title) clearErrors("title");
                                            }}
                                            className={cn(
                                                "h-11 rounded-xl bg-white shadow-sm",
                                                errors.title ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-blue-600"
                                            )}
                                        />
                                        {errors.title && (
                                            <p className="text-xs font-semibold text-red-500 mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Kategori */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wide text-slate-900">
                                            KATEGORI MASALAH <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.category_id}
                                            onValueChange={(value) => {
                                                setData("category_id", value);
                                                if (errors.category_id) clearErrors("category_id");
                                            }}
                                        >
                                            <SelectTrigger
                                                className={cn(
                                                    "h-11 w-full rounded-xl bg-white shadow-sm",
                                                    errors.category_id ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-blue-600"
                                                )}
                                            >
                                                <SelectValue placeholder="Pilih kategori">
                                                    {data.category_id && categories?.find((cat) => String(cat.id) === data.category_id)?.name}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200/70 shadow-lg">
                                                {categories?.map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)} className="rounded-md">
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && (
                                            <p className="text-xs font-semibold text-red-500 mt-1">{errors.category_id}</p>
                                        )}
                                    </div>

                                    {/* Lokasi */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wide text-slate-900">
                                            LOKASI SPESIFIK <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            placeholder="Contoh: Ruang XII-RPL-1"
                                            value={data.location}
                                            onChange={(e) => {
                                                setData("location", e.target.value);
                                                if (errors.location) clearErrors("location");
                                            }}
                                            className={cn(
                                                "h-11 rounded-xl bg-white shadow-sm",
                                                errors.location ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-blue-600"
                                            )}
                                        />
                                        {errors.location && (
                                            <p className="text-xs font-semibold text-red-500 mt-1">{errors.location}</p>
                                        )}
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wide text-slate-900">
                                            DESKRIPSI <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            placeholder="Jelaskan detail masalah yang ingin dilaporkan..."
                                            value={data.description}
                                            onChange={(e) => {
                                                setData("description", e.target.value);
                                                if (errors.description) clearErrors("description");
                                            }}
                                            className={cn(
                                                "min-h-[140px] resize-none rounded-xl bg-white shadow-sm font-medium",
                                                errors.description ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-blue-600"
                                            )}
                                        />
                                        {errors.description && (
                                            <p className="text-xs font-semibold text-red-500 mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* Bukti Foto (opsional) */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold tracking-wide text-slate-900">
                                            BUKTI FOTO <span className="text-slate-400 font-normal">(opsional)</span>
                                        </Label>

                                        <label
                                            htmlFor="file-input"
                                            className={cn(
                                                "flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition",
                                                errors.photos ? "border-red-400 bg-red-50/50 hover:bg-red-50" : "border-blue-300 bg-white/40 hover:bg-white/60 text-slate-600"
                                            )}
                                        >
                                            {selectedFiles.length === 0 ? (
                                                <div className="flex flex-col items-center gap-2 text-sm font-medium">
                                                    <UploadCloud className={cn("h-8 w-8", errors.photos ? "text-red-500" : "text-blue-600")} />
                                                    <span className={errors.photos ? "text-red-600" : ""}>
                                                        Pilih / Tarik & drop foto di sini
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        JPEG, PNG, GIF — maks 2MB
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 border border-blue-100 shadow-sm">
                                                        <div className="rounded bg-blue-100 p-1.5">
                                                            <UploadCloud className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex flex-col max-w-[200px]">
                                                            <span className="text-sm font-bold text-slate-900 truncate">
                                                                {selectedFiles[0].name}
                                                            </span>
                                                            <span className="text-xs font-medium text-slate-500">
                                                                {(selectedFiles[0].size / 1024).toFixed(1)} KB
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeFile();
                                                        }}
                                                        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                        Hapus file
                                                    </button>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                id="file-input"
                                                accept="image/jpeg,image/png,image/gif"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        {errors.photos && (
                                            <p className="text-xs font-semibold text-red-500 mt-1">{errors.photos}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-11 rounded-xl border-red-200 text-red-600 font-bold hover:bg-red-50 hover:text-red-700 transition"
                                            onClick={handleReset}
                                            disabled={processing}
                                        >
                                            Clear Form
                                        </Button>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-11 flex-1 rounded-xl bg-blue-700 font-bold shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 transition"
                                        >
                                            {processing ? "Mengirim Aspirasi..." : "Kirim Aspirasi"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT: Sidebar */}
                    <div className="space-y-6">
                        <Card className="rounded-[26px] border-white/60 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur">
                            <div className="px-5 py-4 sm:px-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100">
                                        <Lightbulb className="h-5 w-5 text-yellow-700" />
                                    </div>
                                    <div className="text-sm font-extrabold text-slate-900">
                                        Panduan Pengisian
                                    </div>
                                </div>

                                <ol className="space-y-3 text-sm text-slate-700 font-medium">
                                    {guide.map((t, i) => (
                                        <li key={i} className="flex gap-3">
                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                                                {i + 1}
                                            </div>
                                            <p className="leading-relaxed">
                                                {t}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </Card>

                        <div className="relative overflow-hidden rounded-[26px] bg-[#25d366] shadow-[0_18px_45px_rgba(0,0,0,0.15)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(37,211,102,0.3)]">
                            <div className="relative z-10 p-6">
                                <div className="text-lg font-extrabold text-white">
                                    Butuh bantuan lebih lanjut?
                                </div>
                                <p className="mt-1 text-sm font-medium text-white/90">
                                    Jika bingung atau ada keadaan darurat, segera hubungi Admin Sarpras.
                                </p>

                                <Button
                                    asChild
                                    className="mt-5 h-11 rounded-xl bg-white text-[#25d366] font-extrabold hover:bg-green-50 shadow-sm"
                                >
                                    <a
                                        href="https://wa.me/62"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <SiWhatsapp
                                            size={18}
                                            color="default"
                                            className="text-[#25d366]"
                                        />
                                        Chat Admin Sekarang
                                    </a>
                                </Button>
                            </div>

                            <SiWhatsapp
                                size={140}
                                color="#FFFFFF"
                                className="pointer-events-none absolute -bottom-8 -right-4 opacity-20"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <AlertDialogContent className="rounded-2xl border-slate-200/70 shadow-lg max-w-md">
                    <AlertDialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                                <AlertCircle className="h-6 w-6 text-yellow-700" />
                            </div>
                            <AlertDialogTitle className="text-lg font-extrabold text-slate-900">
                                Konfirmasi Pengiriman
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm font-medium text-slate-600 mt-2 space-y-2">
                            <p>
                                Pastikan data aspirasi Anda sudah <strong>benar dan lengkap</strong>, karena aspirasi yang sudah dikirim <strong>tidak bisa diubah lagi.</strong>
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Jika ingin mengubah, Anda harus membuat laporan aspirasi baru.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex flex-row gap-3 pt-4 justify-end">
                        <AlertDialogCancel className="h-10 rounded-lg border-slate-200 font-bold text-slate-700 hover:bg-slate-100">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmSubmit}
                            disabled={processing}
                            className="h-10 rounded-lg bg-blue-700 font-bold hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                        >
                            {processing ? "Mengirim..." : "Ya, Kirim Aspirasi"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            </div>
        </>
    );
}
