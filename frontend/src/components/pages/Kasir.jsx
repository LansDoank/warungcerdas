import React, { useState, useEffect } from "react";
import axios from "axios";

const HalamanKasir = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [nominalBayar, setNominalBayar] = useState(0); 

  // Ambil data user dari LocalStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // 1. Ambil token dari localStorage
    const token = localStorage.getItem("token");

    // 2. Jika tidak ada token, arahkan ke login 
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil produk:", err);
        if (err.response?.status === 401) {
          alert("Sesi habis, silakan login ulang");
          window.location.href = "/login";
        }
      });
  }, []);

  const tambahKeKeranjang = (produk) => {
    // 1. Cek apakah stok di database sudah 0
    if (produk.stok <= 0) {
      alert(`Stok ${produk.nama_barang} habis!`);
      return;
    }

    // 2. Cek apakah barang sudah ada di keranjang
    const sudahAda = cart.find((item) => item.id === produk.id);

    if (sudahAda) {
      // 3. Cek apakah qty di keranjang sudah mencapai batas stok yang tersedia
      if (sudahAda.qty >= produk.stok) {
        alert(
          `Maaf, stok ${produk.nama_barang} hanya tersedia ${produk.stok} pcs`
        );
        return;
      }

      setCart(
        cart.map((item) =>
          item.id === produk.id ? { ...sudahAda, qty: sudahAda.qty + 1 } : item
        )
      );
    } else {
      // Jika belum ada di keranjang, masukkan sebagai barang baru
      setCart([...cart, { ...produk, qty: 1 }]);
    }
  };

  const hapusDariKeranjang = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalHarga = cart.reduce(
    (total, item) => total + item.harga_jual * item.qty,
    0
  );

  // FUNGSI PROSES BAYAR
  const prosesBayar = async () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (nominalBayar < totalHarga) return alert("Uang pembayaran kurang!");

    // 1. Ambil token
    const token = localStorage.getItem("token");

    const payload = {
      user_id: user?.id,
      total_harga: totalHarga,
      bayar: nominalBayar,
      items: cart.map((item) => ({
        product_id: item.id,
        qty: item.qty,
        harga_jual: item.harga_jual,
      })),
    };

    try {
      // 2. Tambahkan headers Authorization 
      const response = await axios.post(
        "http://127.0.0.1:8000/api/transactions/store",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Transaksi Berhasil!");

        const updatedProducts = products.map((product) => {
          const itemInCart = cart.find((item) => item.id === product.id);
          if (itemInCart) {
            return { ...product, stok: product.stok - itemInCart.qty };
          }
          return product;
        });

        setProducts(updatedProducts);
        setCart([]);
        setNominalBayar(0);
      }
    } catch (error) {
      console.error(error);
      // Cek jika errornya karena token tidak valid
      if (error.response?.status === 401) {
        alert("Sesi habis, silakan login ulang");
        window.location.href = "/login";
      } else {
        alert("Gagal memproses transaksi");
      }
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const parseAngka = (string) => {
    return parseInt(string.replace(/[^0-9]/g, "")) || 0;
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4 bg-gray-100 min-h-screen">
      {/*  DAFTAR BARANG */}
      <div className="md:w-2/3">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <input
            type="text"
            placeholder="Cari barang..."
            className="w-full p-2 border rounded"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {products
            .filter((p) =>
              p.nama_barang.toLowerCase().includes(search.toLowerCase())
            )
            .map((produk) => (
              <div
                key={produk.id}
                onClick={() => tambahKeKeranjang(produk)}
                className={`p-3 rounded-lg shadow cursor-pointer transition ${
                  produk.stok <= 0
                    ? "bg-gray-200 opacity-60 cursor-not-allowed" 
                    : "bg-white hover:bg-blue-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-bold">{produk.nama_barang}</p>
                  {produk.stok <= 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded">
                      HABIS
                    </span>
                  )}
                </div>
                <p className="text-blue-600 text-sm">
                  Rp {parseInt(produk.harga_jual).toLocaleString()}
                </p>
                <p
                  className={`text-xs ${
                    produk.stok <= 5
                      ? "text-red-500 font-bold"
                      : "text-gray-400"
                  }`}
                >
                  Stok: {produk.stok}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* KERANJANG & TOTAL */}
      <div className="md:w-1/3">
        <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Keranjang</h2>

          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center py-10 opacity-40">
                <span className="text-5xl mb-2">🛒</span>
                <p className="text-gray-500 font-medium italic">
                  Keranjang masih kosong
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div>
                    <p className="font-semibold">{item.nama_barang}</p>
                    <p className="text-gray-500">
                      {item.qty} x Rp{" "}
                      {parseInt(item.harga_jual).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => hapusDariKeranjang(item.id)}
                    className="text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg mb-2">
              <span>Total:</span>
              <span className="text-green-600">
                Rp {totalHarga.toLocaleString()}
              </span>
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-500 font-semibold uppercase">
                Uang Bayar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukkan nominal bayar..."
                  className="w-full p-3 border-2 border-blue-100 rounded-xl font-bold text-lg text-blue-700 focus:border-blue-500 outline-none transition"
                  value={nominalBayar ? formatRupiah(nominalBayar) : ""} 
                  onChange={(e) => {
                    const value = parseAngka(e.target.value);
                    setNominalBayar(value === 0 ? "" : value); 
                  }}
                />
              </div>
            </div>

            {/* INFO KEMBALIAN */}
            {nominalBayar > totalHarga && (
              <div className="flex justify-between mb-4 text-orange-600 font-bold">
                <span>Kembalian:</span>
                <span>Rp {(nominalBayar - totalHarga).toLocaleString()}</span>
              </div>
            )}

            <button
              onClick={prosesBayar}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 shadow-lg"
            >
              BAYAR SEKARANG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalamanKasir;
