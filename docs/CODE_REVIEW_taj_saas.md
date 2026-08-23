# 🔍 Laporan Code Review Mendalam — Repository `taj_saas`

**Auditor:** Senior Software Architect & Lead Code Auditor (Claude)
**Repo:** `github.com/Tajzahi/taj_saas` (branch `main`)
**Stack:** Next.js App Router (3 aplikasi: Customer, Owner, Admin) + Drizzle ORM/PostgreSQL (Neon) + Better Auth
**Tanggal Audit:** 23 Agustus 2026

---

## ⚠️ Catatan Ruang Lingkup (Penting, mohon dibaca dulu)

Repository ini berisi **134 berkas `.ts`/`.tsx`** di dalam `apps/` (25 di `admin`, 45 di `customer`, 64 di `owner`) ditambah **~20 berkas** di `lib/` dan `packages/`. Melakukan audit *file-by-file* dengan kedalaman penuh untuk seluruh 150+ berkas sekaligus dalam satu laporan tidak realistis dan justru akan menurunkan kualitas analisis (menjadi dangkal).

Karena itu, strategi audit saya adalah:

1. **Cakupan 100% mendalam** untuk `lib/` dan `packages/` — ini adalah **jantung keamanan sistem** (Auth, Otorisasi Multi-Tenant, Pricing Engine, Skema Database) sesuai prioritas #2 dan #3 yang Anda minta.
2. **Cakupan mendalam pada jalur kritis (critical path)** di setiap `apps/` — yaitu berkas yang menyentuh uang, harga, dan data lintas-tenant: pembuatan order Customer (checkout), pembuatan order POS Admin, dan alur registrasi Owner. Ini adalah tempat paling rawan celah keamanan/bisnis.
3. Saya **tidak** membaca ulang detail seluruh 90+ berkas UI/komponen presentasional (`.tsx` murni tampilan) karena risiko keamanan & bisnisnya jauh lebih rendah dibanding server actions & API routes.

Jika Anda ingin saya lanjutkan ke batch berikutnya (misalnya seluruh `apps/owner/app/actions/*` lainnya, atau seluruh komponen `apps/customer`), saya siap melanjutkan — beri tahu saja folder mana yang ingin diprioritaskan berikutnya.

---

## 🚨 RINGKASAN EKSEKUTIF — TEMUAN KRITIS

Sebelum masuk ke detail per berkas, ada **1 celah keamanan kritis (Critical/P0)** yang harus diperbaiki **sebelum produksi**, karena berpotensi menyebabkan **pengambilalihan tenant (cross-tenant privilege escalation)**.

> ### 🔴 CVE-Level: Auto-Provisioning Owner Lintas Tenant di `lib/tenant-authorization.ts`
>
> **Alur serangan:**
> 1. Seseorang mendaftar sebagai Owner toko sendiri via `apps/owner/app/actions/authActions.ts` → `registerOwnerAction()`. Pada baris ini, sistem menyetel `schema.user.role = 'owner'` secara **global** (bukan per-tenant):
>    ```ts
>    await db.update(schema.user).set({ role: "owner" }).where(eq(schema.user.id, createdUserId));
>    ```
> 2. Attacker (yang sudah punya sesi login sah sebagai Owner Tenant A) membuka subdomain **owner** milik Tenant B (`owner.tokolain.com`) — toko kompetitor, atau toko manapun yang aktif di platform.
> 3. Di `requireTenantSession()` (`lib/tenant-authorization.ts`, baris ±306–340), karena attacker belum punya baris `profiles` untuk Tenant B, sistem masuk ke blok **"Auto-recovery fallback for newly registered owner"**:
>    ```ts
>    const dbUser = await db.select().from(schema.user).where(eq(schema.user.id, session.user.id)).limit(1);
>
>    if (dbUser.length > 0 && (dbUser[0].role === 'owner' || (session.user as any).role === 'owner')) {
>      const [newProfile] = await db.insert(schema.profiles).values({
>        id: session.user.id,
>        tenantId: tenant.id, // ⚠️ tenant.id di sini adalah Tenant B, hasil resolve dari Host header!
>        email: session.user.email,
>        role: 'owner',
>        salary: '0',
>      }).onConflictDoNothing().returning();
>      // ...
>      return { tenant, user: session.user, profile: newProfile || {...} };
>    }
>    ```
> 4. Karena satu-satunya syarat adalah **`user.role === 'owner'` secara global** (bukan validasi "apakah user ini benar pemilik Tenant B"), sistem **otomatis membuatkan profil Owner baru untuk Tenant B** dan langsung memberi attacker hak akses penuh: `menu:manage`, `finance:read`, `payments:refund`, `hr:manage`, `settings:manage`, `orders:verify-payment`, dll — **atas bisnis milik orang lain**, tanpa undangan, tanpa persetujuan pemilik asli.
>
> **Dampak:** Kebocoran data finansial lintas tenant, pengubahan harga/menu toko lain, refund ilegal, penghapusan/perubahan data operasional toko lain — pelanggaran fundamental terhadap prinsip isolasi multi-tenant (tenant isolation) yang menjadi tulang punggung SaaS ini.
>
> **Akar masalah:** Field `role` pada tabel global `user` dipakai sebagai sinyal "apakah boleh auto-provisioning owner", padahal field ini **tidak tenant-scoped**. Logika ini kemungkinan awalnya dirancang untuk kasus "staging Cloud Run single-domain" (di mana banyak app berbagi 1 domain), tapi tidak aman diterapkan di skenario multi-tenant produksi dengan banyak subdomain/domain custom.
>
> **Rekomendasi Perbaikan (WAJIB sebelum go-live):**
> Hapus total mekanisme auto-provisioning berbasis `user.role` global. Ganti dengan salah satu:
> - **Opsi A (paling aman):** Provisioning profil owner **hanya** terjadi di dalam transaksi `registerOwnerAction()` itu sendiri (sudah dilakukan di sana). Hapus blok "Auto-recovery" ini sepenuhnya dari `requireTenantSession`. Jika profil tidak ditemukan → langsung `403 FORBIDDEN`.
> - **Opsi B (jika auto-recovery memang dibutuhkan untuk staging):** Tambahkan flag eksplisit `isPendingProvisioning` + `pendingTenantId` yang **hanya diset oleh `registerOwnerAction` pada saat pendaftaran**, dan konsumsi flag itu sekali pakai (one-time token) — bukan mengandalkan `role` global.
>
> ```ts
> // SEBELUM (rawan):
> if (dbUser.length > 0 && dbUser[0].role === 'owner') {
>   // auto insert profile ke tenant hasil resolve host header — BAHAYA
> }
>
> // SESUDAH (aman):
> // Hapus blok auto-recovery. Jika tidak ada profile untuk tenant ini → tolak akses.
> throw new AuthorizationError('FORBIDDEN', 403, 'Akses ke tenant ini ditolak. Hubungi pemilik toko untuk undangan akses.');
> ```

