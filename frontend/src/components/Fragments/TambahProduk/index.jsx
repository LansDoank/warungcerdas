import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const TambahProduk = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dataDariScan = location.state?.scanData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_barang: dataDariScan?.nama || "", // Jika ada hasil scan, langsung isi
    harga_beli: dataDariScan?.harga || 0,   // Jika ada hasil scan, langsung isi
    harga_jual: "",
    stok: "",
    kategori: "",
  });

  const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    // --- HAPUS AXIOS YANG DI SINI (DILUAR TRY) ---

    try {
      // Cukup satu kali panggil di dalam blok try
      await axios.post("http://127.0.0.1:8000/api/products/store", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      alert("Produk berhasil ditambahkan!");
      navigate("/produk");
    } catch (error) {
      console.error(error);
      // Cek jika error unauthenticated (401)
      if (error.response?.status === 401) {
        alert("Sesi Anda berakhir. Silakan login kembali.");
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Gagal menambah produk");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        {/* Header Form */}
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Tambah Produk
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Lengkapi detail produk di bawah ini
          </p>
        </div>

        <form onSubmit={handleSimpan} className="space-y-5">
      {/* Nama Barang */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
          Nama Barang
        </label>
        <input
          type="text"
          required
          // TAMBAHKAN VALUE DI SINI:
          value={formData.nama_barang} 
          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          placeholder="Misal: Indomie Goreng"
          onChange={(e) =>
            setFormData({ ...formData, nama_barang: e.target.value })
          }
        />
      </div>

      {/* Harga Awal / Beli (Modal) */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
          Harga Awal (Modal)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-4 text-gray-400 text-sm font-bold">Rp</span>
          <input
            type="number"
            required
            min="0"
            // TAMBAHKAN VALUE DI SINI:
            value={formData.harga_beli}
            className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
            placeholder="0"
            onChange={(e) =>
              setFormData({ ...formData, harga_beli: e.target.value })
            }
          />
        </div>
      </div>

      {/* Harga Jual */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
          Harga Jual
        </label>
        <div className="relative">
          <span className="absolute left-4 top-4 text-gray-400 text-sm font-bold">Rp</span>
          <input
            type="number"
            required
            min="0"
            // TAMBAHKAN VALUE DI SINI:
            value={formData.harga_jual}
            className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
            placeholder="0"
            onChange={(e) =>
              setFormData({ ...formData, harga_jual: e.target.value })
            }
          />
        </div>
      </div>

      {/* Stok Awal */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
          Stok Awal
        </label>
        <input
          type="number"
          required
          min="0"
          // TAMBAHKAN VALUE DI SINI:
          value={formData.stok}
          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
          placeholder="0"
          onChange={(e) =>
            setFormData({ ...formData, stok: e.target.value })
          }
        />
      </div>
          {/* Harga Awal / Beli */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Harga Awal (Modal)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-400 text-sm font-bold">
                Rp
              </span>
              <input
                type="number"
                required
                min="0"
                className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                placeholder="0"
                onChange={(e) =>
                  setFormData({ ...formData, harga_beli: e.target.value })
                }
              />
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Kategori Produk
            </label>
            <input
              type="text"
              className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              placeholder="Makanan, Alat Tulis, dll"
              onChange={(e) =>
                setFormData({ ...formData, kategori: e.target.value })
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "SIMPAN PRODUK"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/produk")}
              className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Batal & Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahProduk;
