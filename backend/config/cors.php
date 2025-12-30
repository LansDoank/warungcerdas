<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // config/cors.php
    'paths' => [
        'api/*',             // Mencakup semua rute yang diawali api/
        'login',             // Jika rutenya cuma /login
        'sanctum/csrf-cookie'
    ],

    'allowed_origins' => ['http://localhost:5173'], // Pastikan ini port React Anda
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true, // WAJIB TRUE

];