Selain temuan kritis di atas, ada beberapa temuan **High/Medium** lain yang dijelaskan per berkas di bawah.

---

## 1️⃣ `lib/tenant-authorization.ts` (421 baris)

### Fungsi Utama
Modul otorisasi sentral: (a) resolusi tenant dari `Host` header (subdomain/domain custom/localhost/Cloud Run), (b) validasi sesi Better Auth + keanggotaan tenant (`requireTenantSession`), (c) RBAC berbasis matriks permission per role (`requireTenantPermission`), (d) audit log dengan redaksi data sensitif otomatis.

### 🟢 Poin Keunggulan
- **Matriks permission (`ROLE_PERMISSIONS`) eksplisit dan type-safe** menggunakan union type `Permission` — jauh lebih baik daripada string permission bebas yang rawan typo.
- **Resolusi tenant *independen dari database*, bukan dari header yang bisa dipalsukan klien** (`resolveTenantFromRequestHost` selalu query ulang ke DB, tidak percaya `x-tenant-id` dari luar) — pendekatan *zero-trust* yang benar.
- **Redaksi otomatis data sensitif pada audit log** (`redactSensitiveData` dengan regex `password|secret|token|...`) sebelum disimpan ke `auditLogs` — praktik keamanan yang baik untuk mencegah kebocoran token/password di log.
- Audit logger dibungkus `try/catch` sehingga kegagalan logging **tidak** menggagalkan transaksi bisnis utama — desain *fail-open* yang tepat untuk *logging*, bukan untuk *authorization*.
- `AuthorizationError` sebagai *typed error* dengan `code` & `status` HTTP eksplisit memudahkan penanganan konsisten di seluruh API routes.

### 🔴 Poin Temuan / Catatan Perbaikan

**[KRITIS]** Mekanisme *auto-provisioning owner lintas tenant* — sudah dijelaskan lengkap di Ringkasan Eksekutif di atas. **Wajib diperbaiki sebelum produksi.**

**[HIGH] Fallback "Single-domain staging" mengabaikan validasi Host↔Tenant** (baris 277–304):
```ts
if (!profile) {
  const userProfileResult = await db.select().from(schema.profiles)
    .where(eq(schema.profiles.id, session.user.id)).limit(1); // ⚠️ tidak difilter tenantId!
  if (userProfileResult.length > 0) {
    profile = userProfileResult[0];
    // ...mengembalikan tenant ASLI milik user, mengabaikan tenant hasil resolve Host header
  }
}
```
Jika user Tenant A mengakses subdomain owner Tenant B (misal salah ketik URL, atau iseng), sistem **tidak menolak** — malah diam-diam mengembalikan data **Tenant A** (tenant asli user), padahal secara URL browser menampilkan konteks Tenant B. Ini secara teknis tidak membocorkan data Tenant B, tapi:
1. Merusak jaminan "host menentukan tenant" yang menjadi asumsi keamanan di banyak tempat lain.
2. Berpotensi membingungkan user (salah kelola toko) atau disalahgunakan sebagai *side channel* untuk mengecek keberadaan/status suatu tenant/domain.

**Rekomendasi:** Fallback ini sebaiknya hanya aktif ketika `process.env.NODE_ENV !== 'production'` **atau** ketika host benar-benar terdeteksi sebagai *default staging slug* (`taj-saas`), bukan untuk semua kasus.

**[MEDIUM] Fallback "latest active tenant" pada `resolveTenantFromRequestHost`** (baris 221–232):
```ts
if (tenantResult.length === 0) {
  const [latestTenant] = await db.select().from(schema.tenants)
    .where(eq(schema.tenants.isActive, true)).orderBy(desc(schema.tenants.createdAt)).limit(1);
  if (latestTenant) tenantResult = [latestTenant];
}
```
Jika slug/domain yang diminta **tidak ditemukan sama sekali** (typo, domain lama yang sudah tidak dipakai, atau *probing* oleh pihak luar), sistem **tidak mengembalikan 404** — malah menebak dan mengembalikan tenant **teraktif terbaru**. Di lingkungan produksi multi-tenant sungguhan (bukan staging 1-tenant), ini berbahaya: request yang salah arah bisa "menempel" ke tenant lain yang tidak berhubungan, berpotensi men-trigger pembuatan order/registrasi di tenant yang salah.

**Rekomendasi:** Batasi fallback ini hanya untuk lingkungan non-produksi, atau hanya ketika secara eksplisit terdeteksi sebagai *default staging domain* (`*.a.run.app` tanpa mapping custom domain), bukan untuk semua kegagalan lookup.

```ts
// Perbaikan yang disarankan:
if (tenantResult.length === 0) {
  const isKnownStagingHost = norm.hostname.endsWith('.a.run.app') || norm.hostname.endsWith('.run.app');
  if (isKnownStagingHost && process.env.NODE_ENV !== 'production') {
    // ...fallback hanya di sini
  }
  // selain itu -> lempar TENANT_NOT_FOUND (404), jangan menebak
}
```

**[LOW] `redactSensitiveData`** memeriksa nama kunci `content` sebagai pola sensitif (`SENSITIVE_KEY_PATTERN`). Ini terlalu luas — field apa pun bernama `content` (misalnya isi catatan pesanan) akan ikut ter-redact di audit log, mengurangi kegunaan log untuk investigasi. Sebaiknya lebih spesifik, misalnya `paymentProofContent` daripada `content` generik.

### 🎯 Rating Kesiapan Produksi: **35% — TIDAK BOLEH deploy sampai temuan kritis diperbaiki**

---

## 2️⃣ `lib/server/pricing-service.ts` (445 baris)

### Fungsi Utama
*Single source of truth* untuk kalkulasi harga: subtotal, diskon promo, ongkos kirim (berbasis jarak Haversine + zona), pajak & service charge (BPS/basis poin), divalidasi selalu dari data harga **server-side** (bukan dari input klien) — inilah "Server Pricing Engine" yang mencegah manipulasi harga dari sisi client.

