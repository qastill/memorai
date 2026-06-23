# Memora — Poster Peta Personal

Aplikasi web (satu file `index.html`) untuk membuat poster peta personal dari data OpenStreetMap.

## Dua tata letak: Klasik & Bingkai Galeri (siap jual)

Di blok **Desain** ada pilihan **Tata letak poster**:

- **Klasik** — judul & subjudul ditumpuk di atas peta (full-bleed) dengan gradasi halus. Cocok untuk poster personal/momen.
- **Bingkai galeri** — gaya **produk digital marketplace** (mis. poster peta minimalis hitam-putih): peta menempati bidang atas, **nama kota** tampil besar di **area bersih** bawah, **subjudul negara/wilayah** dengan spasi huruf lebar, plus **garis bingkai ganda** tipis di tepi. Pakai tema **Monokrom** untuk tampilan hitam-putih klasik seperti contoh marketplace.

### Format unduhan
Di blok **Font & Ukuran** ada **Format unduhan**:

- **JPG HD** (default) — ukuran file kecil, ideal sebagai produk digital yang dijual/diunduh pembeli.
- **PNG** — tepi paling tajam, latar bisa solid.
- **JPG + PNG** — unduh keduanya sekaligus (satu klik, dua berkas).

Semua ukuran tetap resolusi tinggi (≈A3 300 DPI) dan **tanpa watermark** pada hasil unduhan.

> **Kota seluruh dunia:** kotak **pencarian** memakai OpenStreetMap (Nominatim) tanpa batas negara — cari kota mana pun di dunia, atur bingkai/zoom, pilih *Bingkai galeri* + *JPG HD*, lalu unduh. Untuk produksi massal banyak kota sekaligus, lihat catatan di bawah (`batch.html` dapat diperluas ke daftar kota dunia).

## Katalog kota Indonesia (preview + edit) — `katalog.html`

Halaman katalog bergaya "platform poster": **seluruh 514 kabupaten & kota se-Indonesia**, dijelajah **berjenjang**
**Indonesia → Pulau → Provinsi → Kab/Kota** (breadcrumb), atau lewat **pencarian** langsung.
Tiap nama berlabel **Kab./Kota** secara konsisten; titik peta memakai **koordinat ibu kota** tiap wilayah
(sumber: Kepmendagri 2025 via dataset `cahyadsn/wilayah`, lat/long Google Maps).
Tiap kartu menampilkan **thumbnail peta asli** (bangunan/rel/taman terlihat) dengan **tema warna berbeda-beda** untuk memberi gambaran ragam desain — dirender lazy + cache. Saat kota diklik, editor terbuka dengan tema kartu tersebut.

Klik kartu kota → terbuka **editor pratinjau langsung**: ganti **tema/warna** (latar, jalan, air, taman, teks), atur **zoom**,
ubah **judul/subjudul**, lalu **Unduh A3 HD** (3508 × 4961 px, 300 DPI) tanpa watermark.
Kota di luar katalog bisa dicari lewat OpenStreetMap (Nominatim) langsung dari kotak pencarian.

Butuh internet yang tidak memblokir `tiles.openfreemap.org`. Bisa dibuka lokal atau dari situs yang dideploy (`/katalog.html`).

## Batch ibu kota Indonesia (A3 HD) — `batch.html`

`batch.html` membuat poster ke-38 ibu kota provinsi Indonesia sekaligus dalam ukuran **A3 HD (3508 × 4961 px, 300 DPI)**,
tema **Klasik Emas** (navy/gold), **tanpa watermark**. Render memakai style & logika ekspor yang sama dengan `index.html`.

Cara pakai:
1. Buka `batch.html` di browser biasa (Chrome/Firefox) — **butuh internet** yang tidak memblokir `tiles.openfreemap.org`.
   Bisa juga diakses dari situs yang sudah dideploy (`/batch.html`).
2. Klik **Mulai render semua (38 kota)**. Tiap PNG otomatis terunduh (bisa dimatikan), dan tersedia thumbnail per kota.
3. Klik **Unduh ZIP** untuk mengambil semua poster dalam satu arsip `ibukota-indonesia-a3-hd.zip`.

Opsi: centang **"© OpenStreetMap"** bila ingin mencantumkan kredit di poster (disarankan secara lisensi ODbL untuk publikasi).

> Catatan: render tidak bisa dijalankan di lingkungan yang memblokir server tile peta. Jalankan di browser dengan koneksi internet normal.

## Pembayaran otomatis (Mayar.id)

Pembeli bayar → Mayar kirim webhook → tombol unduh terbuka otomatis (mode "kunci tombol").
Komponen: Vercel Serverless Functions di `api/` + tabel order di Supabase.

### Alur
1. Klik **Unduh Poster** → modal → **Bayar Otomatis** memanggil `POST /api/create-payment`.
2. Backend membuat transaksi di Mayar, menyimpan order `pending` di Supabase, lalu mengarahkan ke halaman bayar Mayar.
3. Pembeli bayar (QRIS / e-wallet / VA). Mayar memanggil `POST /api/webhook` → order ditandai `paid`.
4. Pembeli kembali ke situs (`?order=...`) → frontend polling `GET /api/status` → begitu `paid`, poster otomatis ter-unduh.

### Setup
1. **Supabase**: buat tabel order — jalankan `supabase/schema.sql` di SQL Editor project pilihanmu.
2. **Mayar**: ambil API key di <https://web.mayar.id/api-keys>. Di dashboard Mayar, set **Webhook URL** ke `https://DOMAINMU/api/webhook` dan catat/atur token-nya.
3. **Environment Variables di Vercel** (Project Settings → Environment Variables):

   | Nama | Isi |
   |---|---|
   | `MAYAR_API_KEY` | API key Mayar (production) |
   | `MAYAR_WEBHOOK_TOKEN` | token webhook (samakan dengan setting di dashboard Mayar) |
   | `SUPABASE_URL` | `https://<ref>.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | service_role key Supabase (rahasia — hanya server) |
   | `PRICE_IDR` | harga, mis. `29000` (opsional, default 29000) |
   | `MAYAR_BASE_URL` | opsional; `https://api.mayar.club/hl/v1` untuk sandbox |

4. Deploy. Coba: klik **Bayar Otomatis**, selesaikan pembayaran, unduhan terbuka sendiri saat kembali.

### Catatan keamanan
Mode ini mengunci **tombol** unduh. Poster tetap dirender di browser, jadi pengguna teknis secara teori masih bisa mengambil file lewat devtools. Untuk penguncian penuh, render final perlu dipindah ke server (file bersih dibuat setelah pembayaran terverifikasi).
