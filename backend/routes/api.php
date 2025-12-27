<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
// Pastikan import ini benar sesuai folder Anda
use App\Http\Controllers\TransactionController; 

// Hapus atau comment baris rute yang lama, ganti dengan ini:
// Route::middleware('auth:sanctum')->group(function () {
//     // URL ini nanti akan menjadi: http://localhost:8000/api/transactions
//     Route::post('/transactions', [TransactionController::class, 'store']); 
    
//     // Jika ingin melihat riwayat transaksi (GET)
//     // Route::get('/transactions', [TransactionController::class, 'index']);


// });

// // Route::get('/api/transaction',[TransactionController::class,'api']);

// Route::post('/api/login',[AuthController::class,'login']);