### 🟢 Poin Keunggulan
- **Prinsip anti price-bypass diterapkan dengan benar**: harga (`unitPrice`) **selalu diambil ulang dari `schema.menuItems.price`**, bukan dari payload klien. Ini terbukti dipakai konsisten di `apps/customer/app/api/orders/route.ts` dan `apps/admin/app/actions.ts` (`createOfflineOrderAction` bahkan menerima `data.totalPrice` dari klien tapi **tidak pernah memakainya** — nilai final selalu dari `pricingResult.totalPrice`). Ini adalah praktik defensif yang sangat baik.
- Perhitungan pajak/service charge menggunakan aritmetika **basis poin (BPS) dengan `Math.round`**, menghindari isu floating-point yang umum pada perhitungan uang.
- Kalkulasi ongkir server-otoritatif berbasis Haversine + validasi radius maksimum — mencegah klien mengklaim jarak palsu untuk ongkir murah.
- Validasi `dbItem.isAvailable` mencegah pemesanan item yang sedang tidak tersedia.
- Quantity di-*clamp* `Math.max(1, Math.min(99, item.quantity))` — mencegah quantity negatif/nol/ekstrem.

### 🔴 Poin Temuan / Catatan Perbaikan

**[HIGH] `STATIC_CATALOGUE_FALLBACK` — katalog hardcoded 1 tenant bocor ke pricing engine yang dipakai SEMUA tenant** (baris 203–226):
```ts
const STATIC_CATALOGUE_FALLBACK: Record<string, {...}> = {
  'martabak-telur-ayam-1-telur-20k': { name: 'Martabak Telur Ayam...', price: 20000, ... },
  // ... daftar menu spesifik bisnis "Martabak Pakde"
};
```
`calculateOrderPricing` adalah fungsi **generik lintas-tenant** (parameter pertamanya `tenantId`), tapi berisi katalog harga hardcoded milik satu bisnis tertentu, yang dipakai sebagai fallback **untuk tenant manapun** jika `menuItemId`/`slug` tidak ditemukan di DB tenant tersebut. Risikonya:
1. **Tenant lain** yang kebetulan punya slug lama/rusak yang mirip (misalnya karena migrasi data) bisa mendapat harga dari katalog Martabak Pakde, bukan harga toko mereka sendiri.
2. Pencocokan fuzzy `rawKey.includes(k) || k.includes(rawKey)` (baris 238) berisiko *false-positive match* antar-slug yang mirip, berpotensi salah menetapkan harga.
3. Ini adalah **tech debt arsitektural**: kode generik multi-tenant tidak boleh mengandung data spesifik 1 tenant.

**Rekomendasi:** Hapus `STATIC_CATALOGUE_FALLBACK` dari pricing engine generik. Jika dibutuhkan untuk migrasi data lama, pindahkan ke skrip migrasi satu kali (`packages/db/scripts/`) yang menulis data ke tabel `menuItems` tenant terkait, bukan sebagai fallback runtime permanen.

```ts
// SEBELUM: fallback diam-diam pakai harga hardcoded tenant lain
if (!dbItem && rawKey) { /* ...fallback ke STATIC_CATALOGUE_FALLBACK... */ }

// SESUDAH: langsung gagal eksplisit jika item tidak ada di DB tenant terkait
if (!dbItem) {
  throw new Error(`Menu item '${item.menuItemName || item.menuItemId}' tidak ditemukan di katalog toko ini.`);
}
```

**[MEDIUM] Query `branches` dan `categories` mengambil SEMUA baris tenant tanpa filter tambahan, lalu difilter di memory** (baris 108–111, 194–198). Untuk tenant dengan banyak cabang/kategori, ini cukup efisien (biasanya puluhan baris), tapi pola `.find()` di JS setelah `SELECT *` sebaiknya diganti kondisi `WHERE` langsung ketika `branchId` sudah diketahui, untuk mengurangi payload yang ditransfer dari DB:
```ts
// Lebih efisien jika branchId sudah pasti diketahui:
const [selectedBranch] = branchId
  ? await db.select().from(schema.branches).where(and(eq(schema.branches.tenantId, tenantId), eq(schema.branches.id, branchId))).limit(1)
  : [];
```

**[LOW] Tidak ada validasi batas atas jumlah `items` dalam satu order** — pelanggan/POS bisa mengirim ribuan baris item dalam satu request, memicu query `inArray` besar dan perhitungan berat. Tambahkan batas wajar, misalnya maksimal 100 item per order.

**[LOW/Bug Edge Case]** Pada perhitungan varian (baris 264–292), jika `item.variantName` berisi nama varian yang **tidak match sama sekali** dengan `dbItem.variants` (misalnya typo dari klien), fungsi **diam-diam mengabaikan** modifier tersebut tanpa error — harga tetap dihitung hanya dari harga dasar. Ini secara teknis "aman" (tidak bisa dieksploitasi untuk memperkecil harga karena hanya bisa menambah `Math.max(0, ...)`), tapi bisa menyebabkan pelanggan membayar harga yang tidak sesuai ekspektasi (varian yang diminta tidak tercatat/tidak ditagih). Sebaiknya kembalikan *warning* di response API, atau tolak jika varian wajib tidak match.

### 🎯 Rating Kesiapan Produksi: **75%** (logika inti kokoh dan aman dari bypass harga, tapi katalog hardcoded harus dibersihkan sebelum onboarding tenant baru selain "Martabak Pakde")

---

## 3️⃣ `lib/auth.ts` (95 baris)

### Fungsi Utama
Konfigurasi server Better Auth: strategi email/password, resolusi `baseURL` otomatis http→https di produksi, `trustedOrigins`, penambahan field `role` pada tabel `user`, dan pengaturan cookie aman (secure, cross-subdomain).

### 🟢 Poin Keunggulan
- **Fail-fast jika `BETTER_AUTH_SECRET` tidak diset** (`throw new Error(...)` di level modul) — mencegah aplikasi berjalan dengan secret kosong/lemah. Praktik yang sangat baik.
- Default `role: 'kasir'` (hak akses paling minim) untuk user baru, bukan `owner`/`manager` — mengikuti prinsip *least privilege* pada level skema.
- `useSecureCookies` otomatis `true` di produksi, dan `generateId` menggunakan `crypto.randomUUID()` (bukan ID predictable).
- Dokumentasi *header comment* dalam file sangat rapi dan membantu (blueprint konstruksi) — memudahkan onboarding developer baru.

### 🔴 Poin Temuan / Catatan Perbaikan

