import React from "react";
import { Link, useForm, Head } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { ShieldCheck, User, ArrowLeft } from "lucide-react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";

const logoSiswa = "/img/logo-siswa.svg";
const logoAdmin = "/img/logo-admin.svg";

const LOGIN_URL = {
    siswa: "/login",
    admin: "/admin/login",
};

export default function Login({ role: initialRole = "siswa" }) {
    const [role, setRole] = React.useState(initialRole);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        setError,
        reset,
        clearErrors,
    } = useForm({
        identifier: "",
        password: "",
    });

    const isSiswa = role === "siswa";

    const switchRole = (next) => {
        setRole(next);
        clearErrors();
        reset("identifier", "password");
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        let hasError = false;

        // Validasi Kosong di sisi Klien (Biar langsung merah kalau kosong)
        if (!data.identifier.trim()) {
            setError(
                "identifier",
                isSiswa
                    ? "NISN tidak boleh kosong."
                    : "Username tidak boleh kosong.",
            );
            hasError = true;
        }
        if (!data.password.trim()) {
            setError("password", "Password tidak boleh kosong.");
            hasError = true;
        }

        if (hasError) {
            toast.error("Harap isi semua kolom.");
            return;
        }

        // Tembak ke Server (Backend Laravel)
        post(LOGIN_URL[role], {
            preserveScroll: true,
            onError: (serverErrors) => {
                // ✨ Jika login gagal dari server, buat KEDUA kotak menjadi merah
                setError(
                    "identifier",
                    serverErrors.identifier || "Kredensial tidak ditemukan.",
                );
                setError("password", "Password yang dimasukkan salah.");

                toast.error("Gagal masuk. Username/NISN atau Password salah.");
            },
            onFinish: () => reset("password"), // Reset isi password setiap kali gagal
        });
    };

    return (
        <>
            <Head title="Login - SarprasKu">
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/img/logo-s-siswa.svg"
                />
            </Head>
            <div className="relative min-h-screen bg-[radial-gradient(1200px_700px_at_0%_0%,rgba(99,102,241,0.15),transparent_55%),radial-gradient(900px_700px_at_100%_15%,rgba(147,51,234,0.12),transparent_55%),linear-gradient(to_bottom_right,#f8fafc,#eef2ff,#f1f5f9)]">
                <Toaster
                    position="top-center"
                    toastOptions={{ duration: 3500 }}
                />

                <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 relative z-10">
                    <div className="w-full max-w-[420px]">
                        <div className="mb-5 flex items-center justify-between">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-blue-700"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>

                            <div className="flex items-center gap-2">
                                <img
                                    src={isSiswa ? logoSiswa : logoAdmin}
                                    alt="SarprasKu"
                                    className="h-9 w-auto drop-shadow-sm"
                                />
                            </div>
                        </div>

                        <Card className="rounded-[24px] border-white/60 bg-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                            <div className="p-7 sm:p-8">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                                        Selamat Datang
                                    </h1>
                                    <p className="mt-1.5 text-sm font-medium text-slate-500">
                                        {isSiswa
                                            ? "Gunakan NISN yang terdaftar untuk akun siswa."
                                            : "Gunakan Username Anda untuk akun admin."}
                                    </p>
                                </div>

                                <div className="mb-6 inline-flex w-full rounded-xl bg-slate-100/80 p-1.5 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => switchRole("siswa")}
                                        className={cn(
                                            "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200",
                                            isSiswa
                                                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/50"
                                                : "text-slate-500 hover:text-slate-900",
                                        )}
                                    >
                                        <User className="h-4 w-4" />
                                        Siswa
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => switchRole("admin")}
                                        className={cn(
                                            "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200",
                                            !isSiswa
                                                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/50"
                                                : "text-slate-500 hover:text-slate-900",
                                        )}
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Admin
                                    </button>
                                </div>

                                <form onSubmit={submit} className="space-y-5">
                                    {/* Identifier Input */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wide text-slate-800 uppercase">
                                            {isSiswa ? "NISN" : "Username"}
                                        </Label>
                                        <Input
                                            value={data.identifier}
                                            onChange={(e) => {
                                                setData(
                                                    "identifier",
                                                    e.target.value,
                                                );
                                                if (errors.identifier)
                                                    clearErrors("identifier"); // Hilangkan merah saat ngetik ulang
                                            }}
                                            placeholder={
                                                isSiswa
                                                    ? "Masukkan NISN"
                                                    : "Masukkan username"
                                            }
                                            inputMode={
                                                isSiswa ? "numeric" : undefined
                                            }
                                            autoCapitalize="none"
                                            disabled={processing}
                                            className={cn(
                                                "h-11 rounded-xl bg-white shadow-sm transition-colors font-medium",
                                                errors.identifier
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : "border-slate-200 focus-visible:ring-blue-600",
                                            )}
                                        />
                                        {errors.identifier && (
                                            <p className="text-xs font-bold text-red-500 mt-1">
                                                {errors.identifier}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Input */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wide text-slate-800 uppercase">
                                            Password
                                        </Label>
                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => {
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                );
                                                if (errors.password)
                                                    clearErrors("password"); // Hilangkan merah saat ngetik ulang
                                            }}
                                            placeholder="Masukkan password"
                                            disabled={processing}
                                            className={cn(
                                                "h-11 rounded-xl bg-white shadow-sm transition-colors font-medium",
                                                errors.password
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : "border-slate-200 focus-visible:ring-blue-600",
                                            )}
                                        />
                                        {errors.password && (
                                            <p className="text-xs font-bold text-red-500 mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-2 h-11 w-full rounded-xl bg-blue-700 font-bold shadow-sm hover:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-500 transition"
                                    >
                                        {processing ? "Memproses..." : "Masuk"}
                                    </Button>

                                    <div className="pt-3 text-center text-xs font-medium text-slate-500">
                                        Lupa akses? Segera hubungi Admin
                                        Sarpras.
                                    </div>
                                </form>
                            </div>
                        </Card>

                        <div className="mt-6 text-center text-xs font-bold text-slate-400">
                            © SarprasKu • 2026
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
