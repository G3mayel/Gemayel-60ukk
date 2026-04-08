import React, { useState, useEffect } from "react";
import { Link, router, Head, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    User,
    IdCard,
    ShieldCheck,
    LogOut,
    MessageCircle,
} from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

import { StudentHeader } from "@/components/layouts/StudentsHeader";

import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

function InfoRow({ label, value }) {
    return (
        <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wide text-slate-900">
                {label}
            </Label>
            <Input
                value={value}
                readOnly
                className="h-10 rounded-xl border-slate-200 bg-slate-50 font-medium text-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-default"
            />
        </div>
    );
}

export default function Index({ user }) {
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const { flash } = usePage().props;
    const adminWa = "6283130131310";

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <>
            <Head title="Profil - SarprasKu">
                <link rel="icon" type="image/svg+xml" href="/img/logo-s-siswa.svg" />
            </Head>
            <div className="relative min-h-screen bg-[radial-gradient(1200px_700px_at_0%_0%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(900px_700px_at_100%_15%,rgba(147,51,234,0.18),transparent_55%),linear-gradient(to_bottom_right,#f8fafc,#eef2ff,#f1f5f9)]">
                <StudentHeader user={user} />

            <main className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6 md:pt-28">
                <div className="grid items-start gap-6 lg:grid-cols-[0.55fr_1.45fr]">
                    <div className="space-y-5">
                        <Link
                            href="/dashboard"
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke home page
                        </Link>

                        <Card className="rounded-[26px] border-white/60 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur">
                            <div className="px-5 py-4 sm:px-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-100">
                                        <User
                                            alt={user.full_name}
                                            className="h-6 w-6 text-blue-700"
                                        />
                                    </div>

                                    <div className="min-w-0 pt-1">
                                        <div className="truncate text-base font-extrabold text-slate-900">
                                            {user.full_name}
                                        </div>
                                        <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-blue-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                                            <ShieldCheck className="h-3 w-3" />
                                            {user.level || "Siswa"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                            <IdCard className="h-5 w-5 text-slate-900" />
                                        </div>
                                        <div className="leading-tight truncate">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                NISN
                                            </div>
                                            <div className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                                                {user.nisn}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                            <User className="h-5 w-5 text-slate-900" />
                                        </div>
                                        <div className="leading-tight truncate">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Kelas
                                            </div>
                                            <div className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                                                {user.class}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setLogoutConfirmOpen(true)}
                                    type="button"
                                    className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Detail & Kontak Admin */}
                    <div className="space-y-6">
                        <Card className="rounded-[26px] border-white/60 bg-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur">
                            <div className="px-5 py-4 sm:px-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                        <User className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                        Informasi Pribadi
                                    </h1>
                                </div>

                                <div className="grid gap-5">
                                    <InfoRow
                                        label="Nama Lengkap"
                                        value={user.full_name}
                                    />
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <InfoRow label="NISN" value={user.nisn} />
                                        <InfoRow label="Kelas" value={user.class} />
                                    </div>
                                </div>

                                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-100/50 p-5">
                                    <div className="flex items-center gap-2">
                                        <div className="text-md font-bold text-slate-900">
                                            Catatan
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                                        Data pada halaman ini bersifat <i>read-only</i> (hanya-baca).
                                        Jika ada kesalahan data atau butuh perubahan, silakan hubungi Admin Sarpras.
                                    </p>

                                    <Button
                                        asChild
                                        className="mt-4 h-11 w-full rounded-xl bg-emerald-600 font-bold shadow-sm hover:bg-emerald-700 transition sm:w-auto"
                                    >
                                        <a
                                            href={`https://wa.me/${adminWa}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2"
                                        >
                                            <SiWhatsapp size={18} color="white" />
                                            Chat Admin via WhatsApp
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </main>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
                <AlertDialogContent className="rounded-2xl border-slate-200/70 shadow-lg max-w-md">
                    <AlertDialogHeader className="space-y-2">
                        <AlertDialogTitle className="text-lg font-extrabold text-slate-900">
                            Logout
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-slate-600">
                            Apakah Anda yakin ingin keluar? Anda harus login kembali untuk mengakses akun Anda.
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
                            Ya, Logout
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            </div>
        </>
    );
}