**[MEDIUM] `trustedOrigins` menggunakan wildcard luas untuk platform publik**: `"https://*.a.run.app"`, `"https://*.vercel.app"`, `"https://*.netlify.app"`. Wildcard ini **tidak spesifik ke proyek Anda** — secara teori domain siapa pun yang di-deploy di subdomain `*.a.run.app`/`*.vercel.app` (termasuk milik pihak lain, bukan hanya deployment Anda) dianggap "trusted origin" oleh Better Auth untuk keperluan CORS/CSRF origin-check. Ini melemahkan proteksi CSRF bawaan Better Auth.

**Rekomendasi:** Ganti wildcard umum dengan daftar domain eksplisit hasil deployment Anda sendiri (mis. `taj-customer-xxxxx.a.run.app`, `taj-admin-xxxxx.a.run.app`), atau minimal gunakan environment variable untuk daftar origin produksi yang divalidasi saat build/deploy, bukan wildcard permanen di kode.

**[MEDIUM] `emailAndPassword: { enabled: true }` tanpa konfigurasi tambahan** — tidak terlihat pengaturan seperti `minPasswordLength`, `requireEmailVerification`, atau *rate limiting* percobaan login bawaan Better Auth. Kombinasikan dengan temuan rate-limiter di bawah (§4): tidak ada proteksi *brute-force* eksplisit untuk endpoint login.

**Rekomendasi:**
```ts
emailAndPassword: {
  enabled: true,
  minPasswordLength: 8,
  requireEmailVerification: true, // sesuaikan kebutuhan bisnis
},
rateLimit: {
  window: 60,
  max: 5, // batasi percobaan login per menit per IP
},
```

**[LOW]** Tidak ada mekanisme *lockout* akun setelah beberapa kali gagal login berturut-turut — pertimbangkan menambahkan ini di level Better Auth plugin atau middleware terpisah.

### 🎯 Rating Kesiapan Produksi: **80%**

---

## 4️⃣ `lib/server/rate-limiter.ts` (151 baris)

### Fungsi Utama
Rate limiter terpadu: menggunakan Upstash Redis (distributed) bila dikonfigurasi, dan *fallback* ke in-memory sliding window untuk dev/lokal. Menyediakan preset limit per fitur (`order_creation`, `order_cancellation`, dll).

### 🟢 Poin Keunggulan
- Desain *preset* per-fitur (`RATE_LIMIT_PRESETS`) rapi dan mudah dikonfigurasi ulang tanpa menyentuh kode pemanggil.
- Pembersihan berkala `memoryBuckets` (`setInterval` 5 menit) mencegah memory leak pada mode in-memory.
- `checkRateLimit` menangani kegagalan koneksi Upstash dengan `try/catch` lalu fallback in-memory — mencegah error rate-limiter menjadi *single point of failure* yang mematikan seluruh API.

### 🔴 Poin Temuan / Catatan Perbaikan

**[HIGH] Komentar kode menyatakan "fails closed to prevent security bypass" tapi implementasi aktualnya *fail-open* ke in-memory limiter** (baris 97–101 vs 102–125):
```ts
/**
 * Production requires UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN.
 * If unconfigured in production, fails closed to prevent security bypass.
 */
export async function checkRateLimit(...) {
  const hasUpstashConfig = Boolean(...) && Boolean(...);
  if (hasUpstashConfig) { /* pakai Upstash */ }
  return checkInMemoryRateLimit(identifier, limit, windowSec); // ⚠️ tetap jalan, bukan "fail closed"/menolak request
}
```
Jika `UPSTASH_REDIS_REST_URL`/`TOKEN` **lupa** di-set di environment produksi, aplikasi **tidak error / tidak menolak** — ia diam-diam memakai rate limiter in-memory. Di deployment Cloud Run yang **auto-scaling multi-instance**, setiap instance punya memory terpisah, sehingga limit efektif menjadi `limit × jumlah instance aktif` — jauh lebih longgar dari yang dikonfigurasi, dan tidak konsisten. Ini berbahaya khusus untuk endpoint sensitif seperti `order_creation` (potensi *order flooding*/abuse) dan validasi promo (potensi *brute-force* kode promo).

**Rekomendasi:** Samakan perilaku dengan dokumentasi — jika di produksi (`NODE_ENV === 'production'`) dan Upstash tidak dikonfigurasi, sebaiknya **log peringatan keras / alert monitoring**, dan pertimbangkan opsi konfigurasi eksplisit apakah boleh fallback in-memory atau tidak di produksi:
```ts
export async function checkRateLimit(identifier: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  const hasUpstashConfig = Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (!hasUpstashConfig && process.env.NODE_ENV === 'production') {
    console.error('[rate-limiter] CRITICAL: Upstash tidak dikonfigurasi di produksi! Rate limit per-instance, tidak terdistribusi.');
    // opsional: kirim alert ke monitoring (Sentry/Slack) di sini
  }
  // ...
}
```

**[MEDIUM]** Identifier rate-limit pada pemanggil (`apps/customer/app/api/orders/route.ts`) memakai `x-forwarded-for` mentah tanpa validasi bahwa request benar-benar melewati *trusted proxy* (Cloud Run/load balancer). Jika header ini bisa dikontrol langsung oleh klien (tergantung konfigurasi proxy di depan Next.js), rate limiter berbasis IP bisa dilewati dengan memalsukan header tersebut. Perlu dipastikan di level infrastruktur (Cloud Run) bahwa `x-forwarded-for` selalu di-*overwrite* oleh load balancer, bukan diteruskan mentah dari klien.

### 🎯 Rating Kesiapan Produksi: **65%** (fungsional untuk dev, tapi *false sense of security* di produksi bila Upstash lupa dikonfigurasi)

---

## 5️⃣ `packages/db/schema.ts` (668 baris)

### Fungsi Utama
Definisi skema Drizzle ORM lengkap untuk PostgreSQL: `tenants`, `profiles`, `branches`, `menuItems`, `orders`, `orderItems`, `inventory`, `shifts`, `promos`, `auditLogs`, `outboxEvents`, dll — mendukung arsitektur multi-tenant *shared database, shared schema* dengan kolom `tenantId` di hampir semua tabel.

### 🟢 Poin Keunggulan
- **Isolasi tenant konsisten**: hampir semua tabel domain memiliki kolom `tenantId` dengan `references(() => tenants.id, { onDelete: 'cascade' })` dan **index eksplisit** (`index("xxx_tenantId_idx")`) — baik untuk performa query yang selalu difilter per-tenant.
- **Unique composite index yang tepat untuk mencegah duplikasi dalam 1 tenant**, misalnya:
  - `uniqueIndex("menu_items_tenant_slug_idx").on(table.tenantId, table.slug)` — slug boleh sama antar-tenant berbeda, tapi unik dalam 1 tenant. Ini desain multi-tenant yang benar (tidak memaksa slug unik global).
  - `uniqueIndex("orders_tenant_idempotency_idx").on(table.tenantId, table.idempotencyKey)` — mendukung idempotency key per-tenant dengan baik, konsisten dengan implementasi di `apps/customer/app/api/orders/route.ts`.
