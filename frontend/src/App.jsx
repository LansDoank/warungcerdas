import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  

  const ambilData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      if (error.response?.status === 401) window.location.href = "/login";
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilData();
  }, []);

  // Filter dipindahkan ke variabel agar lebih bersih
  const produkDifilter = products.filter((p) =>
    p.nama_barang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* HEADER STICKY: Agar navigasi tetap terlihat saat scroll */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b mb-6">
        <div className="max-w-7xl mx-auto p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Stok Warung <span className="text-blue-600">🏪</span>
          </h1>
          <Link
            to="/tambah-produk"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex justify-center items-center"
          >
            <span className="mr-2 text-xl">+</span> Tambah Barang
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* INPUT PENCARIAN DENGAN ICON */}
        <div className="relative mb-8">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari nama barang di gudang..."
            className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* GRID: 1 kolom di HP, 2 di Tablet, 3 di Laptop, 4 di Layar Besar */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produkDifilter.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="max-w-[70%]">
                    <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-1">
                      {item.kategori || "Umum"}
                    </p>
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {item.nama_barang}
                    </h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm ${
                    item.stok < 5 
                      ? "bg-red-50 text-red-600 border border-red-100 animate-pulse" 
                      : "bg-green-50 text-green-600 border border-green-100"
                  }`}>
                    Stok: {item.stok}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-dashed flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Harga Jual</p>
                    <p className="text-xl font-black text-gray-900">
                      Rp {parseInt(item.harga_jual).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button className="bg-gray-900 group-hover:bg-blue-600 text-white p-2.5 rounded-xl transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && produkDifilter.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-dashed border-gray-300">
            <span className="text-6xl block mb-4">📦</span>
            <h3 className="text-lg font-bold text-gray-800">Barang tidak ditemukan</h3>
            <p className="text-gray-500">Coba gunakan kata kunci lain atau tambah produk baru.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;