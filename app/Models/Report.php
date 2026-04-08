<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'student_id',
    'category_id',
    'title',
    'location',
    'description',
    'status',
    'admin_notes',
    'completed_at',
])]
class Report extends Model
{
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function photo()
    {
        return $this->hasMany(ReportPhoto::class);
    }

    public function statusHistory()
    {
        return $this->hasMany(ReportStatusHistory::class);
    }
}