- **Composite index untuk pola query umum**: `orders_tenant_created_idx`, `orders_tenant_status_payment_idx` — menunjukkan index dirancang berdasarkan pola akses nyata (misalnya dashboard order berdasarkan status+payment), bukan asal tambah index.
- Penggunaan `numeric`/`decimal` untuk nilai uang (bukan `float`) — tepat untuk menghindari isu presisi floating point pada perhitungan finansial.
- `onDelete: 'cascade'` konsisten untuk data anak (order items, inventory transactions) dan `onDelete: 'set null'` untuk relasi opsional (`branchId` pada `profiles`) — desain *referential integrity* yang matang.

### 🔴 Poin Temuan / Catatan Perbaikan

**[MEDIUM] Kolom `profiles.tenantId` bersifat *nullable*** (baris 105), berbeda dengan tabel lain seperti `branches`, `categories`, `menuItems` yang mewajibkan `tenantId` (`notNull()`). Ini "membuka pintu" secara skema untuk baris `profiles` tanpa tenant — kondisi yang secara implisit dieksploitasi oleh bug *auto-provisioning* di §1 (jika insert gagal validasi lain, bisa saja tenantId null lolos ke DB). Sebaiknya `tenantId` di `profiles` juga `.notNull()` kecuali memang ada kebutuhan bisnis nyata untuk profil "tanpa tenant" (misalnya super-admin platform Anda sendiri — jika demikian, sebaiknya dipisah ke tabel `platformAdmins` tersendiri, bukan dicampur di `profiles`).

**[MEDIUM] Tidak ada Row-Level Security (RLS) PostgreSQL sebagai lapisan pertahanan kedua.** Seluruh isolasi tenant saat ini **100% bergantung pada disiplin kode aplikasi** (setiap query harus ingat menambahkan `WHERE tenantId = ...`). Ini sudah dilakukan dengan cukup baik di kode yang saya audit, tapi risikonya: **satu baris kode yang lupa filter tenantId di masa depan = kebocoran data lintas tenant langsung**, tanpa ada "jaring pengaman" di level database.

**Rekomendasi (defense-in-depth):** Pertimbangkan mengaktifkan PostgreSQL RLS pada tabel-tabel sensitif (`orders`, `profiles`, `menuItems`, dst.) dengan policy berbasis `current_setting('app.tenant_id')` yang diset di awal setiap koneksi/transaksi. Ini memberi lapisan proteksi tambahan seandainya ada bug di level query aplikasi.

**[LOW] `promos.code` memiliki index (`promos_code_idx`) tapi bukan composite unique dengan `tenantId`** (baris 366–367) — berbeda dengan pola unique index tenant-scoped di tabel lain (`categories`, `menuItems`). Jika bisnis memang ingin kode promo unik per-tenant (bukan unik global), sebaiknya ditambahkan `uniqueIndex("promos_tenant_code_idx").on(table.tenantId, table.code)` agar dua tenant berbeda tidak saling bentrok kode promo, dan mencegah *duplicate promo* dalam satu tenant akibat *race condition* saat pembuatan promo.

**[LOW]** Tidak terlihat kolom `updatedAt` pada beberapa tabel penting seperti `orders`, `profiles` (hanya `branches` yang punya `updatedAt`). Untuk *audit trail* dan *debugging* yang lebih baik, pertimbangkan menambahkan `updatedAt` yang di-update otomatis via trigger DB atau `$onUpdate` Drizzle pada tabel-tabel transaksional utama.

### 🎯 Rating Kesiapan Produksi: **80%**

---

## 6️⃣ `packages/db/index.ts` (39 baris)

### Fungsi Utama
Inisialisasi koneksi Drizzle ORM ke Neon PostgreSQL (`@neondatabase/serverless`), termasuk resolusi WebSocket constructor lintas-runtime (Node/Edge/Serverless) dan ekspor `db` + `schema`.

### 🟢 Poin Keunggulan
- Penanganan `WebSocket` constructor yang cukup robust untuk berbagai runtime (`globalThis.WebSocket` vs `require('ws')`), penting untuk kompatibilitas Neon serverless driver di Node.js klasik maupun Edge Runtime.
- Guard `typeof window === 'undefined'` mencegah inisialisasi `Pool`/`db` berjalan tak sengaja di bundle client-side.

### 🔴 Poin Temuan / Catatan Perbaikan

**[MEDIUM] Fallback *connection string placeholder* yang menyesatkan** (baris 22–25):
```ts
const pool = (typeof window === 'undefined')
  ? new Pool({ connectionString: databaseUrl || 'postgresql://placeholder-user:placeholder-pass@placeholder-host.tld/neondb' })
  : null as any;
```
Jika `DATABASE_URL` tidak diset, aplikasi **tidak langsung gagal saat boot** — hanya `console.warn`, lalu tetap membentuk `Pool` dengan connection string palsu. Efeknya, error baru muncul **saat query pertama dijalankan** (jauh dari titik akar masalah), menyulitkan debugging saat deployment awal/staging baru.

**Rekomendasi:** Untuk lingkungan produksi, ganti menjadi *fail-fast* seperti pola yang sudah bagus di `lib/auth.ts`:
```ts
if (typeof window === 'undefined' && !databaseUrl) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[db/index] DATABASE_URL wajib diset di lingkungan produksi.');
  }
  console.warn('[db/index] DATABASE_URL tidak diset — menggunakan koneksi placeholder (hanya untuk build lokal).');
}
```

### 🎯 Rating Kesiapan Produksi: **80%**

---

## 7️⃣ `packages/shared/tenant.ts` (198 baris) & `packages/shared/index.ts` (74 baris)

### Fungsi Utama
`tenant.ts`: helper middleware Next.js untuk resolusi tenant dari hostname + cache in-memory 60 detik + redirect dev antar-port. `index.ts`: parser hostname→`{slug, appType}` yang dipakai bersama oleh middleware ketiga aplikasi.

### 🟢 Poin Keunggulan
- Logika `parseTenantFromHostname` menangani banyak skenario deployment (localhost multi-port, Cloud Run, Netlify, Vercel, custom domain) dengan cukup rapi dan konsisten dengan logika serupa di `lib/tenant-authorization.ts` (walau — lihat temuan di bawah — terduplikasi).
- Cache in-memory 60 detik untuk lookup tenant mengurangi beban query DB di middleware yang dieksekusi di **setiap request** — pertimbangan performa yang tepat mengingat middleware adalah *hot path*.

