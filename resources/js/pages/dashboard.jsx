import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { LogOut } from "lucide-react";

export default function Dashboard({ user }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Halo, {user.full_name}!
                        </h1>
                        <p className="text-slate-600">
                            Selamat datang di SarprasKu Siswa
                        </p>
                    </div>
                    <Link href="/logout" method="post" as="button">
                        <Button variant="outline" size="lg">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="rounded-2xl border-white/60 bg-white/80 p-6 shadow-md">
                        <h2 className="mb-2 text-lg font-semibold text-slate-900">
                            NISN
                        </h2>
                        <p className="text-2xl font-bold text-indigo-600">
                            {user.nisn}
                        </p>
                    </Card>

                    <Card className="rounded-2xl border-white/60 bg-white/80 p-6 shadow-md">
                        <h2 className="mb-2 text-lg font-semibold text-slate-900">
                            Kelas
                        </h2>
                        <p className="text-2xl font-bold text-indigo-600">
                            {user.class}
                        </p>
                    </Card>

                    <Card className="rounded-2xl border-white/60 bg-white/80 p-6 shadow-md">
                        <h2 className="mb-2 text-lg font-semibold text-slate-900">
                            Level
                        </h2>
                        <p className="text-2xl font-bold text-indigo-600 capitalize">
                            {user.level}
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
