<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserLevel
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle($request, Closure $next, $level)
    {
        if (! auth()->check() || auth()->user()->level != $level) {
            return redirect('home')->with('error', 'Unauthorized access');
        }

        return $next($request);
    }
}