### 🔴 Poin Temuan / Catatan Perbaikan

**[MEDIUM] Duplikasi logika resolusi tenant antara `packages/shared/tenant.ts` + `packages/shared/index.ts` dengan `lib/tenant-authorization.ts` (`normalizeRequestHost`).** Kedua implementasi punya aturan yang **hampir sama tapi ditulis ulang secara terpisah** (deteksi `.localhost`, `.a.run.app`, parsing subdomain admin/owner). Risiko *maintenance*: jika suatu saat aturan berubah (misalnya menambah platform hosting baru), developer harus ingat mengubah **di dua tempat**, dan kalau lupa satu, muncul inkonsistensi resolusi tenant antara middleware dan authorization layer — yang bisa berujung ke *bypass* halus.

**Rekomendasi:** Satukan menjadi 1 sumber kebenaran (single source of truth), misalnya `parseTenantFromHostname` di `packages/shared` dipakai ulang oleh `lib/tenant-authorization.ts`, bukan diimplementasikan ulang sebagai `normalizeRequestHost`.

**[MEDIUM] Fallback "latest active tenant" muncul lagi di sini** (baris 142–153) — temuan yang sama seperti di §1, dengan risiko yang sama (silent wrong-tenant routing untuk custom domain yang tidak match). Lihat rekomendasi di §1.

**[LOW] Cache in-memory module-level (`tenantCache`)** hanya efektif jika Next.js middleware berjalan di runtime Node.js persisten. Jika di-deploy sebagai Edge Function murni (tergantung konfigurasi `runtime` di masing-masing app), setiap invocation bisa mendapat instance memori baru, membuat cache ini kurang efektif (bukan bug fatal, tapi asumsi performanya perlu divalidasi sesuai target deployment akhir).

**[LOW]** `resolveTenantMiddleware` pada blok `catch` (baris 179–196) memiliki fallback ke tenant default (`process.env.NEXT_PUBLIC_TENANT_ID`) ketika **koneksi database gagal total** — untuk `slug === 'taj-saas' || isLocalhost`. Ini masuk akal untuk resiliency saat DB sempat down di staging, tapi pastikan behavior ini **tidak pernah aktif di produksi multi-tenant nyata** (saat ini sudah dibatasi kondisinya, cukup aman, hanya perlu dipastikan `NEXT_PUBLIC_TENANT_ID` tidak pernah diset di env produksi multi-tenant).

### 🎯 Rating Kesiapan Produksi: **70%**

---

## 8️⃣ `apps/customer/app/api/orders/route.ts` (352 baris) — Checkout Storefront

### Fungsi Utama
Endpoint `POST` pembuatan order dari Customer Storefront: validasi input, kalkulasi harga server-side via `calculateOrderPricing`, idempotency key + fingerprint hash, transaksi atomik (order + order items + outbox event), dan penerbitan cookie kepemilikan order.

### 🟢 Poin Keunggulan — **Ini salah satu berkas terbaik dalam audit ini**
- **Idempotency yang sangat matang**: kombinasi `idempotencyKey` unik per-tenant di level DB (`uniqueIndex`) **+** *canonical fingerprint hash* dari seluruh payload (`idempotencyRequestHash`) **+** perbandingan `crypto.timingSafeEqual` (mencegah *timing attack*) untuk validasi replay. Ini menangani dengan baik skenario *double-submit* akibat retry jaringan tanpa membuat order duplikat, sekaligus mendeteksi jika idempotency key yang sama dipakai ulang untuk payload yang **berbeda** (mencegah *replay abuse*).
- **Penanganan race condition di level DB** (`catch` kode error PostgreSQL `23505` — unique violation) untuk kasus dua request paralel dengan idempotency key sama, lalu fallback membaca ulang baris yang sudah ter-insert — pola *insert-or-fetch* yang benar untuk concurrency tinggi.
- **Transactional Outbox Pattern** (`schema.outboxEvents`) untuk event `order.created` — praktik arsitektur *event-driven* yang solid, memastikan event tidak hilang meski proses dispatch (notifikasi WA/webhook, dsb.) gagal, karena tercatat dulu dalam transaksi yang sama dengan order.
- Validasi input cukup ketat: format nomor HP Indonesia (`08xx`/`+62xx`), panjang nama minimal, `orderType` di-*whitelist*, alamat wajib untuk delivery.
- Harga **100% dihitung ulang di server** via `calculateOrderPricing` — tidak ada satu pun nilai uang yang dipercaya dari body request klien.
- Cookie token kepemilikan order (`cust_tok_${orderCode}`) diset `httpOnly`, `secure` (produksi), `sameSite: 'lax'` — konfigurasi cookie aman standar.

### 🔴 Poin Temuan / Catatan Perbaikan

