<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Login Gagal'], 401);
        }

        // Buat token 
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function register(Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'nama_warung' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:1|confirmed',
    ]);

    $user = User::create([
        'name' => $request->name,
        'nama_warung' => $request->nama_warung,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    // Langsung buatkan token agar user langsung login
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'Registrasi Berhasil!',
        'token' => $token,
        'user' => $user
    ], 201);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout']);
    }
}