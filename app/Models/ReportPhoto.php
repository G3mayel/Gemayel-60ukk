<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable (['report_id', 'photo_path', 'uploaded_at'])]
class ReportPhoto extends Model
{
    public $timestamps = false;

    protected $appends = ['photo_url'];

    protected $visible = ['id', 'report_id', 'photo_path', 'uploaded_at', 'photo_url'];

    public function report()
    {
        return $this->belongsTo(Report::class, 'report_id');
    }

    public function getPhotoUrlAttribute()
    {
        if (!$this->photo_path) {
            return null;
        }

        if (str_starts_with($this->photo_path, 'http')) {
            return $this->photo_path;
        }

        if (!str_starts_with($this->photo_path, '/')) {
            return '/storage/' . $this->photo_path;
        }

        return $this->photo_path;
    }
}