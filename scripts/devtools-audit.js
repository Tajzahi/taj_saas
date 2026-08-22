/**
 * Audit halaman via Chrome DevTools Protocol (CDP) tanpa dependency eksternal.
 * Menangkap: console messages, JS exceptions, request gagal, status HTTP, timing,
 * dan screenshot penuh tiap halaman.
 *
 * Jalankan:
 *   CHROME_BIN=/tmp/chromium-bin/chromium node scripts/devtools-audit.js http://127.0.0.1:3000 /
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_BIN = process.env.CHROME_BIN || '/tmp/chromium-bin/chromium';
const LD = process.env.CHROME_LD_LIBRARY_PATH || '';
const BASE = process.argv[2] || 'http://127.0.0.1:3000';
const ROUTES = process.argv.slice(3);
const OUT = process.env.OUT_DIR || '/tmp/devtools-audit';
const PORT = 9222;

fs.mkdirSync(OUT, { recursive: true });

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let b = '';
      res.on('data', (d) => (b += d));
      res.on('end', () => {
        try { resolve(JSON.parse(b)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function waitForCdp() {
  for (let i = 0; i < 60; i++) {
    try { return await getJSON(`http://127.0.0.1:${PORT}/json/version`); }
    catch { await new Promise((r) => setTimeout(r, 500)); }
  }
  throw new Error('CDP not ready');
}

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = []; }
  static async connect(wsUrl) {
    const WebSocket = require('ws');
    const ws = new WebSocket(wsUrl, { perMessageDeflate: false, maxPayload: 512 * 1024 * 1024 });
    await new Promise((res, rej) => { ws.once('open', res); ws.once('error', rej); });
    const c = new CDP(ws);
    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id && c.pending.has(msg.id)) {
        const { resolve, reject } = c.pending.get(msg.id);
        c.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        c.handlers.forEach((h) => h(msg));
      }
    });
    return c;
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
  on(fn) { this.handlers.push(fn); }
  close() { this.ws.close(); }
}

(async () => {
  const args = [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--hide-scrollbars', '--no-first-run', '--no-zygote', '--single-process',
    `--remote-debugging-port=${PORT}`, '--remote-allow-origins=*',
    '--window-size=1440,900', 'about:blank',
  ];
  const env = { ...process.env };
  if (LD) env.LD_LIBRARY_PATH = LD;
  const chrome = spawn(CHROME_BIN, args, { env, stdio: ['ignore', 'pipe', 'pipe'] });
  chrome.stderr.on('data', () => {});

  const version = await waitForCdp();
  const browser = await CDP.connect(version.webSocketDebuggerUrl);

  const report = [];

  for (const route of ROUTES) {
    const url = BASE.replace(/\/$/, '') + route;
    const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });

    const logs = [];
    const errors = [];
    const requests = new Map();
    const failed = [];
    const responses = [];

    browser.on((msg) => {
      if (msg.sessionId !== sessionId) return;
      const p = msg.params || {};
      switch (msg.method) {
        case 'Runtime.consoleAPICalled':
          logs.push({
            type: p.type,
            text: (p.args || []).map((a) => a.value ?? a.description ?? a.unserializableValue ?? a.type).join(' '),
          });
          break;
        case 'Runtime.exceptionThrown':
          errors.push(p.exceptionDetails?.exception?.description || p.exceptionDetails?.text);
          break;
        case 'Log.entryAdded':
          if (['error', 'warning'].includes(p.entry.level)) {
            logs.push({ type: p.entry.level, text: `${p.entry.text} ${p.entry.url || ''}`.trim(), source: p.entry.source });
          }
          break;
        case 'Network.requestWillBeSent':
          requests.set(p.requestId, { url: p.request.url, type: p.type, start: p.timestamp });
          break;
        case 'Network.responseReceived': {
          const r = requests.get(p.requestId);
          responses.push({ url: p.response.url, status: p.response.status, type: p.type, mime: p.response.mimeType });
          if (r) r.status = p.response.status;
          break;
        }
        case 'Network.loadingFailed': {
          const r = requests.get(p.requestId) || {};
          failed.push({ url: r.url, error: p.errorText, type: p.type });
          break;
        }
      }
    });

    await browser.send('Page.enable', {}, sessionId);
    await browser.send('Runtime.enable', {}, sessionId);
    await browser.send('Log.enable', {}, sessionId);
    await browser.send('Network.enable', {}, sessionId);
    await browser.send('Emulation.setDeviceMetricsOverride',
      { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);

    const t0 = Date.now();
    await browser.send('Page.navigate', { url }, sessionId);
    await new Promise((r) => setTimeout(r, 6000));
    const loadMs = Date.now() - t0;

    const title = (await browser.send('Runtime.evaluate',
      { expression: 'document.title', returnByValue: true }, sessionId)).result.value;
    const bodyLen = (await browser.send('Runtime.evaluate',
      { expression: 'document.body ? document.body.innerText.length : 0', returnByValue: true }, sessionId)).result.value;
    const metrics = (await browser.send('Runtime.evaluate', {
      expression: `JSON.stringify((() => { const n = performance.getEntriesByType('navigation')[0] || {};
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        return { domContentLoaded: Math.round(n.domContentLoadedEventEnd || 0),
                 load: Math.round(n.loadEventEnd || 0), fcp: fcp ? Math.round(fcp.startTime) : null,
                 transferKB: Math.round((n.transferSize || 0) / 1024) }; })())`,
      returnByValue: true,
    }, sessionId)).result.value;

    const shotName = `${(route === '/' ? 'home' : route.replace(/\W+/g, '_').replace(/^_|_$/g, ''))}.png`;
    const shot = await browser.send('Page.captureScreenshot',
      { format: 'png', captureBeyondViewport: true }, sessionId);
    fs.writeFileSync(path.join(OUT, shotName), Buffer.from(shot.data, 'base64'));

    const mainStatus = responses.find((r) => r.url.replace(/\/$/, '') === url.replace(/\/$/, ''))?.status ?? null;

    report.push({
      route, url, title, mainStatus, loadMs, bodyLen,
      metrics: JSON.parse(metrics),
      consoleErrors: logs.filter((l) => l.type === 'error'),
      consoleWarnings: logs.filter((l) => ['warning', 'warn'].includes(l.type)),
      jsExceptions: errors,
      failedRequests: failed,
      http4xx5xx: responses.filter((r) => r.status >= 400),
      requestCount: responses.length,
      screenshot: path.join(OUT, shotName),
    });

    await browser.send('Target.closeTarget', { targetId });
  }

  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

  // Ringkasan terminal
  for (const r of report) {
    console.log(`\n=== ${r.route}  [HTTP ${r.mainStatus}]  "${r.title}"`);
    console.log(`    load=${r.loadMs}ms  fcp=${r.metrics.fcp}ms  dcl=${r.metrics.domContentLoaded}ms  text=${r.bodyLen} chars  requests=${r.requestCount}`);
    if (r.jsExceptions.length) console.log(`    JS EXCEPTIONS (${r.jsExceptions.length}):\n      - ` + r.jsExceptions.map((e) => String(e).split('\n')[0]).join('\n      - '));
    if (r.consoleErrors.length) console.log(`    CONSOLE ERRORS (${r.consoleErrors.length}):\n      - ` + r.consoleErrors.map((e) => e.text.slice(0, 220)).join('\n      - '));
    if (r.http4xx5xx.length) console.log(`    HTTP >=400 (${r.http4xx5xx.length}):\n      - ` + r.http4xx5xx.map((e) => `${e.status} ${e.url.slice(0, 140)}`).join('\n      - '));
    if (r.failedRequests.length) console.log(`    FAILED REQUESTS (${r.failedRequests.length}):\n      - ` + r.failedRequests.map((e) => `${e.error} ${String(e.url).slice(0, 140)}`).join('\n      - '));
    if (r.consoleWarnings.length) console.log(`    warnings: ${r.consoleWarnings.length}`);
  }
  console.log(`\nreport: ${path.join(OUT, 'report.json')}`);

  browser.close();
  chrome.kill('SIGKILL');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
