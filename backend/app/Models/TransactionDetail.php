<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    // Tambahkan baris ini agar data bisa disimpan
    protected $fillable = [
        'transaction_id', 
        'product_id', 
        'qty', 
        'harga_satuan', 
        'subtotal'
    ];

    // TAMBAHKAN INI: Relasi ke Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // Tambahkan juga relasi balik ke Transaction (Opsional tapi baik)
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}