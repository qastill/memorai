# Memora — Poster Peta Personal

Aplikasi web (satu file `index.html`) untuk membuat poster peta personal dari data OpenStreetMap.

## Katalog kota Indonesia (preview + edit) — `katalog.html`

Halaman katalog bergaya "platform poster": **101 kota se-Indonesia tersusun per pulau**
(Sumatra, Jawa, Bali & Nusa Tenggara, Kalimantan, Sulawesi, Maluku, Papua), dengan **pencarian** dan **filter per pulau**.

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
