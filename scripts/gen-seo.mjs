/* Generator SEO programmatic: 514 halaman kota + provinsi + sitemap + robots.
   Sumber data: DATA di katalog.html. Jalankan: node scripts/gen-seo.mjs
   Ganti SITE ke domainmu sendiri lalu jalankan ulang. */
import fs from 'node:fs';
import path from 'node:path';

// >>> GANTI ke domain final kamu (mis. 'https://memora.id') lalu regenerate <<<
const SITE = process.env.SITE_URL || 'https://memorai-two.vercel.app';
const PRICE = 29000;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

/* ---- ambil DATA kota dari katalog.html ---- */
const katalog = fs.readFileSync(path.join(ROOT, 'katalog.html'), 'utf8');
const m = katalog.match(/const DATA\s*=\s*(\{[\s\S]*?\n\s*\});/);
if (!m) throw new Error('DATA tidak ditemukan di katalog.html');
const DATA = new Function('return ' + m[1])();

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slugify = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const displayName = n => n.replace(/^(Kota|Kab\.)\s+/i,'').trim();
const rupiah = n => 'Rp ' + n.toLocaleString('id-ID');

/* ---- ratakan jadi daftar kota ---- */
const cities = [];
for (const island of Object.keys(DATA)) {
  for (const [name, prov, lat, lng] of DATA[island]) {
    cities.push({ name, prov, island, lat: +lat, lng: +lng, disp: displayName(name) });
  }
}
// slug unik
const used = new Set();
for (const c of cities) {
  let s = slugify(c.disp);
  if (used.has(s)) s = slugify(c.disp + '-' + c.prov);
  while (used.has(s)) s += '-x';
  used.add(s); c.slug = s;
}
// kelompokkan per provinsi
const byProv = {};
for (const c of cities) (byProv[c.prov] ||= []).push(c);
const provs = Object.keys(byProv).sort((a,b)=>a.localeCompare(b,'id'));
const provSlug = {}; provs.forEach(p => provSlug[p] = slugify(p));

const CSS = `/* halaman SEO Memora */
*{box-sizing:border-box}body{margin:0;font-family:'Outfit',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#22201a;background:#f5f3ee;line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:#a9791a;text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:880px;margin:0 auto;padding:0 20px}
header.top{background:#fff;border-bottom:1px solid #e9e6dd}
header.top .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{font-weight:800;letter-spacing:-.02em;font-size:18px;display:flex;align-items:center;gap:9px;color:#1e1d18}
.brand .dot{width:8px;height:8px;border-radius:50%;background:#e8b339;display:inline-block}
nav.menu a{font-size:13.5px;font-weight:600;color:#4a4740;margin-left:18px}
.crumb{font-size:12.5px;color:#8b887d;padding:16px 0 0}
.crumb a{color:#8b887d}
h1{font-size:30px;line-height:1.15;letter-spacing:-.02em;margin:10px 0 6px}
.lede{font-size:16px;color:#46443c;margin:0 0 18px}
.hero{display:grid;grid-template-columns:1fr;gap:18px;margin:18px 0 26px}
.cta{display:inline-block;background:#e8b339;color:#3a2a05;font-weight:700;padding:13px 22px;border-radius:11px;font-size:15px}
.cta:hover{filter:brightness(1.04);text-decoration:none}
.specs{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:8px 0 22px}
.specs div{background:#fff;border:1px solid #e9e6dd;border-radius:10px;padding:11px 13px;font-size:13.5px}
.specs b{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8b887d;margin-bottom:3px;font-weight:600}
h2{font-size:19px;margin:28px 0 10px;letter-spacing:-.01em}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px}
.chips a{background:#fff;border:1px solid #e9e6dd;border-radius:999px;padding:7px 13px;font-size:13px;color:#3a382f}
.chips a:hover{border-color:#e8b339;text-decoration:none}
.faq{margin:6px 0}.faq dt{font-weight:700;margin-top:14px}.faq dd{margin:4px 0 0;color:#46443c}
footer{border-top:1px solid #e9e6dd;margin-top:36px;background:#fff}
footer .wrap{padding:22px 20px;font-size:13px;color:#8b887d}
footer a{color:#6b6862}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin:10px 0}
.grid a{background:#fff;border:1px solid #e9e6dd;border-radius:10px;padding:12px 13px;font-size:14px;color:#22201a;font-weight:600}
.grid a:hover{border-color:#e8b339;text-decoration:none}
.grid a span{display:block;font-size:11.5px;color:#8b887d;font-weight:400;margin-top:2px}
@media(max-width:560px){h1{font-size:25px}.specs{grid-template-columns:1fr}}`;

