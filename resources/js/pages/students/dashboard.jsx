import React, { useEffect } from "react";
import { Link, usePage, Head } from "@inertiajs/react";
import { TileButton } from "@/Components/ui/TileButton";
import { MessageCircleWarning, History, UserCircle2, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const logoSekolah = "/img/logo-sekolah.svg";
const logoSiswa = "/img/logo-siswa.svg";

export default function Dashboard({ user }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <>
            <Head title="Siswa - Dashboard">
                <link rel="icon" type="image/svg+xml" href="/img/logo-s-siswa.svg" />
            </Head>
            <div className="relative min-h-screen bg-[radial-gradient(1200px_700px_at_0%_0%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(900px_700px_at_100%_15%,rgba(147,51,234,0.18),transparent_55%),linear-gradient(to_bottom_right,#f8fafc,#eef2ff,#f1f5f9)]">
                <Toaster position="top-center" />
            <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
                {/* Mobile navbar */}
                <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur md:hidden">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                        <img
                            src={logoSiswa}
                            alt="SarprasKu"
                            className="h-9 w-auto"
                            draggable={false}
                        />

                        <div className="flex items-center gap-3">
                            <div className="text-right leading-tight">
                                <div className="text-sm font-semibold text-slate-900">
                                    {user.full_name}
                                </div>
                                <div className="text-xs text-slate-600">
                                    {user.nisn}
                                </div>
                            </div>
                            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-blue-600/20">
                                <User
                                    alt={user.full_name}
                                    className="h-6 w-6 text-blue-700"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Desktop floating cards */}
                <div className="pointer-events-none absolute inset-x-0 top-0 hidden md:block">
                    <div className="mx-auto flex max-w-6xl items-start justify-between px-6 pt-6">
                        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                            <img
                                src={logoSekolah}
                                alt="Logo SMKN 4"
                                className="h-10 w-auto"
                                draggable={false}
                            />
                        </div>

                        <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-slate-900">
                                    {user.full_name}
                                </div>
                                <div className="text-xs text-slate-600">
                                    {user.nisn}
                                </div>
                            </div>
                            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-blue-600/20">
                                <User
                                    alt={user.full_name}
                                    className="h-6 w-6 text-blue-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:min-h-screen lg:px-8">
                    <div className="w-full max-w-5xl">
                        {/* Desktop hero only */}
                        <div className="mb-8 hidden flex-col items-center text-center md:flex md:mb-10">
                            <img
                                src={logoSiswa}
                                alt="SarprasKu Siswa"
                                className="h-32 w-auto"
                                draggable={false}
                            />
                            <p className="mt-4 max-w-xl text-sm text-slate-600">
                                Sampaikan laporan sarana sekolah dengan mudah,
                                pantau statusnya, hingga tuntas.
                            </p>
                        </div>

                        <div
                            className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:items-stretch"
                            draggable={false}
                        >
                            <TileButton
                                title={["Berikan", "Aspirasi"]}
                                href="/reports/create"
                                icon={MessageCircleWarning}
                                iconPosition="bottom-left"
                                textPosition="top"
                                textAlign="center"
                                className="min-h-[230px] sm:min-h-[300px] md:min-h-[420px]"
                                paddingClassName="p-6 sm:p-8"
                                titleClassName="font-bold text-right text-[40px] leading-[0.95] sm:text-[48px] md:text-[52px]"
                                iconClassName="text-white"
                            />

                            <div className="grid gap-4 sm:gap-5 md:grid-rows-2 md:min-h-[420px]">
                                <TileButton
                                    title={["Riwayat", "Aspirasi"]}
                                    href="/history"
                                    icon={History}
                                    iconPosition="right"
                                    textAlign="left"
                                    textPosition="top"
                                    className="min-h-[200px] sm:min-h-[240px] md:min-h-0 md:h-full"
                                    paddingClassName="p-6 sm:p-8"
                                    titleClassName="font-bold text-[40px] leading-[0.95] sm:text-[48px] md:text-[52px]"
                                    iconClassName="text-white"
                                />

                                <TileButton
                                    title="Profil"
                                    href="/profile"
                                    icon={UserCircle2}
                                    iconPosition="top-right"
                                    textAlign="left"
                                    textPosition="bottom"
                                    className="min-h-[200px] sm:min-h-[240px] md:min-h-0 md:h-full"
                                    paddingClassName="p-6 sm:p-8"
                                    titleClassName="font-bold text-[36px] leading-[0.95] sm:text-[42px] md:text-[48px]"
                                    iconClassName="text-white"
                                />
                            </div>
                        </div>

                        <footer className="mt-8 flex justify-center sm:mt-10">
                            <p className="text-sm text-slate-600">
                                Copyright © SarprasKu - 2026
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
        </>
    );
}
