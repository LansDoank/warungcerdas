<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['user_id', 'nama_barang', 'harga_jual', 'stok', 'kategori'];
}
