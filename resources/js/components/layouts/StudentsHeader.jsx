import React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
const logoSrc = "/img/logo-siswa.svg";

export function StudentHeader({ user }) {
    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden md:block">
            <div className="mx-auto flex max-w-6xl items-start justify-between px-6 pt-6">
                <div className="pointer-events-auto flex items-center py-2">
                    <img
                        src={logoSrc}
                        alt="Logo SarprasKu Siswa"
                        className="h-12 w-auto"
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
    );
}
