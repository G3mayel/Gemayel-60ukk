<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController
{
    public function create()
    {
        return Inertia::render('login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'identifier' => 'required',
            'password' => 'required'
        ]);

        $field = preg_match('/^\d+$/', $credentials['identifier'])
            ? 'nisn'
            : 'username';

        if (Auth::attempt([
            $field => $credentials['identifier'],
            'password' => $credentials['password']
        ])) {
            $request->session()->regenerate();

            $user = Auth::user();
            if ($user->level === 'admin') {
                return redirect()->route('admin.dashboard')->with('success', 'Login berhasil!');
            }

            return redirect()->route('dashboard')->with('success', 'Login berhasil!');
        }
        return back()->withErrors([
            'identifier' => 'NISN/Username atau password salah'
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('login');
    }
}