<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            WarungSeeder::class,
        ]);


        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'nama_warung' => 'Warung Contoh', 
        ]);
    }
}
