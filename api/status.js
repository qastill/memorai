// GET /api/status?order=<orderId>  — dipakai frontend untuk polling status order.
// Mengembalikan { orderId, status, paid }.

const { cors, SB_URL, SB_KEY } = require('./_lib');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  try {
    const orderId =
      (req.query && req.query.order) ||
      new URL(req.url, 'http://x').searchParams.get('order');
    if (!orderId) { res.status(400).json({ error: 'order required' }); return; }
    if (!SB_URL || !SB_KEY) { res.status(500).json({ error: 'Supabase belum di-set' }); return; }

    const r = await fetch(
      `${SB_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=status`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    );
    const rows = await r.json();
    const status = (Array.isArray(rows) && rows[0] && rows[0].status) || 'unknown';
    res.status(200).json({ orderId, status, paid: status === 'paid' });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
