<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function index()
    {
        $student = User::where('level', 'student')
            ->oldest()
            ->get();

        return Inertia::render('admin/student', [
            'students' => $student
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nisn'      => 'required|unique:users,nisn',
                'full_name' => 'required',
                'password'  => 'required|min:6',
                'class'     => 'required',
            ]);

            User::create([
                'nisn'      => $validated['nisn'],
                'full_name' => $validated['full_name'],
                'password'  => bcrypt($validated['password']),
                'class'     => $validated['class'],
                'level'     => 'student',
            ]);

            return redirect('/admin/users')->with('success', 'Akun siswa berhasil dibuat');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membuat akun: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            if ($request->has('password') && !$request->has('nisn')) {
                $request->validate(['password' => 'required|min:6']);
                $user->update(['password' => bcrypt($request->password)]);
            } else {
                $data = $request->validate([
                    'nisn'      => 'required|unique:users,nisn,' . $user->id,
                    'full_name' => 'required',
                    'password'  => 'nullable|min:6',
                ]);
                if ($request->password) {
                    $data['password'] = bcrypt($data['password']);
                } else {
                    unset($data['password']);
                }
                $user->update($data);
            }

            return redirect('/admin/users', 303)->with('success', 'Password berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->reports()->delete(); 
        $user->delete();
        return redirect('/admin/users', 303);
    }
}