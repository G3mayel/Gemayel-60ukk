<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureLevel
{
    public function handle(Request $request, Closure $next, string $level): mixed
    {
        if (!auth()->check()) {
            return redirect('/login');
        }

        if (auth()->user()->level !== $level) {
            $redirectUrl = auth()->user()->level === 'admin' 
                ? '/admin/dashboard' 
                : '/dashboard';
            
            return redirect($redirectUrl)
                ->with('error', 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}