function head(title, desc, canonical, jsonld, extraOg='') {
  return `<!DOCTYPE html><html lang="id"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/og.svg"><meta property="og:site_name" content="Memora">
<meta name="twitter:card" content="summary_large_image">${extraOg}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/seo.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head><body>
<header class="top"><div class="wrap"><a class="brand" href="/"><span class="dot"></span>MEMORA</a>
<nav class="menu"><a href="/poster-peta/">Jelajahi Kota</a><a href="/katalog.html">Katalog</a><a href="/">Buat Poster</a></nav></div></header>`;
}
const foot = `<footer><div class="wrap">© Memora — poster peta personal dari data OpenStreetMap.
 · <a href="/poster-peta/">Semua kota</a> · <a href="/katalog.html">Katalog</a> · <a href="/">Editor</a></div></footer></body></html>`;

/* ---- halaman kota ---- */
function cityPage(c) {
  const url = `${SITE}/poster-peta/${c.slug}`;
  const title = `Poster Peta ${c.disp} — ${c.prov} | Memora`;
  const desc = `Poster peta ${c.disp} (${c.prov}) siap cetak A3 HD 300 DPI tanpa watermark. Buat hiasan dinding & kado kenangan dari peta jalan asli ${c.disp}.`;
  const coord = `${Math.abs(c.lat).toFixed(4)}° ${c.lat>=0?'N':'S'} / ${Math.abs(c.lng).toFixed(4)}° ${c.lng>=0?'E':'W'}`;
  const editor = `/?title=${encodeURIComponent(c.disp)}&sub=${encodeURIComponent(c.prov+', Indonesia')}&lat=${c.lat}&lng=${c.lng}&z=13`;
  const siblings = byProv[c.prov].filter(x => x.slug !== c.slug).slice(0, 14);
  const jsonld = {
    "@context":"https://schema.org","@graph":[
      {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Beranda","item":SITE+"/"},
        {"@type":"ListItem","position":2,"name":"Poster Peta Kota","item":SITE+"/poster-peta/"},
        {"@type":"ListItem","position":3,"name":c.prov,"item":`${SITE}/provinsi/${provSlug[c.prov]}`},
        {"@type":"ListItem","position":4,"name":`Poster Peta ${c.disp}`,"item":url}]},
      {"@type":"Product","name":`Poster Peta ${c.disp}`,"description":desc,"brand":{"@type":"Brand","name":"Memora"},
        "offers":{"@type":"Offer","price":PRICE,"priceCurrency":"IDR","availability":"https://schema.org/InStock","url":url}},
      {"@type":"Place","name":`${c.name}, ${c.prov}`,"geo":{"@type":"GeoCoordinates","latitude":c.lat,"longitude":c.lng}}
    ]};
  return head(title, desc, url, jsonld) + `
<main class="wrap">
<div class="crumb"><a href="/">Beranda</a> › <a href="/poster-peta/">Poster Peta Kota</a> › <a href="/provinsi/${provSlug[c.prov]}">${esc(c.prov)}</a> › ${esc(c.disp)}</div>
<h1>Poster Peta ${esc(c.disp)}</h1>
<p class="lede">Abadikan ${esc(c.name)}, ${esc(c.prov)} menjadi poster peta personal — dari data jalan asli OpenStreetMap, siap cetak <b>A3 HD (3508×4961 px, 300&nbsp;DPI)</b> tanpa watermark.</p>
<div class="hero"><div><a class="cta" href="${editor}">🎨 Buat poster ${esc(c.disp)} sekarang</a></div></div>
<div class="specs">
  <div><b>Provinsi</b>${esc(c.prov)}</div>
  <div><b>Pulau</b>${esc(c.island)}</div>
  <div><b>Koordinat pusat</b>${coord}</div>
  <div><b>Ukuran cetak</b>A3 HD · 300 DPI</div>
  <div><b>Harga</b>${rupiah(PRICE)} / poster</div>
  <div><b>Gaya tema</b>9+ pilihan warna</div>
</div>
<h2>Kenapa poster peta ${esc(c.disp)}?</h2>
<p>Poster peta ${esc(c.disp)} cocok untuk hiasan dinding rumah/kantor, kado pernikahan & ulang tahun, atau kenang-kenangan tempat lahir, tempat bertemu, dan kampung halaman. Kamu bisa menandai titik spesial, menambah judul, tanggal, dan koordinat, lalu memilih gaya warna favorit — semua langsung di editor.</p>
<h2>Cara membuat</h2>
<p>1) Klik tombol di atas untuk membuka editor pada lokasi ${esc(c.disp)}. 2) Pilih gaya/tema & atur zoom. 3) Tambahkan teks/penanda. 4) Unduh poster A3 HD tanpa watermark.</p>
${siblings.length?`<h2>Kota lain di ${esc(c.prov)}</h2><div class="chips">${siblings.map(s=>`<a href="/poster-peta/${s.slug}">${esc(s.disp)}</a>`).join('')}</div>`:''}
<dl class="faq">
  <dt>Apakah datanya akurat?</dt><dd>Ya, memakai data jalan & wilayah asli dari OpenStreetMap.</dd>
  <dt>Ukuran filenya berapa?</dt><dd>A3 HD 3508×4961 piksel pada 300 DPI, siap cetak profesional.</dd>
  <dt>Ada watermark?</dt><dd>Tidak. Hasil unduhan berbayar bersih tanpa watermark.</dd>
</dl>
</main>` + foot;
}

