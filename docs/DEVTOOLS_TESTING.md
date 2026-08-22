# Menjalankan & Mengaudit App via Chrome DevTools (CDP)

Panduan menjalankan app **tanpa Neon dan tanpa akses internet** (sandbox/CI), lalu
mengauditnya dengan Chrome headless lewat Chrome DevTools Protocol: console error,
JS exception, request gagal, status HTTP, metrik performa, dan screenshot.

## 1. Database lokal

Neon tidak bisa dijangkau dari lingkungan tertutup. Pakai Postgres lokal:

```bash
# jalankan Postgres di 127.0.0.1:5432, lalu buat database `taj`
# terapkan migrasi dari packages/db/drizzle/*.sql secara berurutan
node scripts/dev-seed-local.js   # seed tenant + kategori + menu + branch + promo
```

`.env` minimal:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/taj?sslmode=disable"
NEXT_PUBLIC_TENANT_SLUG="a6-nyuss"
BETTER_AUTH_SECRET="dev-secret-dev-secret-dev-secret-32"
NEON_WS_PROXY="127.0.0.1:5433"
```

### Kenapa perlu `NEON_WS_PROXY`?

`middleware.ts` berjalan di **Edge runtime**, sehingga driver `pg` (butuh `net`/TCP)
tidak bisa dipakai di sana. Solusinya tetap memakai `@neondatabase/serverless`,
tapi diarahkan ke Postgres lokal lewat WebSocket proxy:

```bash
node scripts/dev-neon-ws-proxy.js   # listen 127.0.0.1:5433 -> TCP 127.0.0.1:5432
```

`packages/db/index.ts` hanya mengaktifkan proxy ini bila `NEON_WS_PROXY` di-set,
jadi perilaku produksi (Neon asli) tidak berubah.

## 2. Jalankan app

```bash
cd apps/customer
npx next build && npx next start -p 3000 -H 0.0.0.0
```

> **Penting:** gunakan **production build** untuk pengujian browser di sandbox.
> Pada `next dev`, Turbopack memerlukan WebSocket HMR (`/_next/webpack-hmr`).
> Bila WebSocket diblokir proxy, React **tidak pernah hydrate** — halaman client
> seperti `/cart` akan berhenti di "Memuat keranjang...". Ini artefak lingkungan,
> bukan bug aplikasi.

## 3. Audit dengan CDP

```bash
export CHROME_BIN=/path/to/chromium
export CHROME_LD_LIBRARY_PATH=/path/to/chromium/lib   # bila memakai chromium portabel

# audit banyak route
node scripts/devtools-audit.js http://127.0.0.1:3000 / /menu /cart /checkout

# uji alur interaktif add-to-cart
node scripts/devtools-flow.js http://127.0.0.1:3000
```

Output: ringkasan di terminal, `report.json`, dan screenshot per halaman di
`$OUT_DIR` (default `/tmp/devtools-audit`).

## 4. Hasil audit terakhir (production build, 11 route)

| Metrik | Hasil |
| --- | --- |
| HTTP status | 200 di semua route |
| JS exception | **0** |
| FCP rata-rata | ~113 ms |
| Alur add-to-cart | OK (localStorage, badge header, total `/cart` benar) |
| Unit test | 27/27 lulus |

Error console yang tersisa **hanya** dari resource eksternal yang diblokir sandbox
(`fonts.gstatic.com`, `images.unsplash.com`) dan `500` dari `/_next/image` yang
mem-proxy Unsplash. Semuanya hilang di lingkungan dengan akses internet.
