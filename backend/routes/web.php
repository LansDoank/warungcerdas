<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// Rute publik (tanpa login)
Route::post('/api/login', [AuthController::class, 'login']);

// Rute yang butuh login (Multi-User)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/api/transactions', [TransactionController::class, 'index']);
    Route::post('/api/transactions/store', [TransactionController::class, 'store']);
    Route::get('/api/transactions/dashboard', [TransactionController::class, 'dashboard']);
    Route::get('/api/products', [ProductController::class, 'index']);
    Route::post('/api/products/store', [ProductController::class, 'store']); // Tambahkan ini
    Route::put('/api/products/{id}', [ProductController::class, 'update']);
    Route::delete('/api/products/{id}', [ProductController::class, 'destroy']);
});