<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // 1. Ambil semua produk milik user yang sedang login
    public function index()
    {
        // Paksa menggunakan guard sanctum agar token terbaca di web.php
        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $products = Product::where('user_id', $user->id)->get();
        return response()->json(['success' => true, 'data' => $products]);
    }

    // 2. Simpan produk baru ke database
    public function store(Request $request)
    {
        // Cek apakah user terdeteksi
        if (!auth('sanctum')->check()) {
            return response()->json(['message' => 'Token tidak valid atau expired'], 401);
        }

        $product = Product::create([
            'user_id' => auth('sanctum')->id(),
            'nama_barang' => $request->nama_barang,
            'harga_beli' => $request->harga_beli ?? 0, // Solusi error 1364 tadi
            'harga_jual' => $request->harga_jual,
            'stok' => $request->stok,
            'kategori' => $request->kategori,
        ]);

        return response()->json(['success' => true, 'data' => $product]);
    }

    // 3. Update stok atau harga barang
    public function update(Request $request, $id)
    {
        $product = Product::where('user_id', auth()->id())->findOrFail($id);

        $product->update($request->only([
            'nama_barang',
            'harga_beli',
            'harga_jual',
            'stok',
            'satuan',
            'kategori'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diperbarui!',
            'data' => $product
        ]);
    }

    // 4. Hapus Produk (Soft Delete)
    public function destroy($id)
    {
        $product = Product::where('user_id', auth()->id())->findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus!'
        ]);
    }
}