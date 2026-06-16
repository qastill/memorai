# Memora — Poster Peta Personal

Aplikasi web (satu file `index.html`) untuk membuat poster peta personal dari data OpenStreetMap.

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