**[LOW] Dispatch outbox non-blocking tanpa timeout eksplisit** (baris 308–317):
```ts
fetch(`${new URL(request.url).origin}/api/internal/outbox/dispatch`, {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.CRON_SECRET || ""}` },
}).catch(() => {});
```
Jika `process.env.CRON_SECRET` tidak diset, header `Authorization` menjadi `"Bearer "` (string kosong) — bukan bug fatal karena hanya trigger *best-effort* (ada *scheduled sweeper* sebagai cadangan sesuai komentar), tapi sebaiknya tambahkan `AbortController`/timeout agar *dangling promise* ini tidak menumpuk pada beban tinggi, dan log kalau `CRON_SECRET` kosong di produksi (indikasi misconfiguration).

**[LOW] Penggabungan `paymentMethod: "qris"` menjadi `"transfer"` saat disimpan** (baris 132, 247): `storedPaymentMethod = paymentMethod === "qris" ? "transfer" : paymentMethod`. Ini menyebabkan laporan/rekap pembayaran di dashboard Owner (jika mengelompokkan berdasarkan `paymentMethod`) **tidak bisa membedakan QRIS vs transfer bank manual** — berpotensi bias pada laporan keuangan/preferensi metode bayar pelanggan. Jika ini disengaja (karena keduanya diverifikasi manual dengan bukti transfer yang sama), sebaiknya didokumentasikan jelas di komentar kode dan di dashboard laporan Owner supaya tidak disalahartikan sebagai bug data.

**[LOW] Rate limiting berbasis IP murni** (`clientIp` dari `x-forwarded-for`) — lihat juga temuan §4. Untuk order dengan nilai signifikan, pertimbangkan menambah rate-limit sekunder berbasis `customerPhone`/`customerToken` untuk mengurangi risiko *abuse* dari banyak IP (misal jaringan proxy/VPN rotating).

**[LOW]** Tidak ada validasi batas atas jumlah `items` (lihat juga temuan §2 pada `pricing-service.ts`) sebelum diteruskan ke `calculateOrderPricing`.

### 🎯 Rating Kesiapan Produksi: **90%** — kualitas terbaik di antara berkas yang diaudit.

---

## 9️⃣ `apps/admin/app/actions.ts` (1162 baris) — Server Actions POS/KDS

### Fungsi Utama
Kumpulan *server actions* untuk Admin POS: manajemen order, verifikasi pembayaran, buka/tutup shift kasir, toggle ketersediaan menu/topping, buka/tutup toko, pembuatan order POS offline (`createOfflineOrderAction`), review pembatalan order, dsb. Difokuskan audit pada `createOfflineOrderAction` (baris 819–958) sebagai jalur uang paling kritis di app ini.

### 🟢 Poin Keunggulan
- **Setiap action tanpa kecuali memanggil `requireTenantPermission(...)` di baris pertama** — pola konsisten dan mudah diaudit (`grep` di seluruh file menunjukkan 100% action memakai guard ini, tidak ada yang "terlupa"). Ini adalah tanda arsitektur otorisasi yang disiplin.
- `createOfflineOrderAction` **mengabaikan `data.totalPrice` yang dikirim dari klien** — meskipun parameter itu ada di *interface* input, nilai final tetap dihitung ulang dari `calculateOrderPricing`. Ini konsisten dengan prinsip anti price-bypass yang sama seperti di app Customer — kasir nakal/klien yang dimodifikasi tidak bisa memaksa total harga custom.
- Transaksi atomik (`db.transaction`) mencakup insert order + order items + payment transaction + shift log + audit log — konsisten dan *all-or-nothing*.
- Audit log ditulis untuk aksi kritis (`pos_order_created`) dengan `userId` pelaku — baik untuk akuntabilitas.

### 🔴 Poin Temuan / Catatan Perbaikan

**[MEDIUM] Pencarian shift aktif tidak difilter per-cabang (`branchId`)** (baris 918–925):
```ts
const activeShifts = await tx.select().from(schema.shifts)
  .where(and(eq(schema.shifts.tenantId, tenant.id), eq(schema.shifts.status, "open")))
  .limit(1); // ⚠️ tidak ada filter branchId
```
Jika sebuah tenant punya **lebih dari satu cabang yang beroperasi bersamaan**, masing-masing dengan shift kasir sendiri yang sedang `open`, query ini hanya mengambil **shift pertama yang ditemukan** (urutan tidak dijamin tanpa `ORDER BY`), bukan shift milik cabang tempat order POS ini dibuat. Akibatnya, pencatatan `cash_in` di `shiftLogs` bisa masuk ke shift **cabang yang salah**, membuat laporan tutup kas (*cash reconciliation*) per cabang menjadi tidak akurat.

**Rekomendasi:**
```ts
const activeShifts = await tx.select().from(schema.shifts)
  .where(and(
    eq(schema.shifts.tenantId, tenant.id),
    eq(schema.shifts.branchId, currentBranchId), // tambahkan konteks cabang aktif kasir
    eq(schema.shifts.status, "open")
  ))
  .limit(1);
