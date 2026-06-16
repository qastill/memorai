-- Tabel order pembayaran Memora.
-- Jalankan di Supabase project pilihanmu: Dashboard > SQL Editor > paste > Run.

create table if not exists public.orders (
  id          uuid primary key,           -- orderId yang dibuat /api/create-payment
  mayar_id    text,                        -- id transaksi dari Mayar
  status      text not null default 'pending',  -- 'pending' | 'paid'
  amount      integer not null default 0,
  email       text,
  created_at  timestamptz not null default now(),
  paid_at     timestamptz
);

create index if not exists orders_mayar_id_idx on public.orders (mayar_id);

-- Tabel diakses HANYA dari server (Serverless Functions) memakai service_role key,
-- yang bypass RLS. Aktifkan RLS tanpa policy publik supaya tak bisa diakses dari client.
alter table public.orders enable row level security;
