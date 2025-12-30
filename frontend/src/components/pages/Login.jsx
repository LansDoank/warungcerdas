import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password
      });

      // Simpan Token di LocalStorage agar tidak hilang saat refresh
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert("Selamat Datang, " + response.data.user.nama_warung);
      window.location.href = "/dashboard"; 
    } catch (error) {
      alert("Login Gagal: " + error.response.data.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 px-4">
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-blue-700 tracking-tight">CerdasWarung</h2>
        <p className="text-gray-500 mt-2 font-medium">Kelola warung jadi lebih mudah</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 ml-1">Email</label>
          <input 
            type="email" 
            className="w-full mt-1.5 p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="budi@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex justify-between ml-1">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
          </div>
          <input 
            type="password" 
            className="w-full mt-1.5 p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all uppercase tracking-wider text-sm"
        >
          Masuk ke Akun
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Belum punya akun? 
          <a href="/register" className="text-blue-600 font-bold hover:underline ml-1">Daftar Sekarang</a>
        </p>
      </div>
    </div>
  </div>
);
};

export default LoginPage;