```
(Catatan: perlu memastikan konteks `branchId` kasir yang sedang login tersedia — kemungkinan dari `profile.branchId` hasil `requireTenantPermission`.)

**[LOW] `paymentStatus: "paid"` diset langsung tanpa jeda verifikasi untuk `paymentMethod === "transfer"`** (baris 883, dalam konteks POS/kasir tatap muka) — untuk transaksi tatap muka via kasir ini wajar (kasir yang memverifikasi bukti transfer secara langsung), namun pastikan ada *audit trail* bukti (`paymentProofUrl`) yang **wajib diisi** untuk metode `transfer`, bukan opsional (`paymentProofUrl?: string | null` saat ini opsional di *type* input, baris 827) — untuk mencegah kasir mencatat pembayaran "lunas" tanpa bukti yang tersimpan.

**[LOW] File berukuran 1162 baris dalam satu modul** — dari sisi *clean code/modularitas*, sebaiknya dipecah menjadi beberapa modul per domain (`orders.actions.ts`, `shifts.actions.ts`, `menu.actions.ts`, `cancellations.actions.ts`) agar lebih mudah dinavigasi, di-*review*, dan di-*test* secara terisolasi — terutama karena ini adalah *server actions* yang seluruhnya berada di *trust boundary* kritis (permission-sensitive).

### 🎯 Rating Kesiapan Produksi: **80%** (untuk bagian yang diaudit; disiplin otorisasi sangat baik, perlu perbaikan pada isolasi shift per-cabang)

---

## 🔟 `apps/owner/app/actions/authActions.ts` (219 baris) — Registrasi Owner Baru

### Fungsi Utama
Server action pendaftaran bisnis baru: membuat `tenant`, `branch` utama, akun `user` via Better Auth, `profile` dengan role `owner`, seed kategori & menu contoh, dengan mekanisme *compensating rollback* jika terjadi kegagalan di tengah proses.

### 🟢 Poin Keunggulan
- **Pola *compensating transaction* (Saga pattern sederhana)** untuk menangani kegagalan parsial: jika insert `user`/`profile` gagal setelah `tenant`+`branch` terlanjur dibuat, sistem menghapus balik `tenant` dan `branch` yang sudah sempat ter-insert (baris 203–213) — pola yang tepat mengingat `auth.api.signUpEmail` dan `db.insert` untuk tenant tidak berada dalam satu transaksi DB yang sama (Better Auth mengelola koneksinya sendiri).
- Validasi password minimal 8 karakter dan pre-flight check email duplikat sebelum proses insert dimulai — mengurangi kemungkinan *partial insert* yang butuh rollback.
- Generasi slug unik dengan mekanisme *retry* bernomor (`-1`, `-2`, ...) dan batas iterasi (`count <= 20`) mencegah *infinite loop*.
- Kegagalan seeding menu awal (baris 194–196) sengaja **tidak** menggagalkan keseluruhan pendaftaran (`console.warn`, bukan `throw`) — keputusan desain yang tepat karena seed data bersifat *nice-to-have*, bukan kritikal untuk keberhasilan pendaftaran akun.

### 🔴 Poin Temuan / Catatan Perbaikan

**[HIGH — terkait langsung dengan Temuan Kritis §1]** Baris `await db.update(schema.user).set({ role: "owner" }).where(...)` (baris 139) menyetel **role global** pada tabel `user` (bukan hanya `profiles.role` yang sudah tenant-scoped di baris 141–147). Field `role` pada `user` ini yang kemudian **disalahgunakan** oleh logika *auto-provisioning* di `lib/tenant-authorization.ts`. 

**Rekomendasi:** Setelah temuan kritis §1 diperbaiki (blok auto-provisioning dihapus), pertimbangkan juga apakah `schema.user.role` global ini **masih diperlukan sama sekali**. Karena role sesungguhnya sudah tersimpan dengan benar (tenant-scoped) di `schema.profiles.role`, field global di `user` berisiko menjadi sumber *state ganda yang tidak sinkron* (misalnya: user jadi Owner di Tenant A, lalu di-*downgrade* jadi kasir di Tenant B — role global mana yang benar?). Sebaiknya field global ini dihapus/dijadikan hanya metadata non-otoritatif (misalnya untuk keperluan UI onboarding saja), dan **tidak pernah** dipakai sebagai basis keputusan otorisasi di mana pun dalam kode.

**[MEDIUM] Rollback tidak dibungkus transaksi DB tunggal** (baris 203–213) — setiap `db.delete(...)` dieksekusi sebagai statement terpisah. Jika salah satu langkah rollback ini sendiri gagal (misalnya koneksi DB putus di tengah proses rollback), sistem bisa meninggalkan data "yatim" (`tenant` tanpa `user`/`profile`, atau `branch` tanpa `tenant` yang valid). Untuk operasi *destructive* multi-langkah seperti ini, idealnya dibungkus `db.transaction(async (tx) => {...})` juga, walau tetap terpisah dari transaksi `auth.api.signUpEmail` (yang memang di luar kendali Drizzle transaction).

**[LOW] Tidak ada rate limiting eksplisit pada endpoint registrasi ini** — berbeda dengan pembuatan order yang sudah dilindungi `rateLimiter.check(..., "order_creation")`. Endpoint registrasi (yang membuat *tenant baru* + mengirim email, jika verifikasi email aktif) rawan disalahgunakan untuk spam pembuatan tenant palsu. Rekomendasi: tambahkan preset baru, misalnya `RATE_LIMIT_PRESETS.tenant_registration = { limit: 3, windowSec: 3600 }`.

### 🎯 Rating Kesiapan Produksi: **60%** (pola Saga/rollback baik, tapi terkait langsung dengan akar temuan kritis di §1 — root cause dari role global yang bocor lintas tenant)

---

## 📊 RINGKASAN RATING PER BERKAS

| Berkas | Fokus Audit | Rating Kesiapan Produksi |
|---|---|---|
| `lib/tenant-authorization.ts` | Otorisasi Multi-Tenant | 🔴 **35%** — Kritis, wajib fix sebelum go-live |
| `lib/server/pricing-service.ts` | Pricing Engine | 🟡 75% |
| `lib/auth.ts` | Better Auth Config | 🟢 80% |
| `lib/server/rate-limiter.ts` | Rate Limiting | 🟡 65% |
| `packages/db/schema.ts` | Skema Database | 🟢 80% |
| `packages/db/index.ts` | Koneksi DB | 🟢 80% |
| `packages/shared/tenant.ts` + `index.ts` | Tenant Resolution Middleware | 🟡 70% |
| `apps/customer/app/api/orders/route.ts` | Checkout Storefront | 🟢 **90%** — Terbaik |
| `apps/admin/app/actions.ts` (POS actions) | POS/KDS Server Actions | 🟢 80% |
| `apps/owner/app/actions/authActions.ts` | Registrasi Owner | 🟡 60% |

### 🎯 **Rating Kesiapan Produksi Keseluruhan (berkas yang diaudit): 68%**

**Catatan penting:** Angka ini akan **turun drastis menjadi setara Not-Production-Ready** selama Temuan Kritis di §1 belum diperbaiki, karena satu celah *cross-tenant privilege escalation* cukup untuk membatalkan kelayakan produksi seluruh sistem multi-tenant, terlepas seberapa baik kualitas berkas-berkas lainnya. Setelah temuan kritis diperbaiki dan temuan High lain (rate-limiter fail-open, katalog hardcoded di pricing engine) diselesaikan, sistem ini secara arsitektur **cukup solid** untuk menuju produksi — pola idempotency, transactional outbox, dan disiplin RBAC di `apps/admin/app/actions.ts` termasuk implementasi yang matang untuk ukuran SaaS multi-tenant.

---

## ✅ Prioritas Perbaikan (Actionable Checklist)

1. 🔴 **[P0 — Blocker]** Hapus/perbaiki mekanisme auto-provisioning owner lintas tenant di `lib/tenant-authorization.ts` (§1).
2. 🟠 **[P1]** Hilangkan `STATIC_CATALOGUE_FALLBACK` hardcoded dari `pricing-service.ts` generik (§2).
3. 🟠 **[P1]** Perbaiki dokumentasi vs implementasi *fail-open* pada `rate-limiter.ts`, pastikan Upstash **wajib** dan tervalidasi saat boot di produksi (§4).
4. 🟠 **[P1]** Batasi/hapus fallback "latest active tenant" untuk lookup tenant yang gagal di produksi (§1, §7).
5. 🟡 **[P2]** Satukan duplikasi logika `parseTenantFromHostname` antara `packages/shared` dan `lib/tenant-authorization.ts` (§7).
6. 🟡 **[P2]** Perbaiki isolasi shift-per-cabang pada `createOfflineOrderAction` (§9).
7. 🟡 **[P2]** Pertimbangkan RLS PostgreSQL sebagai lapisan pertahanan kedua untuk isolasi tenant (§5).
8. 🟢 **[P3]** Modularisasi `apps/admin/app/actions.ts` (1162 baris) menjadi beberapa berkas per domain (§9).
9. 🟢 **[P3]** Perketat `trustedOrigins` Better Auth (hindari wildcard platform publik luas) (§3).

---

*Laporan ini mencakup audit mendalam terhadap 10 berkas inti (semua berkas `lib/` dan `packages/db`+`packages/shared`, ditambah 3 jalur kritis di `apps/`). Untuk cakupan penuh seluruh 134 berkas di `apps/`, saya siap melanjutkan audit dalam batch berikutnya sesuai prioritas yang Anda tentukan (misalnya seluruh dashboard Owner, atau seluruh komponen KDS Admin).*
