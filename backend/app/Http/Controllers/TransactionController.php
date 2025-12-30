<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\Debt;
use Illuminate\Support\Str;

class TransactionController extends Controller
{

    public function index()
    {
        // 1. Ambil ID user yang sedang login dari Token Sanctum
        $userId = auth('sanctum')->id();

        // 2. Ambil transaksi yang HANYA dimiliki oleh user tersebut
        $transactions = Transaction::with(['details.product'])
            ->where('user_id', $userId) // Filter berdasarkan pemilik
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar riwayat transaksi Anda',
            'data' => $transactions
        ]);
    }
    public function store(Request $request)
    {
        // return response()->json($request);

        $request->validate([
            'total_harga' => 'required|numeric',
            'bayar' => 'required|numeric',
            'items' => 'required|array', // Array barang yang dibeli
        ]);

        // Gunakan DB Transaction agar data aman
        DB::beginTransaction();

        try {
            // 1. Simpan data Transaksi Utama
            $transaction = Transaction::create([
                'user_id' => $request->user_id,
                'invoice_number' => 'TRX-' . time(),
                'total_harga' => $request->total_harga,
                'bayar' => $request->bayar,
                'kembali' => $request->bayar - $request->total_harga,
                'status_pembayaran' => 'Lunas',
                'tanggal_transaksi' => now(),
            ]);

            // 2. Looping semua barang yang dibeli
            foreach ($request->items as $item) {
                // Cari produknya
                $product = Product::find($item['product_id']);

                if (!$product) {
                    throw new \Exception("Produk tidak ditemukan");
                }

                // CEK STOK: Jika stok kurang dari yang dibeli
                if ($product->stok < $item['qty']) {
                    throw new \Exception("Stok {$product->nama_barang} tidak cukup!");
                }

                // 3. KURANGI STOK BARANG
                $product->decrement('stok', $item['qty']);

                // 4. Simpan Detail Transaksi
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'harga_satuan' => $item['harga_jual'],
                    'subtotal' => $item['qty'] * $item['harga_jual'],
                ]);
            }

            // Jika semua lancar, simpan permanen
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi Berhasil!',
                'data' => $transaction
            ]);

        } catch (\Exception $e) {
            // Jika ada error (misal stok habis), batalkan semua simpanan data
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal: ' . $e->getMessage()
            ], 400);
        }
    }


    public function dashboard()
    {
        $userId = auth('sanctum')->id(); // Ambil ID user yang login
        $hariIni = date('Y-m-d');

        // 1. Total Pendapatan Hari Ini (Hanya milik user ini)
        $pendapatan = Transaction::where('user_id', $userId)
            ->whereDate('created_at', $hariIni)
            ->sum('total_harga');

        // 2. Total Transaksi Hari Ini (Hanya milik user ini)
        $totalTransaksi = Transaction::where('user_id', $userId)
            ->whereDate('created_at', $hariIni)
            ->count();

        // 3. Produk Stok Sedikit (Hanya milik user ini)
        $stokKritis = Product::where('user_id', $userId)
            ->where('stok', '<', 5)
            ->get();

        // 4. Produk Terlaris (Hanya item dari transaksi milik user ini)
        // GANTI QUERY NOMOR 4 DENGAN INI UNTUK TEST:
$produkTerlaris = DB::table('transaction_details')
    ->join('products', 'transaction_details.product_id', '=', 'products.id')
    ->select(
        'products.nama_barang', 
        'transaction_details.product_id', 
        DB::raw('SUM(transaction_details.qty) as total_terjual')
    )
    ->whereExists(function ($query) use ($userId) {
        $query->select(DB::raw(1))
              ->from('transactions')
              ->whereColumn('transactions.id', 'transaction_details.transaction_id')
              ->where('transactions.user_id', $userId);
    })
    ->groupBy('transaction_details.product_id', 'products.nama_barang')
    ->orderByDesc('total_terjual')
    ->take(5)
    ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'pendapatan_hari_ini' => (int) $pendapatan,
                'total_transaksi' => $totalTransaksi,
                'stok_kritis' => $stokKritis,
                'terlaris' => $produkTerlaris
            ]
        ]);
    }

}