# Ide & Analisis — Menjual Poster Peta sebagai Produk Digital

Dokumen ini merangkum strategi menjual poster peta (gaya "bingkai galeri" / modern map print)
sebagai **digital download** di e-commerce, lengkap dengan catatan teknis, lisensi, dan rencana lanjutan.

---

## 1. Apa yang sudah bisa dilakukan sekarang

Setelah update ini, di **editor** (`index.html`) kamu bisa:

1. **Cari kota mana pun di dunia** lewat kotak pencarian (OpenStreetMap/Nominatim — tanpa batas negara).
2. Pilih tema **Monokrom** (hitam-putih klasik) atau tema lain.
3. Aktifkan **Tata letak → Bingkai galeri** → output langsung bergaya poster marketplace
   (peta di atas, nama kota di area bersih bawah, garis bingkai ganda).
4. Pilih **Format unduhan → JPG HD** (atau PNG, atau keduanya).
5. **Unduh** file resolusi tinggi (≈A3, 300 DPI), tanpa watermark.

Artinya alur "satu kota → satu produk" **sudah jalan end-to-end**. Untuk ribuan kota, lihat bagian Roadmap.

---

## 2. Catatan lisensi (PENTING sebelum jual)

- Peta dibuat dari **OpenStreetMap** (ODbL) di-render lewat **OpenFreeMap**. Data OSM **boleh** dipakai komersial,
  tapi **wajib atribusi** "© OpenStreetMap contributors". Aktifkan opsi kredit **© OpenStreetMap** di poster,
  atau cantumkan di deskripsi produk + halaman lisensi toko.
- Yang kamu jual adalah **karya turunan (kartografi/desain)**, bukan data mentahnya — ini diperbolehkan ODbL
  selama atribusi terpenuhi.
- **Hindari** menjual sebagai "peta resmi/akurat untuk navigasi". Posisikan sebagai **wall art / dekorasi**.
- Cek aturan tiap marketplace soal produk yang di-generate massal (lihat bagian 5).

---

## 3. Spesifikasi produk yang disarankan

| Aspek | Rekomendasi |
|---|---|
| Rasio | 2:3 (paling laku untuk frame standar) + sediakan **Seri A** (A4/A3) |
| Resolusi | ≥ 300 DPI; sisi panjang ≥ 4500 px |
| Format jual | **JPG HD** (utama) + **PDF** siap cetak (opsional, nilai tambah) |
| Ukuran cetak | 8×10, 12×16, 16×20, 18×24, 24×36 inci (sebut "printable up to 24×36") |
| Isi paket | 4–5 rasio/ukuran dalam 1 ZIP, + 1 lembar "cara cetak" |
| Watermark | Hanya di **gambar preview**, JANGAN di file final pembeli |

> Tips: buat **bundle** (mis. "10 kota favorit") dan **custom order** ("kota request") — margin paling tinggi.

---

## 4. Strategi harga & posisi

- **Single city digital download**: setara contoh pasar (≈ Rp 30k–90k; banyak yang pasang "coret" diskon 30–40%).
- **Bundle (5–25 kota)**: harga naik, biaya produksi ~0 → margin besar.
- **Custom request** (kota + koordinat + teks personal, mis. anniversary): premium, ini pembeda utama vs template massal.
- **Print-on-demand** (opsional): sambungkan ke Printful/Printify/Gelato → jual versi tercetak + dikirim, tanpa stok.

Diferensiasi: **personali­sasi** (judul, subjudul, koordinat, titik "tempat kita bertemu") — fitur ini sudah ada di editor
dan susah ditiru toko template biasa.

---

## 5. Saluran penjualan

1. **Etsy** — pasar terbesar untuk "map print / digital download". Perhatikan: Etsy makin ketat soal listing
   yang murni hasil generator massal; menangkan dengan **mockup bagus + personalisasi + deskripsi kuat**.
2. **Creative Market / Gumroad / Lemon Squeezy / Payhip** — cocok untuk bundle & file digital, fee lebih rendah.
3. **Marketplace lokal (Tokopedia/Shopee/Lynk/Mayar)** — kamu sudah punya integrasi **Mayar.id** (auto-unlock
   setelah bayar) di repo ini; pas untuk jual langsung dari situs sendiri.
4. **Toko sendiri (Vercel)** — paling untung (tanpa fee marketplace); andalkan SEO + sosial media.

---

## 6. Pembeda yang bisa diandalkan (moat)

- **Personalisasi instan** (editor live) — bukan sekadar PNG statis.
- **Konsistensi gaya** lewat tema & preset → brand visual yang dikenali.
- **Kecepatan**: bisa terbitkan ratusan kota cepat (begitu batch dunia jadi — lihat Roadmap).
- **Multi-format & multi-rasio** dalam satu paket → nilai lebih tinggi di mata pembeli.

---

## 7. Roadmap teknis yang disarankan (urut prioritas)

1. **[SUDAH] Layout "Bingkai galeri" + ekspor JPG/PNG** — selesai di update ini.
2. **Batch dunia** — perluas `batch.html` agar menerima **daftar kota dunia** (mis. dari `cities500`/GeoNames atau
   daftar 1.000 kota terbesar) dan merender otomatis ke ZIP dengan layout bingkai + JPG. Ini kunci produksi massal.
3. **Multi-rasio sekali render** — untuk tiap kota, otomatis keluarkan 2:3, 3:4, A-series, 1:1 sekaligus (paket jual).
4. **Generator mockup** — tempel poster ke template ruangan/figura (seperti contoh marketplace) secara otomatis,
   supaya listing menarik tanpa kerja manual di Photoshop.
5. **Pustaka preset tema "Best-seller"** — kurasi 5–8 gaya yang paling laku (monokrom, blueprint, krem, dll).
6. **Halaman lisensi & atribusi** otomatis disertakan dalam tiap paket unduhan (kepatuhan ODbL).
7. **(Opsional) Render server-side** — untuk penguncian penuh file final setelah pembayaran (lihat README bagian keamanan).

---

## 8. Risiko & mitigasi

| Risiko | Mitigasi |
|---|---|
| Tile/data OSM tidak akurat di kota kecil | Sediakan preview dulu; izinkan geser/zoom manual sebelum jual |
| Marketplace menolak listing generator massal | Tambah personalisasi & mockup unik; diversifikasi ke toko sendiri |
| Kewajiban atribusi ODbL terlewat | Sertakan kredit di file/paket + halaman lisensi |
| Pembeli berbagi file | Jual murah-volume + andalkan custom order; watermark hanya di preview |
| Ketergantungan 1 server tile | Siapkan style/source cadangan; cache hasil render |

---

## 9. Langkah cepat untuk mulai jualan minggu ini

1. Render **20–30 kota populer** (ibu kota dunia + kota wisata) → layout *Bingkai galeri*, tema *Monokrom*, *JPG HD*.
2. Buat **mockup** sederhana (figura putih) untuk tiap listing.
3. Tulis judul + deskripsi SEO (mis. "Istanbul Map Print, Türkiye Wall Art, Printable Digital Download").
4. Pasang di **1 marketplace** (Etsy/Gumroad) + **toko sendiri** (Mayar untuk pembayaran).
5. Uji harga (single vs bundle), kumpulkan review, lalu skalakan dengan **batch dunia** (Roadmap #2).
