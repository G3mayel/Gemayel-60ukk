<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable (['category_name', 'category_desc'])]
class Category extends Model
{
    public function reports()
    {
        return $this->hasMany(Report::class, 'category_id');
    }
}