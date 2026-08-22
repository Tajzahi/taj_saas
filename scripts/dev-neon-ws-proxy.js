/**
 * Dev-only WebSocket -> TCP proxy agar @neondatabase/serverless bisa bicara ke
 * Postgres lokal (tanpa akun Neon). Dipakai untuk menjalankan app di sandbox/CI.
 *
 * Jalankan: node scripts/dev-neon-ws-proxy.js   (default listen :5433)
 * Lalu set NEON_WS_PROXY=127.0.0.1:5433 di environment app.
 */
const http = require('http');
const net = require('net');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.WS_PROXY_PORT || 5433);
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('neon ws proxy\n');
});
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const host = url.searchParams.get('host') || '127.0.0.1';
  const port = Number(url.searchParams.get('port') || 5432);

  const socket = net.connect({ host, port });
  socket.on('connect', () => {
    ws.on('message', (data) => socket.write(data));
    socket.on('data', (data) => ws.readyState === ws.OPEN && ws.send(data));
  });
  const close = () => {
    try { socket.destroy(); } catch {}
    try { ws.close(); } catch {}
  };
  socket.on('error', close);
  socket.on('close', close);
  ws.on('close', close);
  ws.on('error', close);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[neon-ws-proxy] listening on 127.0.0.1:${PORT}`);
});
