import React, { useState, useEffect } from "react";
import axios from "axios";

const RiwayatTransaksi = () => {
  // ... (state dan useEffect tetap sama) ...
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    try {
      // 1. Ambil token dari localStorage
      const token = localStorage.getItem("token");

      // 2. Tambahkan headers Authorization
      const response = await axios.get("http://127.0.0.1:8000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setTransactions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil riwayat", error);
      // 3. Handle jika token tidak valid/habis
      if (error.response?.status === 401) {
        alert("Sesi habis, silakan login ulang");
        window.location.href = "/login";
      }
      setLoading(false);
    }
  };

  const handlePrint = (trx) => {
    const printContent = document.getElementById(`struk-${trx.id}`).innerHTML;
    const originalContent = document.body.innerHTML;

    // Tambahkan pembungkus class 'printing-mode' agar CSS print aktif
    document.body.innerHTML = `<div class="printing-mode">${printContent}</div>`;
    
    window.print();
    window.location.reload();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* CSS KHUSUS UNTUK MENGATUR UKURAN PRINT */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printing-mode, .printing-mode * {
              visibility: visible;
            }
            .printing-mode {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%; /* Memaksa menggunakan lebar kertas maksimal */
            }
            @page {
              margin: 0; /* Menghilangkan header/footer bawaan browser (tanggal/judul) */
              size: 80mm auto; /* Menentukan ukuran lebar kertas kasir */
            }
          }
        `}
      </style>

      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className="grid gap-4">
          {transactions.map((trx) => (
            <div key={trx.id} className="bg-white p-4 rounded-xl shadow-sm border">
              {/* ... (Tampilan Card Riwayat Tetap Sama) ... */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-bold text-blue-600">{trx.invoice_number}</p>
                  <p className="text-xs text-gray-400">{new Date(trx.created_at).toLocaleString("id-ID")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">Rp {parseInt(trx.total_harga).toLocaleString()}</p>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">{trx.status_pembayaran}</span>
                </div>
              </div>

              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-semibold text-gray-500 mb-1">Item:</p>
                <ul className="text-sm text-gray-600">
                  {trx.details.map((detail) => (
                    <li key={detail.id} className="flex justify-between">
                      <span>{detail.product?.nama_barang} (x{detail.qty})</span>
                      <span>Rp {parseInt(detail.subtotal).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handlePrint(trx)}
                  className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-black transition"
                >
                  Cetak Struk 🖨️
                </button>
              </div>

              {/* AREA STRUK: Sudah disesuaikan agar pas di kertas 80mm */}
              <div id={`struk-${trx.id}`} className="hidden">
                <div style={{
                  width: "72mm", // Sisakan sedikit margin agar tidak terpotong printer
                  padding: "5px",
                  fontFamily: "'Courier New', Courier, monospace", // Font khas struk
                  fontSize: "14px", // Ukuran font diperbesar agar jelas
                  lineHeight: "1.2"
                }}>
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <h2 style={{ margin: "0", fontSize: "18px" }}>WARUNG DIGITAL</h2>
                    <p style={{ fontSize: "11px", margin: "0" }}>Jl. Raya IT No. 101, Indonesia</p>
                    <p style={{ margin: "5px 0" }}>================================</p>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <p style={{ margin: "0" }}>No  : {trx.invoice_number}</p>
                    <p style={{ margin: "0" }}>Tgl : {new Date(trx.created_at).toLocaleString("id-ID")}</p>
                    <p style={{ margin: "0" }}>Ksr : {user?.name || "Staff"}</p>
                    <p style={{ margin: "5px 0" }}>--------------------------------</p>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    {trx.details.map((item, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ textTransform: "uppercase" }}>{item.product?.nama_barang}</div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{item.qty} x {parseInt(item.harga_satuan).toLocaleString()}</span>
                          <span>{parseInt(item.subtotal).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px dashed #000", paddingTop: "5px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>TOTAL</span>
                      <span>Rp {parseInt(trx.total_harga).toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>BAYAR</span>
                      <span>Rp {parseInt(trx.bayar).toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>KEMBALI</span>
                      <span>Rp {parseInt(trx.kembali).toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", marginTop: "15px", fontSize: "11px" }}>
                    <p style={{ margin: "0" }}>-- Terima Kasih --</p>
                    <p style={{ margin: "0" }}>Barang yang sudah dibeli</p>
                    <p style={{ margin: "0" }}>tidak dapat ditukar/dikembalikan</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiwayatTransaksi;