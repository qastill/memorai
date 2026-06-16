// Helper bersama untuk endpoint pembayaran Memora (Vercel Serverless Functions).
// Tidak butuh dependency npm — pakai fetch bawaan Node 18+ di Vercel.

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY; // service role key (rahasia, hanya di server)

// Baca JSON dari request (Vercel Node runtime tidak selalu otomatis mem-parse body).
async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? safeParse(req.body) : req.body;
  }
  return await new Promise((resolve) => {
    let d = '';
    req.on('data', (c) => (d += c));
    req.on('end', () => resolve(safeParse(d)));
    req.on('error', () => resolve({}));
  });
}
function safeParse(s) { try { return s ? JSON.parse(s) : {}; } catch { return {}; } }

// Panggil Supabase REST (PostgREST).
async function sb(path, opts = {}) {
  if (!SB_URL || !SB_KEY) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_KEY belum di-set');
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`supabase ${r.status}: ${await r.text()}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = { readJson, sb, cors, SB_URL, SB_KEY };
