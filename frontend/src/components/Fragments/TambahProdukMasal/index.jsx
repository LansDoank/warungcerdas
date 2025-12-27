import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TambahProdukMasal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State utama untuk menampung array barang
  const [items, setItems] = useState(location.state?.items || []);
  const [loading, setLoading] = useState(false);

  // 1. Fungsi untuk mengupdate field tertentu (nama, harga, atau qty)
  const handleEdit = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // 2. Fungsi untuk menghapus baris yang tidak diinginkan (data sampah)
  const handleHapus = (index) => {
    const filteredItems = items.filter((_, i) => i !== index);
    setItems(filteredItems);
  };

  const handleSimpanSemua = async () => {
    if (items.length === 0) return alert("Tidak ada data untuk disimpan.");
    
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const promises = items.map((item) =>
        axios.post("http://127.0.0.1:8000/api/products/store", {
          nama_barang: item.nama,
          harga_beli: parseInt(item.harga),
          harga_jual: parseInt(item.harga) * 1.2, // Markup otomatis 20%
          stok: parseInt(item.qty),
          kategori: "Hasil Scan",
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(promises);
      alert("Semua barang berhasil diproses ke gudang!");
      navigate("/produk");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan beberapa data. Pastikan koneksi stabil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Konfirmasi Data Scan</h2>
          <p className="text-gray-500 text-sm font-medium">Silakan periksa atau edit data jika ada yang keliru</p>
        </div>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">
          {items.length} Barang Terdeteksi
        </span>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Nama Barang</th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest w-32">Harga Beli (Rp)</th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest w-24">Qty</th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest w-16 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors">
                  <td className="p-3">
                    <input
                      type="text"
                      value={item.nama}
                      onChange={(e) => handleEdit(index, "nama", e.target.value)}
                      className="w-full p-2 bg-transparent border border-transparent focus:border-blue-300 focus:bg-white rounded-lg font-bold text-gray-700 outline-none transition-all"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.harga}
                      onChange={(e) => handleEdit(index, "harga", e.target.value)}
                      className="w-full p-2 bg-transparent border border-transparent focus:border-blue-300 focus:bg-white rounded-lg font-bold text-green-600 outline-none transition-all"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleEdit(index, "qty", e.target.value)}
                      className="w-full p-2 bg-transparent border border-transparent focus:border-blue-300 focus:bg-white rounded-lg font-bold text-blue-600 outline-none transition-all text-center"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleHapus(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Hapus baris"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            <p>Tidak ada data. Silakan scan ulang struk Anda.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSimpanSemua}
          disabled={loading || items.length === 0}
          className={`flex-1 py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
          }`}
        >
          {loading ? "MEMPROSES..." : `KONFIRMASI & SIMPAN KE GUDANG`}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default TambahProdukMasal;