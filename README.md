 🏪 WarungCerdas - Sistem Pengurusan Warung Digital

WarungCerdas adalah aplikasi Point of Sales (POS) berdasarkan web yang dirancang untuk membantu pemilik warung tradisional menguruskan stok barang, mencatat transaksi, dan memantau keuntungan secara digital dan efisien.

---

 🚀 Ciri-Ciri Utama
- Dashboard Pintar: Ringkasan transaksi dan statistik produk secara real-time.
- Sistem Kasir: Input transaksi yang sesuai dengan penghitungan otomatis.
- Pengurusan Stok: Pantau stok dan notifikasi untuk stok yang hampir habis.
- Autentikasi : Menggunakan Laravel Sanctum dengan sistem Token Bearer.
- Antarmuka Modern: Menggunakan React.js dan Tailwind CSS yang responsif.

---

 🛠️ Teknologi yang Digunakan

 Backend (API)
- Framework: Laravel 11/12
- Database: MySQL
- Security: Laravel Sanctum (Token Based Authentication)

 Frontend (Client)
- Library: React.js (Vite)
- Styling: Tailwind CSS
- State Management: Axios (untuk API calls)

---

 📦 Cara Pemasangan (Installation)

Ikuti langkah-langkah di bawah untuk menjalankan projek ini di komputer anda:

Persiapan Backend (Terminal):
1. Masuk ke folder backend: "cd backend"
2. Pasang dependencies: "composer install"
3. Salin file .env: "cp .env.example .env"
4. Application Key: "php artisan key:generate"
5. Jalankan migrasi dan seeding: "php artisan migrate --seed"
6. Jalankan server backend: "php artisan serve"

Persiapan FrontEnd (Terminal):
1. Masuk ke folder frontend: "cd frontend"
2. Pasang dependencies: "npm install"
3. Jalankan server frontend: "npm run dev"

🔑 Penggunaan
1. Masuk ke url http://localhost:5173 pada web browser anda.
2. Daftar akun baru melalui halaman Register di route /register.
3. Log masuk ke dalam sistem.

   Aplikasi siap dipakai
