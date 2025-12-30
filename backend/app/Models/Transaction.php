<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invoice_number',
        'total_harga',
        'bayar',
        'kembali',
        'status_pembayaran',
        'tanggal_transaksi',
    ];

    public function details()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}