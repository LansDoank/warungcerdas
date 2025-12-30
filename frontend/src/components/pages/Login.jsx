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
    <div className="min-h-screen flex items-center justify-center bg-blue-600 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">CerdasWarung</h2>
        <p className="text-center text-gray-500 mb-8">Kelola warung jadi lebih mudah</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="budi@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            MASUK
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;