<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Student\ReportController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;

Route::get('/', function () {
        return inertia('landingpage');
    });

// Auth 
Route::get('/login',        [AuthController::class, 'create'])->name('login');
Route::post('/login',       [AuthController::class, 'store']);
Route::get('/admin/login',  [AuthController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'store']);
Route::post('/logout',      [AuthController::class, 'destroy'])->name('logout')->middleware('auth');
// STUDENTS
Route::middleware(['auth', 'level:student'])->group(function () {
    Route::get('/dashboard', function () {
        return inertia('students/dashboard', ['user' => auth()->user()]);
    })->name('dashboard');

    Route::get('/profile', function () {
        return inertia('students/profile', ['user' => auth()->user()]);
    })->name('profile');

    Route::get('/reports/create', function () {
        return inertia('students/report', [
            'user'       => auth()->user(),
            'categories' => \App\Models\Category::all(['id', 'category_name as name']),
        ]);
    });

    Route::post('/reports',  [ReportController::class, 'store']);
    Route::get('/history',   [ReportController::class, 'history']);
});
// ADMINS
Route::middleware(['auth', 'level:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('admin.dashboard');
    Route::put('/reports/{id}/updateStatus', [AdminReportController::class, 'updateStatus'])
        ->name('admin.reports.updateStatus');
    Route::resource('/reports',    AdminReportController::class)->only(['index', 'show']);
    Route::resource('/categories', CategoryController::class);
    Route::resource('/users',      UserController::class);
});