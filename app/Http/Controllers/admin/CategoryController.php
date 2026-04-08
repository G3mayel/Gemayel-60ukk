<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::oldest()->get();

        return Inertia::render('admin/category', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_name' => 'required|unique:categories,category_name',
                'category_desc' => 'nullable',
            ]);
            Category::create($validated);
            return redirect('/admin/categories')->with('success', 'Kategori berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menambahkan kategori: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $category = Category::findOrFail($id);
            $data = $request->validate([
                'category_name' => 'required|unique:categories,category_name,' . $category->id,
                'category_desc' => 'nullable',
            ]);
            $category->update($data);
            return redirect('/admin/categories', 303)->with('success', 'Kategori berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui kategori: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->reports()->delete();
        $category->delete();
        return redirect('/admin/categories', 303);
    }
}