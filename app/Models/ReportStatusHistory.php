<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'report_id',
    'old_status',
    'new_status',
    'admin_notes',
    'changed_at',
])]
class ReportStatusHistory extends Model
{
    public $timestamps = false;

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class, 'report_id');
    }
}