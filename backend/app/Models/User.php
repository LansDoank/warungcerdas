<?php

namespace App\Models;

// 1. Pastikan baris import ini ada
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens; 
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    // 2. Tambahkan HasApiTokens di sini
    use HasApiTokens, Notifiable,HasFactory; 

    protected $fillable = [
        'name',
        'email',
        'password',
        'nama_warung',
    ];

    // ... sisa kode model
}