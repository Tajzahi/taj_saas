/**
 * Uji alur interaktif (add-to-cart) via Chrome DevTools Protocol.
 * Jalankan: CHROME_BIN=... node scripts/devtools-flow.js http://127.0.0.1:3000
 */
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

const CHROME_BIN = process.env.CHROME_BIN || '/tmp/chromium-bin/chromium';
const LD = process.env.CHROME_LD_LIBRARY_PATH || '';
const BASE = (process.argv[2] || 'http://127.0.0.1:3000').replace(/\/$/, '');
const OUT = process.env.OUT_DIR || '/tmp/devtools-flow';
const PORT = 9333;
fs.mkdirSync(OUT, { recursive: true });

const getJSON = (url) => new Promise((resolve, reject) => {
  http.get(url, (res) => { let b = ''; res.on('data', (d) => (b += d)); res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } }); }).on('error', reject);
});

(async () => {
  const env = { ...process.env };
  if (LD) env.LD_LIBRARY_PATH = LD;
  const chrome = spawn(CHROME_BIN, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--no-first-run', '--no-zygote', '--single-process', '--window-size=1440,900',
    `--remote-debugging-port=${PORT}`, '--remote-allow-origins=*', 'about:blank',
  ], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  chrome.stderr.on('data', () => {});

  let version;
  for (let i = 0; i < 60; i++) {
    try { version = await getJSON(`http://127.0.0.1:${PORT}/json/version`); break; }
    catch { await new Promise((r) => setTimeout(r, 500)); }
  }

  const WebSocket = require('ws');
  const ws = new WebSocket(version.webSocketDebuggerUrl, { perMessageDeflate: false, maxPayload: 512 * 1024 * 1024 });
  await new Promise((res) => ws.once('open', res));
  let id = 0; const pending = new Map(); const errors = [];
  ws.on('message', (raw) => {
    const m = JSON.parse(raw.toString());
    if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result); }
    else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails?.exception?.description);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const i = ++id; pending.set(i, { resolve, reject }); ws.send(JSON.stringify({ id: i, method, params, sessionId }));
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);

  const evaluate = async (expr) => (await send('Runtime.evaluate',
    { expression: expr, returnByValue: true, awaitPromise: true }, sessionId)).result.value;
  const shot = async (name) => {
    const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }, sessionId);
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(s.data, 'base64'));
  };
  const step = (n, msg) => console.log(`  [${n}] ${msg}`);

  console.log('FLOW: buka /menu -> tambah ke keranjang -> buka /cart');

  await send('Page.navigate', { url: `${BASE}/menu` }, sessionId);
  await new Promise((r) => setTimeout(r, 6000));
  const cards = await evaluate(`document.querySelectorAll('h3, h2').length`);
  step(1, `halaman /menu dimuat, ${cards} heading kartu terdeteksi`);

  // Tombol quick-add ada di dalam kartu menu (sibling tombol "Detail"), bukan di <header>/<nav>
  const clicked = await evaluate(`(() => {
    const detail = [...document.querySelectorAll('a, button')]
      .find(el => /^detail$/i.test((el.innerText || '').trim()));
    if (!detail) return { ok: false, reason: 'kartu menu tidak ditemukan' };
    const card = detail.closest('div');
    const addBtn = [...card.querySelectorAll('button')]
      .find(b => !/^detail$/i.test((b.innerText || '').trim()));
    if (!addBtn) return { ok: false, reason: 'tombol add tidak ditemukan di kartu' };
    const name = (card.closest('div[class*=rounded]') || card).innerText.split('\\n')[0];
    addBtn.click();
    return { ok: true, item: name };
  })()`);
  step(2, `klik quick-add pada kartu: ${JSON.stringify(clicked)}`);
  await new Promise((r) => setTimeout(r, 2000));

  // Jika item punya varian, modal muncul -> pilih opsi & konfirmasi
  const modal = await evaluate(`(() => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => /tambah ke keranjang|tambahkan/i.test(b.innerText || ''));
    if (!btn) return { modal: false };
    const opts = [...document.querySelectorAll('button')]
      .filter(b => /sedang|jumbo|kecil|reguler/i.test(b.innerText || ''));
    if (opts.length) opts[0].click();
    btn.click();
    return { modal: true, chose: opts[0]?.innerText?.trim() || null };
  })()`);
  step(3, `modal varian: ${JSON.stringify(modal)}`);
  await new Promise((r) => setTimeout(r, 2000));
  await shot('after-add');

  const storeState = await evaluate(`(() => {
    const out = {};
    for (const k of Object.keys(localStorage)) {
      if (/cart|keranjang/i.test(k)) { try { out[k] = JSON.parse(localStorage.getItem(k)); } catch { out[k] = localStorage.getItem(k); } }
    }
    return JSON.stringify(out);
  })()`);
  step(4, `localStorage cart: ${String(storeState).slice(0, 400)}`);

  const badge = await evaluate(`(() => {
    const header = document.querySelector('header');
    return header ? header.innerText.replace(/\\s+/g, ' ').trim().slice(0, 200) : null;
  })()`);
  step(5, `header: ${badge}`);

  await send('Page.navigate', { url: `${BASE}/cart` }, sessionId);
  await new Promise((r) => setTimeout(r, 5000));
  const cartText = await evaluate(`document.body.innerText.replace(/\\s+/g,' ').trim().slice(0, 500)`);
  step(6, `isi /cart: ${cartText}`);
  await shot('cart');

  if (errors.length) console.log('  JS EXCEPTIONS:', errors);
  else console.log('  tidak ada JS exception selama alur');

  console.log(`screenshots: ${OUT}`);
  ws.close(); chrome.kill('SIGKILL'); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
