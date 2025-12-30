<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('kode_barang')->nullable();
            $table->string('nama_barang');
            $table->decimal('harga_beli', 12, 2)->nullable();
            $table->decimal('harga_jual', 12, 2);
            $table->integer('stok');
            $table->string('satuan')->default('pcs'); 
            $table->string('kategori')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
