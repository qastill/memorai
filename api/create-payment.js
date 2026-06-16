// POST /api/create-payment
// Membuat transaksi pembayaran di Mayar, menyimpan order di Supabase, lalu
// mengembalikan { orderId, paymentUrl } untuk diarahkan ke halaman bayar Mayar.

const { readJson, sb, cors } = require('./_lib');
const crypto = require('crypto');

const MAYAR_BASE = process.env.MAYAR_BASE_URL || 'https://api.mayar.id/hl/v1';

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'method not allowed' }); return; }

  try {
    if (!process.env.MAYAR_API_KEY) { res.status(500).json({ error: 'MAYAR_API_KEY belum di-set' }); return; }

    const body = await readJson(req);
    const amount = parseInt(process.env.PRICE_IDR || '29000', 10);
    const email = String(body.email || '').trim() || 'guest@memora.app';
    const name = String(body.name || 'Pelanggan Memora').trim();
    const mobile = String(body.mobile || '08000000000').trim();

    const orderId = crypto.randomUUID();
    const origin = req.headers.origin || ('https://' + (req.headers.host || ''));
    const redirectUrl = `${origin}/?order=${orderId}`;

    // Mayar: buat single payment (nominal tetap).
    const mr = await fetch(`${MAYAR_BASE}/payment/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.MAYAR_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, mobile, amount,
        redirectUrl,
        description: `Poster Memora | ${orderId}`,
      }),
    });
    const mj = await mr.json().catch(() => ({}));
    if (!mr.ok) { res.status(502).json({ error: 'mayar_error', detail: mj }); return; }

    const data = mj.data || mj;
    const paymentUrl = data.link || data.url || data.paymentUrl || data.payment_url;
    const mayarId = data.id || data.transactionId || data.transaction_id || null;
    if (!paymentUrl) { res.status(502).json({ error: 'no_payment_url', detail: mj }); return; }

    await sb('orders', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ id: orderId, mayar_id: mayarId, status: 'pending', amount, email }),
    });

    res.status(200).json({ orderId, paymentUrl });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
