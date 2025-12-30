import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Ambil token dari localStorage
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/transactions/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setData(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data dashboard", error);

      if (error.response?.status === 401) {
        window.location.href = "/login";
      }

      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-6 text-center">Memuat Dashboard...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Ringkasan Bisnis
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Kotak Pendapatan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-green-500">
          <p className="text-sm text-gray-500 font-semibold uppercase">
            Pendapatan Hari Ini
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            Rp {parseInt(data?.pendapatan_hari_ini || 0).toLocaleString()}
          </h2>
        </div>

        {/* Kotak Transaksi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-500">
          <p className="text-sm text-gray-500 font-semibold uppercase">
            Total Transaksi
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            {data?.total_transaksi} Transaksi
          </h2>
        </div>

        {/* Kotak Stok Kritis */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-red-500">
          <p className="text-sm text-gray-500 font-semibold uppercase">
            Stok Menipis
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            {data?.stok_kritis?.length} Produk
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TABEL STOK KRITIS */}
        <div className="bg-red-100 p-6 rounded-2xl shadow-sm border border-red-500">
          <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center">
            Stok Perlu Ditambah (Restock)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b">
                  <th className="pb-2">Produk</th>
                  <th className="pb-2 text-right">Sisa Stok</th>
                </tr>
              </thead>
              <tbody>
                {data?.stok_kritis?.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{item.nama_barang}</td>
                    <td className="py-3 text-right text-red-600 font-bold">
                      {item.stok}
                    </td>
                  </tr>
                ))}
                {data?.stok_kritis?.length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-400">
                      Semua stok aman ✅
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRODUK TERLARIS */}
        <div className="bg-blue-100 p-6 rounded-2xl shadow-sm border border-blue-500">
          <h3 className="text-lg font-bold mb-4 text-blue-600 flex items-center">
            Produk Terlaris (Minggu Ini)
          </h3>
          <div className="space-y-4">
            {data?.terlaris?.map((item, index) => (
              <div
                key={index}
                className="flex border justify-between items-center bg-gray-50 p-3 rounded"
              >
                <span className="font-semibold text-gray-700">
                  {item.nama_barang}
                </span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                  {item.total_terjual} Terjual
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
