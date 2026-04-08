<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\{Fillable, Hidden};
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Database\Factories\UserFactory;

#[Fillable(['nisn', 'full_name', 'username', 'password', 'password', 'class', 'level'])]
#[Hidden(['password'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'student_id');
    }

    public function isStudent(): bool
    {
        return $this->level === 'student';
    }

    public function isAdmin(): bool
    {
        return $this->level === 'admin';
    }
}