/* ---- halaman provinsi ---- */
function provincePage(prov) {
  const list = byProv[prov].slice().sort((a,b)=>a.disp.localeCompare(b.disp,'id'));
  const url = `${SITE}/provinsi/${provSlug[prov]}`;
  const title = `Poster Peta Kota di ${prov} — ${list.length} wilayah | Memora`;
  const desc = `Daftar poster peta ${list.length} kabupaten/kota di ${prov}. Buat poster peta siap cetak A3 HD tanpa watermark.`;
  const jsonld = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Beranda","item":SITE+"/"},
    {"@type":"ListItem","position":2,"name":"Poster Peta Kota","item":SITE+"/poster-peta/"},
    {"@type":"ListItem","position":3,"name":prov,"item":url}]};
  return head(title, desc, url, jsonld) + `
<main class="wrap">
<div class="crumb"><a href="/">Beranda</a> › <a href="/poster-peta/">Poster Peta Kota</a> › ${esc(prov)}</div>
<h1>Poster Peta Kota di ${esc(prov)}</h1>
<p class="lede">${list.length} kabupaten/kota di ${esc(prov)}. Pilih wilayah untuk membuat poster petanya.</p>
<div class="grid">${list.map(c=>`<a href="/poster-peta/${c.slug}">${esc(c.disp)}<span>${esc(c.name)}</span></a>`).join('')}</div>
</main>` + foot;
}

/* ---- hub /poster-peta/ ---- */
function hubPage() {
  const url = `${SITE}/poster-peta/`;
  const title = `Poster Peta Kota Indonesia — 514 Kabupaten/Kota | Memora`;
  const desc = `Jelajahi poster peta seluruh 514 kabupaten/kota se-Indonesia. Buat hiasan dinding & kado dari peta kota favoritmu, siap cetak A3 HD tanpa watermark.`;
  const jsonld = {"@context":"https://schema.org","@type":"CollectionPage","name":title,"url":url};
  const byIsland = {};
  for (const p of provs) {
    const isl = byProv[p][0].island; (byIsland[isl] ||= []).push(p);
  }
  let body = '';
  for (const isl of Object.keys(byIsland)) {
    body += `<h2>${esc(isl)}</h2><div class="chips">${byIsland[isl].map(p=>`<a href="/provinsi/${provSlug[p]}">${esc(p)} (${byProv[p].length})</a>`).join('')}</div>`;
  }
  return head(title, desc, url, jsonld) + `
<main class="wrap">
<div class="crumb"><a href="/">Beranda</a> › Poster Peta Kota</div>
<h1>Poster Peta Kota Indonesia</h1>
<p class="lede">Pilih dari <b>514 kabupaten/kota</b> se-Indonesia. Klik provinsi untuk melihat daftar kotanya.</p>
${body}
</main>` + foot;
}

/* ---- tulis file ---- */
const W = (rel, content) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };
W('seo.css', CSS);
W('og.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0a1726"/><g fill="none" stroke="#e8b339" stroke-width="3" opacity="0.5"><path d="M0 420 L1200 300"/><path d="M380 0 L520 630"/><path d="M0 200 L1200 470"/></g><text x="80" y="330" font-family="Outfit,Arial" font-size="92" font-weight="800" fill="#e8b339">MEMORA</text><text x="84" y="400" font-family="Outfit,Arial" font-size="34" fill="#cdd9e6">Poster Peta Kota Indonesia · siap cetak A3 HD</text></svg>`);

let nCity = 0;
for (const c of cities) { W(`poster-peta/${c.slug}.html`, cityPage(c)); nCity++; }
for (const p of provs) W(`provinsi/${provSlug[p]}.html`, provincePage(p));
W('poster-peta/index.html', hubPage());

/* sitemap + robots */
const today = new Date().toISOString().slice(0,10);
const urls = [
  `${SITE}/`, `${SITE}/katalog.html`, `${SITE}/poster-peta/`,
  ...provs.map(p => `${SITE}/provinsi/${provSlug[p]}`),
  ...cities.map(c => `${SITE}/poster-peta/${c.slug}`),
];
W('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') + `\n</urlset>\n`);
W('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`OK · kota=${nCity} provinsi=${provs.length} url_sitemap=${urls.length} SITE=${SITE}`);
