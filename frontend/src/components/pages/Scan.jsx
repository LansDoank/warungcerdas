import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { useNavigate } from "react-router-dom"; // Tambahkan ini

const ScanStruk = () => {
  const navigate = useNavigate(); // Hook untuk pindah halaman
  const [loading, setLoading] = useState(false);
  const [hasilScan, setHasilScan] = useState("");
  const [gambar, setGambar] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // 1. Fungsi saat gambar dipilih
  const handlePilihGambar = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGambar(URL.createObjectURL(e.target.files[0]));
    }
  };

  // 2. Fungsi Ekstraksi (Mencari Nama & Harga dari teks berantakan)
  const ekstrakData = (teks) => {
    const baris = teks
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    // 1. Perluas daftar kata terlarang (Blacklist)
    const kataTerlarang = [
      "TOTAL",
      "SUBTOTAL",
      "TAX",
      "CASHIER",
      "KASIR",
      "TERIMAKASIH",
      "TELP",
      "SURABAYA",
      "ALAMAT",
      "JL.",
      "NO.",
      "NPWP",
      "CHECK",
      "PAJAK",
      "TUNAI",
      "BAYAR",
      "LINK",
      "KEMBALI",
      "CASH"
    ];

    let hasilRingkas = [];

    for (let i = 0; i < baris.length; i++) {
      const barisSekarang = baris[i].toUpperCase();

      // 2. Cari angka harga.
      // Kita batasi: minimal 3 digit (ratusan), maksimal 7 digit (jutaan).
      // Ini agar nomor telepon yang 10-13 digit tidak dianggap harga.
      const matchHarga = barisSekarang.match(/(?:RP|[\s])?(\d[\d.,]{2,6})$/);

      if (matchHarga) {
        const hargaRaw = matchHarga[1].replace(/[^0-9]/g, "");
        const hargaInt = parseInt(hargaRaw);

        // Filter: Harga barang warung biasanya antara 500 sampai 2.000.000
        if (hargaInt >= 500 && hargaInt <= 2000000) {
          // ... di dalam loop for setelah menemukan hargaInt ...

          let namaDitemukan = "";
          let qtyDitemukan = 1;

          // 1. Ambil baris detail (baris di antara nama dan harga)
          const detailBaris = baris[i - 1]?.toUpperCase() || "";

          // 2. LOGIKA BARU: Cari Qty yang bukan bagian dari satuan (ml, gr, dll)
          // Kita mencari angka yang berdiri sendiri, bukan yang nempel dengan 'ML' atau 'GR'
          const matchQtyCerdas = detailBaris.match(
            /^(\d+)\s+(?!ML|GR|KG|GRAM|LTR|LITER|PCS)/i
          );

          if (matchQtyCerdas) {
            qtyDitemukan = parseInt(matchQtyCerdas[1]);
          } else {
            // Jika tidak ketemu angka di depan, cek apakah ada format "1 x 7.000"
            const matchQtyCross = detailBaris.match(/^(\d+)\s*X/i);
            if (matchQtyCross) qtyDitemukan = parseInt(matchQtyCross[1]);
          }

          // 3. Cari Nama Barang (naik 1 atau 2 baris jika baris i-1 adalah detail harga)
          for (let j = i - 1; j >= Math.max(0, i - 2); j--) {
            const barisAtas = baris[j].toUpperCase();
            const isTerlarang = kataTerlarang.some((k) =>
              barisAtas.includes(k)
            );

            // Pastikan baris nama tidak mengandung "ML" atau "X" yang merupakan bagian dari detail
            if (
              !isTerlarang &&
              /[A-Z]{3,}/.test(barisAtas) &&
              !barisAtas.includes(" X ")
            ) {
              namaDitemukan = barisAtas.replace(/^\d+[.\s]*/, "").trim();
              break;
            }
          }

          if (namaDitemukan && namaDitemukan.length > 2) {
            // Hindari memasukkan baris yang isinya sama
            const isDuplicate = hasilRingkas.some(
              (item) => item.nama === namaDitemukan
            );
            if (!isDuplicate) {
              hasilRingkas.push({
                nama: namaDitemukan,
                harga: hargaInt,
                qty: qtyDitemukan,
              });
            }
          }
        }
      }
    }
    return hasilRingkas;
  };
  // 3. Fungsi untuk memproses gambar menjadi teks (OCR)
  const prosesScan = async () => {
    if (!gambar) return alert("Pilih gambar dulu!");

    setLoading(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(
        gambar,
        "ind", // Menggunakan data bahasa Indonesia
        { logger: (m) => console.log(m) }
      );
      setHasilScan(text);
    } catch (err) {
      console.error("Error Detail:", err);
      alert("Terjadi kesalahan saat membaca gambar.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Fungsi kirim data ke TambahProduk
  const tanganiGunakanData = () => {
    // Kirim semua item yang dicentang ke halaman produk
    navigate("/tambah-produk-masal", { state: { items: selectedItems } });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 mt-10">
      <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
        <span>📸</span> Scan Struk Belanja
      </h2>

      {/* Input Kamera */}
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePilihGambar}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />
      </div>

      {gambar && (
        <div className="mt-4 relative rounded-2xl overflow-hidden border-2 border-blue-50">
          <img
            src={gambar}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      <button
        onClick={prosesScan}
        disabled={loading || !gambar}
        className={`w-full mt-6 py-4 rounded-2xl font-black text-white transition-all shadow-lg ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Membaca Struk...</span>
          </div>
        ) : (
          "MULAI SCAN"
        )}
      </button>

      {hasilScan && (
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border">
          <h3 className="font-black mb-3 text-sm">
            Pilih Barang yang Ingin Ditambah:
          </h3>
          <div className="space-y-2">
            {ekstrakData(hasilScan).map((item, index) => (
              <label
                key={index}
                className="flex items-center gap-3 bg-white p-3 rounded-xl border cursor-pointer hover:bg-blue-50"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedItems([...selectedItems, item]);
                    else
                      setSelectedItems(
                        selectedItems.filter((i) => i.nama !== item.nama)
                      );
                  }}
                />
                <div className="flex-1">
                  <p className="font-bold text-sm">{item.nama}</p>
                  <p className="text-xs text-gray-400">
                    Rp {item.harga.toLocaleString()} x {item.qty}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <button
            onClick={tanganiGunakanData}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            TAMBAHKAN {selectedItems.length} BARANG TERPILIH
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanStruk;
