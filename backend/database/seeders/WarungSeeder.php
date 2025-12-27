<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Debt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class WarungSeeder extends Seeder
{
    public function run()
    {
        // 1. Buat Akun Pemilik Warung (Untuk Login)
        $user = User::create([
            'name' => 'Budi Pemilik Warung',
            'nama_warung' => 'Warung Barokah Jaya',
            'email' => 'budi@gmail.com',
            'password' => Hash::make('password123'),
        ]);
        $user1 = User::create([
            'name' => 'Muhamad Maulana',
            'nama_warung' => 'Warung Maulana',
            'email' => 'lana@gmail.com',
            'password' => Hash::make('lana123'),
        ]);

        // 2. Buat Data Barang (Stok)
        $products = [
            ['nama_barang' => 'Indomie Goreng', 'harga_beli' => 2800, 'harga_jual' => 3500, 'stok' => 40, 'satuan' => 'pcs'],
            ['nama_barang' => 'Beras Rojo Lele 5kg', 'harga_beli' => 62000, 'harga_jual' => 75000, 'stok' => 10, 'satuan' => 'karung'],
            ['nama_barang' => 'Minyak Goreng Bimoli 1L', 'harga_beli' => 14000, 'harga_jual' => 18000, 'stok' => 3, 'satuan' => 'botol'], // Stok sedikit untuk tes alert
            ['nama_barang' => 'Telur Ayam', 'harga_beli' => 1500, 'harga_jual' => 2000, 'stok' => 100, 'satuan' => 'butir'],
            ['nama_barang' => 'Gula Pasir 1kg', 'harga_beli' => 13000, 'harga_jual' => 16000, 'stok' => 15, 'satuan' => 'bungkus'],
        ];

        foreach ($products as $p) {
            Product::create(array_merge($p, [
                'user_id' => $user->id,
                'kode_barang' => 'BRG-' . Str::upper(Str::random(5)),
                'kategori' => 'Sembako'
            ]));
        }

        // 3. Buat Data Pelanggan
        $customer = Customer::create([
            'user_id' => $user->id,
            'nama_pelanggan' => 'Pak RT Agus',
            'nomor_wa' => '628123456789',
            'alamat' => 'Blok A No. 12'
        ]);

        // 4. Buat Contoh Transaksi Lunas
        $trx = Transaction::create([
            'user_id' => $user->id,
            'customer_id' => null,
            'invoice_number' => 'CW-LUNAS-001',
            'total_harga' => 7000,
            'bayar' => 10000,
            'kembali' => 3000,
            'status_pembayaran' => 'Lunas',
            'tanggal_transaksi' => now(),
        ]);

        // Isi Detail Transaksi Lunas (Beli 2 Indomie)
        TransactionDetail::create([
            'transaction_id' => $trx->id,
            'product_id' => 1, // ID Indomie
            'qty' => 2,
            'harga_satuan' => 3500,
            'subtotal' => 7000
        ]);

        // 5. Buat Contoh Transaksi Hutang
        $trxHutang = Transaction::create([
            'user_id' => $user->id,
            'customer_id' => $customer->id,
            'invoice_number' => 'CW-HUTANG-001',
            'total_harga' => 75000,
            'bayar' => 0,
            'kembali' => 0,
            'status_pembayaran' => 'Hutang',
            'tanggal_transaksi' => now()->subDays(2), // 2 hari yang lalu
        ]);

        Debt::create([
            'transaction_id' => $trxHutang->id,
            'customer_id' => $customer->id,
            'sisa_hutang' => 75000,
            'jatuh_tempo' => now()->addDays(7), // Jatuh tempo 7 hari kedepan
            'status' => 'Belum Lunas'
        ]);
    }
}