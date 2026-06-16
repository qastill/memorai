// POST /api/webhook  — dipanggil otomatis oleh Mayar saat status pembayaran berubah.
// Set URL ini di dashboard Mayar (Settings > Webhook) dan samakan token-nya
// dengan env MAYAR_WEBHOOK_TOKEN.

const { readJson, sb, cors } = require('./_lib');

const PAID = ['SUCCESS', 'PAID', 'SETTLED', 'COMPLETE', 'COMPLETED', 'ACTIVE'];
const UUID_RE = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  try {
    // Verifikasi token rahasia (shared secret). Set token yang sama di dashboard Mayar.
    const headerToken =
      req.headers['x-callback-token'] ||
      req.headers['x-mayar-token'] ||
      String(req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
    if (process.env.MAYAR_WEBHOOK_TOKEN && headerToken !== process.env.MAYAR_WEBHOOK_TOKEN) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const body = await readJson(req);
    const event = String(body.event || body.type || '').toLowerCase();
    const data = body.data || body;

    // Mayar mengirim event "testing" saat tombol Test di dashboard ditekan.
    if (event === 'testing') { res.status(200).json({ ok: true, test: true }); return; }

    const status = String(data.status || '').toUpperCase();
    const isPaid = PAID.includes(status) || /(received|success|paid|settle)/i.test(event);
    if (!isPaid) { res.status(200).json({ ok: true, ignored: true, event, status }); return; }

    // Cocokkan order: utamakan orderId yang kita selipkan di description, fallback ke mayar_id.
    const mayarId = data.id || data.transactionId || data.transaction_id;
    const desc = String(data.description || data.note || '');
    const m = UUID_RE.exec(desc);
    const filter = m ? `id=eq.${m[1]}` : (mayarId ? `mayar_id=eq.${encodeURIComponent(mayarId)}` : null);
    if (!filter) { res.status(200).json({ ok: true, unmatched: true }); return; }

    await sb(`orders?${filter}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'paid', paid_at: new Date().toISOString() }),
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
