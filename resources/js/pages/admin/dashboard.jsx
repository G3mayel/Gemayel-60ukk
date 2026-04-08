import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    MessageSquareText,
    ListChecks,
    Users,
    Clock,
    Hammer,
    CheckCircle2,
    TrendingUp,
    ChevronRight,
    MapPin,
    Tag,
    Menu,
    X,
    Wrench,
    XCircle,
    LogOut,
} from "lucide-react";
import { Link, router, usePage, Head } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

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

function StatCard({ icon: Icon, label, value, sublabel, iconWrapClass }) {
    return (
        <Card className={shell}>
            <div className="p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span
                        className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md",
                            iconWrapClass,
                        )}
                    >
                        <Icon className="h-4 w-4" />
                    </span>
                    {label}
                </div>

                <div className="mt-3 text-3xl font-extrabold text-slate-950">
                    {value}
                </div>

                <div className="mt-1 text-xs font-medium text-slate-600">
                    {sublabel}
                </div>
            </div>
        </Card>
    );
}

function PanelTitle({ icon: Icon, title, subtitle, right }) {
    return (
        <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600/10 text-blue-700">
                    <Icon className="h-4 w-4" />
                </span>
                <div>
                    <div className="text-sm font-extrabold text-slate-950">
                        {title}
                    </div>
                    {subtitle && (
                        <div className="mt-1 text-xs font-medium text-slate-600">
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            {right}
        </div>
    );
}

function StatusPill({ status }) {
    const config = {
        pending: {
            label: "Pending",
            class: "bg-yellow-50 text-yellow-800 border-yellow-200",
            icon: Clock,
        },
        on_progress: {
            label: "Dikerjakan",
            class: "bg-blue-50 text-blue-800 border-blue-200",
            icon: Wrench,
        },
        completed: {
            label: "Selesai",
            class: "bg-emerald-50 text-emerald-800 border-emerald-200",
            icon: CheckCircle2,
        },
        rejected: {
            label: "Ditolak",
            class: "bg-red-50 text-red-800 border-red-200",
            icon: XCircle,
        },
    };
    const current = config[status] ?? config.pending;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-[11px] font-semibold",
                current.class,
            )}
        >
            <current.icon className="h-3 w-3" />
            {current.label}
        </span>
    );
}

export default function Dashboard({ stats = {}, chartData = [], recent = [] }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const lineConfig = {
        total: { label: "Total", color: "#2563eb" },
    };

    const DatePill = () => (
        <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
            {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
        </div>
    );

    return (
        <>
            <Head title="Admin - Dashboard">
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/img/logo-s-admin.svg"
                />
            </Head>
            <div className="min-h-screen bg-slate-50">
                <Toaster position="top-center" />
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
                                    active
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

                    {/* Desktop sidebar */}
                    <aside className="sticky top-0 h-screen overflow-y-auto hidden w-[240px] shrink-0 border-r border-slate-200 bg-white lg:block">
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
                                    active
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

                    <main className="flex-1 px-6 pt-12 pb-6">
                        <div className="mx-auto max-w-7xl space-y-6">
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
                                            Halo, Admin!
                                        </h1>
                                        <div className="mt-2 text-sm font-medium text-slate-600">
                                            Ringkasan cepat untuk memantau
                                            laporan hari ini.
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <DatePill />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <StatCard
                                    icon={Clock}
                                    label="Pending"
                                    value={stats.pending ?? 0}
                                    sublabel="Menunggu tinjauan"
                                    iconWrapClass="bg-yellow-100 text-yellow-800"
                                />
                                <StatCard
                                    icon={Hammer}
                                    label="Dalam Pengerjaan"
                                    value={stats.on_progress ?? 0}
                                    sublabel="Sedang ditangani"
                                    iconWrapClass="bg-blue-100 text-blue-800"
                                />
                                <StatCard
                                    icon={CheckCircle2}
                                    label="Selesai"
                                    value={stats.completed ?? 0}
                                    sublabel="Sudah ditangani"
                                    iconWrapClass="bg-emerald-100 text-emerald-800"
                                />
                            </div>

                            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                                <Card className={shell}>
                                    <div className="p-5">
                                        <PanelTitle
                                            icon={TrendingUp}
                                            title="Statistik laporan aspirasi"
                                            subtitle="Grafik ringkas per bulan"
                                        />
                                        <div className="mt-4 h-[280px]">
                                            <ChartContainer config={lineConfig}>
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <LineChart data={chartData}>
                                                        <CartesianGrid
                                                            vertical={false}
                                                            stroke="#e2e8f0"
                                                        />
                                                        <XAxis dataKey="month" />
                                                        <YAxis width={28} />
                                                        <ChartTooltip
                                                            content={
                                                                <ChartTooltipContent />
                                                            }
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="total"
                                                            stroke="var(--color-total)"
                                                            strokeWidth={2.5}
                                                            dot={{ r: 4 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </ChartContainer>
                                        </div>
                                    </div>
                                </Card>

                                <Card className={cn(shell, "flex flex-col")}>
                                    <div className="flex-1 overflow-y-auto p-5">
                                        <PanelTitle
                                            icon={Clock}
                                            title="Aspirasi Masuk"
                                            subtitle="Daftar terbaru"
                                            right={
                                                <Link
                                                    href="/admin/reports"
                                                    className="text-xs font-semibold text-blue-700 hover:underline"
                                                >
                                                    Lihat Semua
                                                </Link>
                                            }
                                        />

                                        <div className="mt-4 space-y-3">
                                            {recent && recent.length > 0 ? (
                                                recent.slice(0, 4).map((r) => (
                                                    <div
                                                        key={r.id}
                                                        className="rounded-md border border-slate-200 px-4 py-3 flex-shrink-0"
                                                    >
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-950">
                                                                    {r.title}
                                                                </div>
                                                                <div className="mt-1 flex items-center gap-3 text-xs text-slate-600">
                                                                    <span className="flex items-center gap-1">
                                                                        <Tag className="h-3.5 w-3.5" />
                                                                        {r.category}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="h-3.5 w-3.5" />
                                                                        {r.location}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="text-right flex-shrink-0">
                                                                <div className="text-xs text-slate-500">
                                                                    {r.time}
                                                                </div>
                                                                <div className="mt-2">
                                                                    <StatusPill
                                                                        status={
                                                                            r.status
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                    <MessageSquareText className="h-12 w-12 text-slate-300 mb-3" />
                                                    <p className="text-sm font-medium text-slate-500">
                                                        Tidak ada aspirasi yang masuk untuk saat ini
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </main>

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
                                    Anda yakin ingin keluar dari akun admin?
                                    Anda harus login kembali untuk mengakses
                                    panel ini.
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
            </div>
        </>
    );
}
