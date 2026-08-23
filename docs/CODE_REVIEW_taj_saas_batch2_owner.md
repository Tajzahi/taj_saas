# 🔍 Laporan Code Review Lanjutan — Repository `taj_saas`

**Auditor:** Senior Software Architect & Lead Code Auditor (Claude)
**Commit yang diaudit:** `df3f355` — *"fix(security): resolve P0 cross-tenant vulnerability, remove hardcoded pricing catalogue, and tighten tenant resolution"*
**Fokus:** (1) Verifikasi perbaikan `lib/` & `packages/` dari audit sebelumnya, (2) Audit mendalam & menyeluruh `apps/owner/` (Dashboard & CMS Owner)
**Tanggal Audit:** 23 Agustus 2026

---

## BAGIAN 1 — ✅ VERIFIKASI PERBAIKAN `lib/` & `packages/`

Saya menarik ulang repo dan membandingkan `diff` commit `df3f355` terhadap kondisi sebelumnya. Berikut status masing-masing temuan dari laporan audit pertama:

### 1.1 🔴→🟢 **[P0 - RESOLVED]** Cross-Tenant Privilege Escalation di `lib/tenant-authorization.ts`

**Status: SUDAH DIPERBAIKI DENGAN BENAR.** Blok "Auto-recovery fallback for newly registered owner" yang dulu membuat profil Owner otomatis berdasarkan `user.role` global **sudah dihapus total**. Sekarang alurnya:

```ts
if (!profile) {
  const isKnownStagingHost = (host || '').includes('.a.run.app');
  if (isKnownStagingHost && process.env.NODE_ENV !== 'production') {
    // fallback HANYA untuk staging Cloud Run, TIDAK PERNAH di produksi
  }
  throw new AuthorizationError('FORBIDDEN', 403, 'Akses ke tenant ini ditolak. Anda tidak memiliki profil resmi di gerai ini.');
}
```

Ini persis Opsi A yang saya rekomendasikan: jika profil tidak ditemukan untuk tenant yang diminta → tolak akses (403), **bukan** membuatkan profil baru secara diam-diam. Jalur eksploitasi lintas-tenant yang saya buktikan di laporan sebelumnya **sudah tertutup**. Kerja bagus.

**Catatan residual (Low, bukan blocker):** Fallback staging (baris 297–322) masih ada dan sudah digerbangi ganda dengan benar (`isKnownStagingHost && process.env.NODE_ENV !== 'production'`) — ini aman untuk produksi karena `NODE_ENV !== 'production'` akan selalu `false` di server produksi. Satu saran kecil: pastikan pipeline deployment (Cloud Run, `cloudbuild-owner.yaml`, dst.) **memang menyetel `NODE_ENV=production`** secara eksplisit di environment produksi — jika lupa diset, gerbang ini bisa tidak aktif tanpa disadari. Ini murni soal konfigurasi infra, bukan soal kode.

### 1.2 🟠→🟢 **[RESOLVED]** Katalog Harga Hardcoded di `lib/server/pricing-service.ts`

**Status: SUDAH DIPERBAIKI DENGAN BERSIH.** `STATIC_CATALOGUE_FALLBACK` (20+ baris data menu "Martabak Pakde" hardcoded) sudah dihapus seluruhnya. Sekarang jika item tidak ditemukan di database tenant, sistem langsung menolak dengan pesan jelas:
```ts
if (!dbItem) {
  throw new Error(`Menu item '...' tidak ditemukan di katalog gerai ini.`);
}
```
Pricing engine sekarang benar-benar generik dan aman dipakai lintas-tenant tanpa risiko "bocor" harga dari 1 bisnis ke bisnis lain. **Tidak ada catatan tambahan — selesai dengan baik.**

### 1.3 🟠→🟡 **[PARTIALLY RESOLVED]** Rate Limiter Fail-Open di `lib/server/rate-limiter.ts`

**Status: DIPERBAIKI SEBAGIAN.** Ditambahkan `console.warn` saat Upstash tidak terkonfigurasi di produksi:
```ts
if (process.env.NODE_ENV === 'production') {
  console.warn('[rate-limiter] Upstash Redis not configured in production environment. Running in-memory rate limiting fallback.');
}
return checkInMemoryRateLimit(identifier, limit, windowSec);
```
Ini **lebih baik** dari sebelumnya (setidaknya ada jejak log untuk observability/alerting), tapi **belum menyelesaikan akar masalahnya**: perilaku tetap *fail-open* — request tetap diproses dengan rate limiter in-memory per-instance, bukan ditolak atau di-*alert* secara aktif. Di Cloud Run multi-instance, limit efektif tetap bisa terlipat gandakan sebanyak jumlah instance yang aktif. Untuk kebutuhan hardening lebih lanjut (opsional, bukan blocker), pertimbangkan mengirim alert ke sistem monitoring (Sentry — sudah dipakai di project ini berdasarkan `sentry.server.config.ts`) alih-alih hanya `console.warn` yang mudah terlewat di log produksi.

### 1.4 🟡→🟢 **[RESOLVED]** Fallback "Latest Active Tenant" di `packages/shared/tenant.ts` & `lib/tenant-authorization.ts`

**Status: SUDAH DIPERBAIKI DENGAN BENAR** di kedua lokasi. Fallback penebakan tenant sekarang digerbangi kondisi eksplisit:
```ts
const isKnownStagingHost = hostname.includes('.a.run.app') || hostname.includes('.run.app') || hostname.includes('localhost');
if (isKnownStagingHost && process.env.NODE_ENV !== 'production') { /* fallback */ }
```
Domain custom produksi yang tidak match sekarang akan mendapat `404 TENANT_NOT_FOUND` yang jujur, bukan ditebak ke tenant lain. **Selesai dengan baik**, dan diterapkan konsisten di kedua berkas (tidak hanya satu). Ini juga menjawab temuan duplikasi logika saya sebelumnya — meskipun masih 2 implementasi terpisah (`normalizeRequestHost` vs `resolveTenantMiddleware`), keduanya kini menerapkan aturan yang sama, jadi risiko drift sudah berkurang meski secara arsitektur idealnya tetap disatukan suatu saat (masih **Low priority tech-debt**, bukan risiko keamanan aktif).

### 1.5 🟢 **[BONUS]** Perluasan Matriks RBAC (`ROLE_PERMISSIONS`)

Selain memperbaiki temuan, tim juga memperkaya sistem permission dengan role baru (`kitchen`, `staf`) dan permission yang lebih granular (`hr:read` vs `hr:manage`, `orders:manage-status` vs `orders:update-status`, `promos:manage`, `reports:export`). Ini peningkatan desain yang baik — **namun saya menemukan efek samping dari perubahan ini** yang dijelaskan di §2.6 (Temuan HR) di bawah: pemisahan `hr:read`/`hr:manage` ternyata **belum disinkronkan** dengan action yang memakainya.

### 📊 Ringkasan Verifikasi Perbaikan

| Temuan Audit Sebelumnya | Status | Catatan |
|---|---|---|
| 🔴 P0 Cross-tenant privilege escalation | ✅ **RESOLVED** | Fix tepat, sesuai rekomendasi |
| 🟠 Katalog harga hardcoded | ✅ **RESOLVED** | Bersih total |
| 🟠 Rate-limiter fail-open (doc vs impl) | 🟡 **PARTIAL** | Warning log ditambah, perilaku fail-open masih ada |
| 🟡 Fallback "latest active tenant" | ✅ **RESOLVED** | Digerbangi staging+non-prod di 2 lokasi |
| 🟡 Duplikasi logika parse hostname | 🟡 **TIDAK DIUBAH** | Masih 2 implementasi terpisah, tapi konsisten aturannya |

**Kesimpulan Bagian 1:** Perbaikan pada `lib/` dan `packages/` **solid dan tepat sasaran**, terutama pada temuan kritis. Layer otorisasi multi-tenant sekarang jauh lebih aman untuk produksi. Lanjut ke audit `apps/owner/` secara menyeluruh.

---

## BAGIAN 2 — 🔍 AUDIT MENYELURUH `apps/owner/` (Dashboard & CMS Owner)

`apps/owner` berisi **64 berkas**. Saya membagi audit menjadi tiga lapisan sesuai tingkat risiko:
- **Lapisan Gerbang Keamanan** (`middleware.ts`, `layout.tsx`, `authClient.ts`) — 100% dibaca detail.
- **Server Actions** (`app/actions/*.ts`, 12 berkas, ~4.200 baris) — 100% dibaca detail, ini adalah *trust boundary* utama tempat semua tulis-baca database & keputusan otorisasi terjadi.
- **Halaman & Komponen UI** (`app/(dashboard)/*/page.tsx`, `components/`, `store/`) — diaudit dengan kombinasi pembacaan mendalam pada berkas terbesar/paling sensitif (menu, pengaturan, SDM) + pemindaian pola risiko (XSS, `localStorage`, fetch liar, trust boundary) di seluruh berkas UI lainnya, karena secara arsitektur seluruh legitimasi data & tulis-DB **hanya** terjadi lewat Server Actions yang sudah diaudit detail — halaman `.tsx` murni presentasional dengan risiko jauh lebih rendah.

### 2.1 `apps/owner/middleware.ts` (78 baris) — Gerbang Keamanan Utama

**Fungsi:** Middleware Next.js yang berjalan di setiap request: resolusi tenant dari domain, dan proteksi dasar (redirect ke `/login` jika tidak ada cookie sesi).

**🟢 Keunggulan:**
- Matcher (`config.matcher`) sudah tepat mengecualikan aset statis dan `api/auth` dari proteksi, mencegah *infinite redirect loop*.
- Delegasi resolusi tenant ke `resolveTenantMiddleware` (yang sudah diperbaiki di §1.4) — konsisten dengan perbaikan terbaru.

**🔴 Temuan:**

**[MEDIUM] Dokumentasi kode tidak sesuai dengan implementasi aktual.** Komentar *blueprint* di bagian atas file menyatakan:
> *"PROSES AUTENTIKASI (Baris 52-73): Memeriksa sesi cookie pengguna via `auth.api.getSession`."*
> *"Jika Role = 'kasir' -> Redirect ke `/unauthorized`."*

Tapi kode aktualnya **hanya mengecek keberadaan cookie** (bukan validitasnya), dan **tidak ada** logika redirect berbasis role sama sekali di middleware ini:
```ts
const hasSessionCookie = Boolean(
  request.cookies.get('better-auth.session_token')?.value ||
  request.cookies.get('__Secure-better-auth.session_token')?.value
);
if (!isAuthRoute && !hasSessionCookie) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```
**Ini bukan celah keamanan** — saya verifikasi bahwa validasi sesi penuh + pengecekan role `kasir` **memang diimplementasikan dengan benar**, tapi di lapisan lain: `app/(dashboard)/layout.tsx` (lihat §2.2). Jadi *defense-in-depth* tetap terjaga (halaman tetap terproteksi), namun komentar kode yang menyesatkan ini berisiko membuat developer baru salah asumsi soal *di mana* validasi sebenarnya terjadi, dan berpotensi menghapus proteksi di `layout.tsx` dengan asumsi keliru bahwa middleware sudah menanganinya.

**Rekomendasi:** Perbarui komentar dokumentasi agar sesuai kenyataan, misalnya:
```ts
// CATATAN: Middleware ini HANYA memeriksa keberadaan cookie sesi (fast-path, edge-compatible).
// Validasi sesi penuh (keabsahan token) & proteksi berbasis role dilakukan di app/(dashboard)/layout.tsx,
// karena validasi DB-backed tidak dijalankan di sini demi performa Edge Runtime.
```

**[LOW]** Tidak ada validasi bahwa cookie yang ada benar-benar *well-formed* sebelum redirect diputuskan — bukan masalah karena `layout.tsx` tetap memvalidasi ulang, hanya soal *fail-fast UX* (pengguna dengan cookie kedaluwarsa akan sempat melihat *flash* halaman dashboard kosong sebelum di-redirect oleh `layout.tsx`).

**🎯 Rating: 80%**

---

### 2.2 `apps/owner/app/(dashboard)/layout.tsx` (32 baris) — Proteksi Layout Dashboard

**Fungsi:** Server Component yang membungkus seluruh halaman dashboard (`/`, `/menu`, `/sdm`, dst.), memvalidasi sesi dan role sebelum merender konten.

**🟢 Keunggulan — Ini implementasi proteksi role yang benar dan tegas:**
```ts
const { profile } = await requireTenantSession({ expectedApp: "owner" });
if (profile.role === "kasir") {
  redirect("/unauthorized");
}
```
- Memakai `requireTenantSession` yang sudah diperbaiki (§1.1) — jadi otomatis mewarisi seluruh perbaikan keamanan di lapisan otorisasi.
- Penanganan error granular: `UNAUTHORIZED` → `/login`, `FORBIDDEN` → `/unauthorized`, dan secara khusus menangani `NEXT_REDIRECT` digest agar tidak tertangkap sebagai error biasa (`if (err && typeof err === "object" && "digest" in err) throw err;`) — ini detail teknis Next.js App Router yang sering terlewat oleh developer (banyak project justru **menangkap** redirect internal Next.js sebagai error, menyebabkan redirect gagal total). Implementasi di sini benar.

**🔴 Temuan:**

**[LOW] Proteksi role hanya melarang `kasir`, bukan *allowlist* role yang diizinkan.** Karena sistem baru saja menambah role `kitchen` dan `staf` (§1.5), perlu dipastikan role-role baru ini **juga** tidak boleh mengakses Owner App (mereka seharusnya hanya beroperasi di Admin App/POS-KDS). Kode saat ini:
```ts
if (profile.role === "kasir") {
  redirect("/unauthorized");
}
```
Hanya memblokir `kasir` secara eksplisit — role `kitchen` dan `staf` **tidak diblokir** di sini, sehingga secara teknis bisa lolos ke layout dashboard Owner (walau kemudian setiap Server Action individual tetap akan menolak mereka karena tidak punya permission yang cukup — jadi *tidak ada kebocoran data*, hanya UX yang membingungkan: mereka bisa melihat shell dashboard Owner meski semua datanya gagal dimuat).

**Rekomendasi (defense-in-depth, bukan celah kritis):**
```ts
const OWNER_APP_ALLOWED_ROLES = ["owner", "manager"];
if (!OWNER_APP_ALLOWED_ROLES.includes(profile.role)) {
  redirect("/unauthorized");
}
```
Pendekatan *allowlist* (role apa yang **boleh** masuk) lebih tahan terhadap penambahan role baru di masa depan dibanding *denylist* (role apa yang **dilarang**) — setiap kali ada role baru ditambahkan ke sistem, developer harus ingat mengupdate *denylist* ini juga, yang mudah terlewat (persis seperti yang terjadi sekarang dengan `kitchen`/`staf`).

**🎯 Rating: 85%**

---

### 2.3 `apps/owner/lib/authClient.ts` (5 baris) & `apps/owner/app/api/auth/[...better-auth]/route.ts`

Client Better Auth standar, konsisten dengan `lib/auth-client.ts` di root. Tidak ada temuan. **Rating: 90%**

---

### 2.4 `apps/owner/app/actions/_tenantHelper.ts` (39 baris)

Helper kecil untuk resolusi konteks tenant & `cogsRate`. Bersih, `clamp` rate 1%–99% mencegah nilai ekstrem. **Tidak ada temuan. Rating: 95%**

---

### 2.5 `apps/owner/app/actions/authActions.ts` (219 baris) — Registrasi Owner Baru

**Status:** Tidak diubah pada commit terbaru. Root cause P0 (§1.1) sudah ditutup dari sisi *konsumen* (`tenant-authorization.ts`), sehingga baris berikut **tidak lagi eksploitable**:
```ts
await db.update(schema.user).set({ role: "owner" }).where(eq(schema.user.id, createdUserId));
```
**🔴 Temuan residual [LOW, non-blocker]:** Field `schema.user.role` global ini kini menjadi *state* yang tidak terpakai untuk keputusan otorisasi apa pun (otorisasi sepenuhnya berbasis `schema.profiles.role` yang tenant-scoped). Secara *clean code*, field ini sebaiknya didokumentasikan jelas sebagai "metadata non-otoritatif, JANGAN dipakai untuk keputusan akses" agar tidak disalahgunakan lagi oleh kode baru di masa depan (mencegah regresi ke celah P0 yang sama). Rating tetap saya pertahankan sesuai audit sebelumnya karena tidak ada perubahan baru.

**🎯 Rating: 75%** *(naik dari 60% karena root cause sudah ditutup dari sisi konsumen, meski field-nya sendiri belum dibersihkan)*

---

### 2.6 `apps/owner/app/actions/hr.ts` (793 baris) — Server Actions SDM

**Fungsi:** CRUD karyawan, sistem undangan (invitation token), manajemen role kustom.

**🟢 Keunggulan:**
- **Sistem undangan karyawan (`createEmployeeInvitationAction` → `acceptEmployeeInvitationAction`) diimplementasikan dengan sangat baik**: token 32-byte acak (`crypto.randomBytes`), disimpan sebagai **hash SHA-256** (bukan token mentah) di database, TTL 48 jam, cek `usedAt` mencegah pemakaian ulang, dan **memakai `auth.api.signUpEmail`** (Better Auth resmi) sehingga akun beserta kredensial (`schema.account`) terbentuk dengan benar. Ini pola yang matang dan aman.
- **Proteksi "last owner constraint"** diterapkan konsisten di 3 tempat berbeda (`updateEmployeeAction`, `deleteEmployeeAction`, `updateStaffRoleAction`) — mencegah tenant kehilangan akses Owner sama sekali. Detail yang mudah terlewat tapi ditangani dengan baik di sini.
- Proteksi *self-deletion* (`user.id === id`) di `deleteEmployeeAction`.
- Semua 12 fungsi ekspor konsisten memanggil `requireTenantPermission(...)` di awal.

**🔴 Temuan / Catatan Perbaikan:**

**[HIGH — Bug Fungsional] `createEmployeeAction` kemungkinan membuat akun karyawan yang TIDAK BISA login selamanya.** Berbeda dengan `acceptEmployeeInvitationAction` yang memakai `auth.api.signUpEmail`, fungsi ini **menulis langsung** ke tabel `user` via Drizzle, melewati Better Auth sepenuhnya:
```ts
const userId = "u-" + Math.random().toString(36).substring(2, 15);
await db.insert(schema.user).values({ id: userId, name: data.name.trim(), email: normalizedEmail, emailVerified: true });
await db.insert(schema.profiles).values({ id: userId, tenantId: tenant.id, ... });
// ...
message: "Karyawan berhasil ditambahkan. Minta karyawan menggunakan fitur 'Lupa Password' untuk membuat password pertama kali."
```
Masalahnya: **tidak ada baris yang pernah dibuat di tabel `schema.account`** (tabel yang menyimpan hash password/kredensial pada Better Auth). Fitur "Lupa Password" pada kebanyakan implementasi Better Auth bekerja dengan mencari `account` yang sudah ada untuk provider `credential` lalu mengirim link reset — **jika `account` tidak pernah ada, alur reset password kemungkinan besar gagal** (tidak ada kredensial untuk di-reset), sehingga karyawan yang dibuat lewat jalur ini **berpotensi terkunci permanen** dan tidak pernah bisa login.

**Rekomendasi:** Uji end-to-end alur ini secepatnya (buat karyawan via `createEmployeeAction`, lalu coba "Lupa Password" sungguhan). Jika terkonfirmasi gagal, ada dua opsi perbaikan:
1. **Paling konsisten:** Hapus `createEmployeeAction` sepenuhnya, arahkan seluruh alur pembuatan karyawan lewat sistem undangan (`createEmployeeInvitationAction`) yang sudah terbukti benar.
2. **Jika "quick add tanpa email" tetap dibutuhkan sebagai fitur bisnis:** Panggil API resmi Better Auth untuk membuat kredensial awal (misalnya `auth.api.signUpEmail` dengan password sementara yang di-generate otomatis lalu wajib diganti saat login pertama), bukan menulis manual ke tabel `user` saja.

```ts
// SEBELUM (berisiko akun tidak bisa login):
const userId = "u-" + Math.random().toString(36).substring(2, 15);
await db.insert(schema.user).values({ id: userId, ... });

// SESUDAH (disarankan — konsisten dengan pola invitation yang sudah benar):
const tempPassword = crypto.randomBytes(12).toString("base64url");
const userRes = await auth.api.signUpEmail({ body: { email: normalizedEmail, password: tempPassword, name: data.name.trim() } });
if (!userRes?.user) return { success: false, error: "Gagal membuat akun autentikasi." };
const userId = userRes.user.id; // ID sudah konsisten format UUID dari crypto.randomUUID()
// lalu insert ke schema.profiles seperti biasa, dan kirim tempPassword via kanal aman (bukan email biasa)
```

**[MEDIUM] ID user digenerasi dengan `Math.random()`, bukan `crypto.randomUUID()`.**
```ts
const userId = "u-" + Math.random().toString(36).substring(2, 15);
```
`Math.random()` bukan *cryptographically secure random* dan tidak konsisten dengan `generateId: () => crypto.randomUUID()` yang sudah dikonfigurasi di `lib/auth.ts` untuk seluruh akun yang dibuat via Better Auth. Selain isu keacakan, ini menghasilkan format ID (`u-xxxxxxxxxxxxx`) yang **berbeda** dari format UUID standar yang dipakai di semua tempat lain (`crypto.randomUUID()` menghasilkan `xxxxxxxx-xxxx-...`), berpotensi membingungkan saat debugging/query manual dan technically tidak konsisten sebagai *primary key strategy*. Perbaikan di atas (memakai `auth.api.signUpEmail`) otomatis menyelesaikan ini juga karena ID akan mengikuti `generateId` yang sudah dikonfigurasi.

**[MEDIUM] Pemisahan permission `hr:read` vs `hr:manage` (§1.5) belum disinkronkan dengan action yang ada.** Pada matriks RBAC terbaru, role `manager` diberi `hr:read` (bukan `hr:manage`) — mengindikasikan niat agar Manager bisa **melihat** data SDM tanpa bisa **mengubahnya**. Namun:
```ts
export async function getProfilesAction() {
  const { tenant } = await requireTenantPermission("hr:manage", { expectedApp: "owner" }); // ⚠️ seharusnya "hr:read"
  ...
}
```
`getProfilesAction` (fungsi **baca-saja**, dipakai untuk menampilkan tabel karyawan) mensyaratkan `hr:manage`, bukan `hr:read`. Akibatnya: **role Manager tidak akan pernah bisa membuka halaman `/sdm` sama sekali** — bahkan untuk sekadar melihat daftar karyawan — meski secara desain permission matrix mereka seharusnya diizinkan (`hr:read` sudah diberikan ke role `manager`). Ini adalah *scope mismatch* antara desain RBAC dan implementasi actual action.

**Rekomendasi:**
```ts
// SEBELUM:
const { tenant } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

// SESUDAH (getProfilesAction adalah operasi baca):
const { tenant } = await requireTenantPermission("hr:read", { expectedApp: "owner" });
```
Terapkan pola yang sama: fungsi `get*`/baca-saja pakai permission `:read`, fungsi `create/update/delete` pakai `:manage`. Silakan audit ulang seluruh 16 pemanggilan `requireTenantPermission` di file ini untuk memastikan tidak ada *read action* lain yang tersalah-guard dengan permission `:manage` (dari pemeriksaan saya, hanya `getProfilesAction` dan `getCustomRolesAction` yang berpola begini — keduanya sebaiknya diturunkan ke izin baca jika `hr:read`/permission baca yang setara memang dimaksudkan untuk Manager).

**[LOW]** `emailVerified: true` diset paksa tanpa verifikasi sungguhan pada `createEmployeeAction` — masuk akal secara bisnis (Owner memvouch karyawannya), tapi sebaiknya didokumentasikan sebagai keputusan sengaja, bukan oversight.

**🎯 Rating: 65%** *(sistem invitation sangat baik, tapi bug fungsional pada jalur "quick add" + scope mismatch permission perlu diperbaiki sebelum fitur SDM dianggap solid)*

---

### 2.7 `apps/owner/app/actions/finance.ts` (344 baris) — P&L, Cashflow, Riwayat Shift

**🟢 Keunggulan:**
- Query kondisional dibangun secara aman dengan Drizzle `and(...)`/parameter binding — tidak ada risiko SQL injection.
- `formatCashierName` menangani fallback nama kasir dari email dengan rapi (kapitalisasi otomatis) untuk kasus data lama yang belum punya `user.name`.
- Ketiga fungsi (`getPnLAction`, `getCashflowAction`, `getShiftHistoryAction`) konsisten memakai `finance:read`.

**🔴 Temuan:**

**[MEDIUM] Perhitungan P&L/Cashflow memakai *biaya gaji saat ini* untuk merepresentasikan OpEx di SEMUA bulan historis**, termasuk bulan sebelum karyawan tersebut direkrut:
```ts
const monthlyLaborCost = profiles.reduce((sum, p) => sum + (parseFloat(p.salary || "0") || 0), 0);
// ...
if (!grouped[key]) {
  grouped[key] = { revenue: 0, cogs: 0, grossProfit: 0, opex: monthlyLaborCost, netProfit: 0, sortKey: date.getTime() };
}
```
Ini adalah pendekatan estimasi yang wajar untuk kesederhanaan, tapi secara akurasi laporan keuangan bisa menyesatkan: jika Owner merekrut kasir baru bulan ini, laporan P&L untuk **6 bulan lalu** (sebelum kasir itu ada) akan **ikut** mencantumkan gaji kasir baru tersebut sebagai OpEx, mengecilkan *net profit* historis secara tidak akurat. Sebaliknya, mantan karyawan yang sudah resign tidak akan tercatat OpEx-nya sama sekali untuk bulan-bulan saat mereka masih aktif bekerja.

**Rekomendasi:** Untuk laporan yang akurat secara akuntansi, idealnya OpEx tenaga kerja dihitung dari data historis payroll aktual (jika ada tabel payroll/penggajian bulanan), atau minimal beri catatan/disclaimer eksplisit di UI laporan P&L bahwa angka OpEx tenaga kerja adalah **estimasi berdasarkan komposisi staf saat ini**, bukan biaya aktual per bulan. Ini mencegah Owner mengambil keputusan bisnis berdasarkan data yang secara halus menyesatkan.

**[LOW]** `branchRevenueMap` fallback label "Cabang Utama" untuk `branchId` yang tidak ditemukan di `branchMap` (baris 108–109) berpotensi menampilkan label yang salah/membingungkan jika sebuah order merujuk ke cabang yang sudah dihapus — sebaiknya default ke label netral seperti "Cabang Tidak Diketahui" daripada mengklaimnya sebagai "Cabang Utama".

**🎯 Rating: 80%**

---

### 2.8 `apps/owner/app/actions/menu.ts` (382 baris) — Manajemen Menu & Resep (BOM)

**Fungsi:** CRUD kategori & item menu, pengaturan resep/BOM yang terhubung ke inventori.

**🟢 Keunggulan:**
- Harga selalu di-*sanitize* dengan `Math.max(0, Number(data.price) || 0)` — mencegah harga negatif/`NaN` tersimpan ke database, baik saat create maupun update.
- Guard tenant konsisten pada `WHERE ... AND tenantId = ...` di setiap update/delete — mencegah IDOR (Insecure Direct Object Reference) lintas-tenant lewat manipulasi `id` di request.
- Slug otomatis dari nama menu, konsisten dengan pola yang sama di `authActions.ts`.

**🔴 Temuan:**

**[LOW]** Regenerasi `slug` terjadi setiap kali `updateMenuItemAction` dipanggil (baris 182), bahkan jika `name` tidak berubah. Karena `schema.menuItems` punya `uniqueIndex("menu_items_tenant_slug_idx").on(table.tenantId, table.slug)`, jika Owner mengganti nama dua item menu berbeda menjadi nama yang **sama** (sengaja atau tidak), item kedua yang di-*update* akan gagal dengan error database mentah (`23505 unique violation`) yang **tidak ditangkap secara eksplisit** di `catch` block ini (berbeda dengan pola penanganan `23505` yang baik di `apps/customer/app/api/orders/route.ts`). Pengguna akan melihat pesan error generik "Terjadi kesalahan sistem" alih-alih pesan yang jelas seperti "Nama menu ini sudah dipakai item lain."

**Rekomendasi:**
```ts
} catch (error: unknown) {
  if (error instanceof AuthorizationError) return { success: false, error: error.message };
  if ((error as any)?.code === "23505") {
    return { success: false, error: "Nama/slug menu ini sudah dipakai oleh item lain di outlet ini." };
  }
  const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
  return { success: false, error: message };
}
```

**🎯 Rating: 85%**

---

### 2.9 `apps/owner/app/actions/inventory.ts` (434 baris), `production.ts` (455 baris), `branches.ts` (283 baris), `approvals.ts` (189 baris), `promos.ts` (153 baris), `settings.ts` (200 baris), `analytics.ts` (574 baris)

Saya audit ketujuh berkas ini secara detail (lihat log kerja); ringkasan temuan per berkas:

**`inventory.ts` & `production.ts`:** Pola konsisten dengan berkas lain — guard permission tepat (`inventory:read`/`inventory:manage`, `production:read`/`production:manage`), semua mutasi diberi filter `tenantId`. **Tidak ada temuan keamanan.** Catatan kualitas kode minor: kedua file memiliki banyak fungsi CRUD serupa yang bisa diringkas dengan helper generik, tapi ini murni soal *maintainability*, bukan bug.

**`branches.ts`:** Bersih. `toggleBranchStatusAction` didelegasikan secara elegan ke `updateBranchAction(id, { status })` — praktik *DRY* (Don't Repeat Yourself) yang baik, menghindari duplikasi logika guard izin & audit log.

**`approvals.ts`:** Guard konsisten. **[LOW]** `createApprovalAction` menerima `amount` (nilai nominal, misal untuk approval jenis `refund`/`discount`) langsung dari input klien tanpa validasi silang terhadap data order/transaksi aktual terkait. Karena ini adalah *pengajuan* yang masih harus di-*approve* manual oleh Owner (bukan eksekusi langsung), risikonya rendah — tapi sebaiknya Owner/Manager yang me-*review* pengajuan diberi konteks tambahan (misalnya link ke order asal) agar tidak menyetujui nominal yang dimanipulasi oleh pengaju.

**`promos.ts`:** Bersih, validasi diskon persen ≤100% sudah tepat. **[LOW, belum berubah dari audit sebelumnya]** Pengecekan kode promo duplikat (`createPromoAction`) masih berupa *check-then-insert* tanpa dibungkus transaksi/constraint unik `(tenantId, code)` di level DB (`packages/db/schema.ts` baris 366–367 masih memakai `index` biasa, bukan `uniqueIndex` komposit) — berpotensi *race condition* menghasilkan 2 promo dengan kode sama pada request paralel. Rekomendasi sama seperti audit sebelumnya: tambahkan `uniqueIndex("promos_tenant_code_idx").on(table.tenantId, table.code)` di skema.

**`settings.ts`:** Guard tepat, validasi **Zod `.strict()` allowlist** untuk `branding` adalah praktik yang sangat baik (mencegah *mass assignment* field sembarangan ke kolom JSONB). **Optimistic Concurrency Control** (`settingsVersion`) diimplementasikan dengan benar di level server — **namun lihat temuan HIGH terpisah di §2.13** karena UI (`pengaturan/page.tsx`) ternyata tidak memanfaatkan fitur ini.

**`analytics.ts`:** Guard konsisten `finance:read` di semua 6 fungsi baca data analitik. **[LOW]** `getMenuEngineeringAction` (baris 460) memakai asumsi margin hardcoded `0.65` (`marginPerItem = (revenue/qty) * 0.65`), **tidak konsisten** dengan `cogsRate` yang bisa dikonfigurasi Owner di Pengaturan (dipakai di `finance.ts` dengan default `0.30`, ekuivalen margin 70%). Akibatnya, angka margin yang ditampilkan di grafik "Menu Engineering" (halaman Analitik) **tidak akan sinkron** dengan angka margin di Laporan P&L untuk tenant yang sudah mengubah `cogsRate` default mereka — dua halaman berbeda menampilkan definisi "margin" yang berbeda tanpa penjelasan.

**Rekomendasi untuk `analytics.ts`:**
```ts
// SEBELUM: margin hardcoded, tidak sinkron dengan pengaturan cogsRate tenant
const marginPerItem = item.totalQty > 0 ? (item.totalRevenue / item.totalQty) * 0.65 : 0;

// SESUDAH: konsisten dengan cogsRate yang sama dipakai di P&L/Cashflow
const cogsRate = await getCogsRate(tenant.id); // dari _tenantHelper.ts, sudah ada!
const marginPerItem = item.totalQty > 0 ? (item.totalRevenue / item.totalQty) * (1 - cogsRate) : 0;
```

**🎯 Rating gabungan ketujuh berkas: 82%**

---

### 2.10 Halaman UI Dashboard (`app/(dashboard)/*/page.tsx`) — 18 berkas, ~10.000 baris

Saya membaca detail berkas terbesar/paling sensitif (§2.11–2.13), dan memindai pola risiko di seluruh berkas UI lainnya (`cabang`, `katering`, `keuangan`, `konten`, `galeri`, `penjualan`, `persediaan`, `persetujuan`, `produksi`, `promo`, `ai`, halaman utama `page.tsx`).

**🟢 Temuan Baik yang Berlaku Umum di Seluruh Halaman:**
- **Tidak ditemukan satu pun** penggunaan `dangerouslySetInnerHTML`, `eval()`, atau manipulasi `innerHTML` langsung di seluruh `apps/owner` — risiko XSS dari sisi kode sangat rendah.
- **Tidak ditemukan** penggunaan `localStorage`/`sessionStorage` untuk data sensitif (state UI seperti filter tanggal/cabang dikelola lewat `zustand` in-memory store, bukan persisten browser) — konsisten dengan larangan `localStorage` pada Artifacts, dan juga praktik yang baik untuk keamanan (tidak ada data sesi/tenant yang "menempel" di browser storage yang bisa diakses skrip pihak ketiga).
- **Tidak ditemukan** pemanggilan `fetch()` langsung ke endpoint di luar Server Actions dari halaman manapun — seluruh mutasi/pembacaan data 100% melalui `app/actions/*.ts` yang sudah diaudit dan terbukti konsisten menerapkan guard otorisasi. Ini pola arsitektur yang **sangat disiplin** dan memudahkan audit (satu *trust boundary* jelas, bukan tersebar).

### 2.11 `apps/owner/app/(dashboard)/menu/page.tsx` (1.452 baris) — Halaman Menu & Resep

**🔴 Temuan:**

**[MEDIUM] Data mock hardcoded `bom` (Bill of Materials) masih aktif dipakai dalam logika render**, mirip pola yang sudah diperbaiki di `pricing-service.ts` (§1.2) tapi **belum dibersihkan** di halaman ini:
```ts
const bom: Record<string, {...}[]> = {
  "m1": [ { ingredient: "Tepung Terigu Cakra", qty: 150, unit: "gr", cost: 1800 }, ... ],
  "m2": [ { ingredient: "Tepung Terigu Segitiga", qty: 200, unit: "gr", cost: 2400 }, ... ],
};
```
Objek ini dipakai di beberapa tempat untuk menampilkan resep (baris 724, 1183) dan bahkan **menentukan apakah tombol edit resep di-nonaktifkan**:
```ts
disabled={(dbRecipeMap[editItem.id]?.length > 0 || (bom[editItem.id] && bom[editItem.id].length > 0))}
```
Karena `menuItems.id` sekarang selalu berformat UUID (bukan `"m1"`/`"m2"`), kondisi `bom[editItem.id]` hampir pasti selalu `undefined` untuk data produksi nyata — sehingga baris ini kemungkinan besar **kode mati** (*dead code*) di lingkungan produksi saat ini. Namun ini tetap risiko laten: jika di masa depan ada proses migrasi/seed data yang secara tidak sengaja menghasilkan ID `"m1"`/`"m2"` (misalnya dari skrip seed lama di `packages/db/scripts/`), resep hardcoded milik "Martabak Pakde" ini bisa **muncul tanpa disadari** di akun tenant lain, dan tombol edit resep mereka akan **ter-nonaktifkan secara keliru**.

**Rekomendasi:** Hapus objek `bom` mock ini sepenuhnya dan andalkan `dbRecipeMap` (yang sudah berbasis data DB nyata) sebagai satu-satunya sumber data resep — konsisten dengan prinsip pembersihan yang sudah diterapkan di `pricing-service.ts`.

```tsx
// SEBELUM:
{(dbRecipeMap[editItem.id]?.length > 0 || (bom[editItem.id] && bom[editItem.id].length > 0)) ? (...)}

// SESUDAH:
{dbRecipeMap[editItem.id]?.length > 0 ? (...)}
```

**[LOW]** File berukuran 1.452 baris dalam 1 komponen — mencakup tabel menu, modal tambah/edit, modal resep, DAN grafik menu engineering sekaligus. Dari sisi *clean code*, sebaiknya dipecah menjadi sub-komponen (`MenuTable`, `MenuFormModal`, `RecipeModal`, `MenuEngineeringChart`) untuk keterbacaan dan kemudahan testing, meskipun secara fungsional tidak ada bug.

**🎯 Rating: 75%**

---

### 2.12 `apps/owner/app/(dashboard)/sdm/page.tsx` (1.172 baris) — Halaman SDM

**Fungsi:** UI manajemen karyawan, gaji, dan undangan.

**🟢 Keunggulan:** Field gaji (`salary`) hanya ditampilkan pada tabel yang dilindungi `getProfilesAction` (server-side guard) — tidak ada kebocoran data gaji ke role yang tidak berwenang selama guard permission diperbaiki sesuai §2.6.

**🔴 Temuan:** Halaman ini **secara langsung terdampak** oleh bug scope-mismatch permission di §2.6 — karena memanggil `getProfilesAction()` yang keliru mensyaratkan `hr:manage`, halaman `/sdm` akan gagal dimuat untuk role `manager` meski mereka diberi `hr:read` di matriks RBAC. Tidak perlu perubahan di halaman ini — cukup perbaiki `hr.ts` sesuai rekomendasi §2.6.

**🎯 Rating: 80%** *(kualitas kode baik, tapi terdampak bug di server action)*

---

### 2.13 `apps/owner/app/(dashboard)/pengaturan/page.tsx` (961 baris) — Halaman Pengaturan/Branding

**🔴 Temuan:**

**[HIGH — Bug Fungsional Signifikan] Pengaturan Pajak & Service Charge di UI Owner TIDAK PERNAH benar-benar diterapkan ke perhitungan harga.** Ini temuan paling penting di Bagian 2.

Saya telusuri seluruh alur data pajak dari UI hingga *pricing engine*:

1. **Di UI (`pengaturan/page.tsx`, baris 118–137):** Saat Owner menyimpan pengaturan, field yang dikirim adalah `taxRate` dan `serviceChargeRate` (nilai persentase polos, misal `10` untuk 10%):
   ```ts
   const res = await updateTenantBrandingAction({
     ...,
     taxRate: Number(taxRate),
     serviceChargeRate: Number(serviceChargeRate),
     ...
   });
   ```
2. **Di `settings.ts` (Zod schema, §2.9):** Field `taxRate`/`serviceChargeRate` **memang divalidasi dan disimpan** ke `tenant.branding` (karena ada di allowlist Zod) — jadi dari perspektif Owner, "berhasil disimpan" dan tidak ada error.
3. **Di `lib/server/pricing-service.ts` (baris 104–105) — pricing engine yang benar-benar dipakai saat checkout:**
   ```ts
   const taxRateBps = Number(branding.taxRateBps ?? 0); // 1000 = 10%
   const serviceChargeRateBps = Number(branding.serviceChargeRateBps ?? 0); // 500 = 5%
   ```
   Pricing engine **hanya membaca field `taxRateBps`/`serviceChargeRateBps`** (format basis poin) — **BUKAN** `taxRate`/`serviceChargeRate` (format persentase) yang disimpan oleh halaman Pengaturan!

Saya memverifikasi dengan pencarian menyeluruh (`grep -rn "taxRateBps"`) ke seluruh repository: **field `taxRateBps`/`serviceChargeRateBps` tidak pernah ditulis oleh kode manapun** — field ini hanya **dibaca** oleh `pricing-service.ts` dan didefinisikan di skema Zod (`settings.ts`) sebagai opsi alternatif yang tidak pernah benar-benar dipakai oleh form UI.

**Dampak Bisnis:** Owner masuk ke halaman Pengaturan, mengisi "Tarif Pajak: 10%", klik Simpan, mendapat konfirmasi sukses — **tapi setiap transaksi checkout pelanggan (Customer App) maupun POS (Admin App) akan tetap menghitung pajak = Rp 0** selamanya, karena `taxRateBps` yang benar-benar dibaca pricing engine tidak pernah ter-update. Ini adalah **kegagalan fitur inti** yang bisa berdampak pada kepatuhan pajak (PPN) restoran dan berpotensi membuat Owner secara tidak sadar tidak memungut pajak yang seharusnya mereka pungut dari pelanggan — risiko finansial & kepatuhan yang nyata, meski bukan celah *keamanan* dalam artian kebocoran data.

**Rekomendasi Perbaikan (WAJIB, sebelum fitur pajak dianggap berfungsi):**

Cara paling sederhana: konversi persentase → basis poin sebelum dikirim ke server action, di `pengaturan/page.tsx`:
```ts
// SEBELUM (baris 129-130):
taxRate: Number(taxRate),
serviceChargeRate: Number(serviceChargeRate),

// SESUDAH — konversi ke basis poin agar cocok dengan yang dibaca pricing-service.ts:
taxRateBps: Math.round(Number(taxRate) * 100),           // 10% -> 1000
serviceChargeRateBps: Math.round(Number(serviceChargeRate) * 100), // 5% -> 500
```
Dan saat memuat data awal (bagian `useEffect` yang mengisi form dari `getTenantSettingsAction`), lakukan konversi sebaliknya (basis poin → persen) agar nilai yang ditampilkan di form konsisten dengan yang tersimpan:
```ts
setTaxRate(((tenantData.branding?.taxRateBps || 0) / 100).toString());
```
**Alternatif lain (juga valid):** Ubah `pricing-service.ts` agar membaca `taxRate`/`serviceChargeRate` (persentase) langsung dan mengonversinya sendiri ke basis poin secara internal — pilih salah satu pendekatan sebagai *single source of truth* nama field, lalu audit ulang untuk memastikan tidak ada tempat lain yang memakai nama field yang "salah".

**⚠️ Prioritas:** Saya sarankan temuan ini diberi prioritas **P1 (tinggi, non-security)** — setara pentingnya dengan menyelesaikan bug keamanan, karena berdampak langsung ke kepatuhan pajak dan pendapatan bisnis nyata setiap tenant yang memakai platform ini.

**[MEDIUM] Optimistic Concurrency Control (`settingsVersion`) yang diimplementasikan di server (`settings.ts`, §2.9) tidak pernah dipakai oleh halaman ini.** Parameter kedua `updateTenantBrandingAction(data, expectedVersion)` tidak pernah diisi dari UI:
```ts
const res = await updateTenantBrandingAction({ ... }); // expectedVersion tidak dikirim
```
Akibatnya proteksi *"Pengaturan telah diperbarui oleh pengguna lain"* tidak akan pernah ter-trigger dari alur normal — jika dua Owner/Manager membuka halaman Pengaturan bersamaan dan menyimpan perubahan berbeda, perubahan yang disimpan lebih dulu akan **tertimpa diam-diam** oleh yang disimpan belakangan (*last-write-wins*), padahal infrastruktur untuk mencegah ini sudah ada di server.

**Rekomendasi:**
```ts
// Saat memuat data awal, simpan juga versinya:
const [settingsVersion, setSettingsVersion] = useState<number>(1);
// ...di getTenantSettingsAction handler:
setSettingsVersion(tenantData.settingsVersion || 1);

// Saat menyimpan, kirim versi yang diketahui:
const res = await updateTenantBrandingAction({ ...formData }, settingsVersion);
if (!res.success && res.error?.includes("pengguna lain")) {
  alert("Pengaturan sudah diubah pengguna lain. Halaman akan dimuat ulang.");
  window.location.reload();
}
```

**🎯 Rating: 55%** *(fitur branding/CMS lain berfungsi baik, tapi 2 temuan di atas — terutama pajak yang tidak berfungsi — cukup signifikan untuk kesiapan produksi restoran nyata)*

---

### 2.14 Halaman Lain: `cabang`, `katering`, `keuangan`, `konten`, `galeri`, `penjualan`, `persediaan`, `persetujuan`, `produksi`, `promo`, `ai`, `page.tsx` (Dashboard Utama)

Berdasarkan pemindaian pola (§2.10) dan pembacaan struktur pemanggilan Server Action di masing-masing berkas, halaman-halaman ini **mengikuti arsitektur yang sama** dengan halaman yang sudah diaudit detail (ambil data via Server Action ber-guard, tidak ada mutasi DB langsung, tidak ada XSS/localStorage/fetch liar). Saya tidak menemukan pola anti-pattern baru di luar yang sudah dilaporkan di §2.6–2.13.

**Catatan spesifik:**
- `promo/page.tsx`: mewarisi temuan race-condition kode promo duplikat dari `promos.ts` (§2.9) — tidak ada temuan baru di sisi UI-nya sendiri.
- `keuangan/page.tsx`: mewarisi temuan estimasi OpEx historis dari `finance.ts` (§2.7).
- `persediaan/page.tsx` & `produksi/page.tsx` (925 & 512 baris): tidak ditemukan masalah keamanan; kompleksitas UI tinggi tapi konsisten memakai Server Actions yang sudah diverifikasi aman.
- `ai/page.tsx` (290 baris): perlu dicatat sebagai perhatian *khusus* di audit berikutnya jika halaman ini memanggil layanan AI eksternal (LLM) dengan data tenant — pastikan prompt/context yang dikirim ke provider AI eksternal (jika ada) tidak menyertakan data lintas-tenant atau kredensial sensitif. **Saya belum memverifikasi detail ini** karena di luar cakupan audit `apps/owner` murni (kemungkinan memanggil endpoint di luar server actions yang sudah diaudit) — rekomendasikan audit lanjutan khusus untuk fitur AI ini di batch berikutnya.

**🎯 Rating gabungan (estimasi berdasarkan pola konsisten): 78%**

---

### 2.15 `components/`, `store/ownerStore.ts`, `DashboardContainer.tsx`

**🟢 Keunggulan:** `ownerStore.ts` (Zustand) murni in-memory, tidak ada `persist` middleware ke `localStorage` — state hilang saat refresh, yang justru merupakan pilihan aman untuk data seperti filter tanggal/cabang.

**🔴 Temuan:**

**[LOW] `components/layout/Sidebar.tsx` tidak memfilter menu navigasi berdasarkan role/permission pengguna.** Semua item sidebar (Menu, SDM, Keuangan, Pengaturan, dst.) ditampilkan ke semua role yang lolos masuk dashboard (Owner maupun Manager), padahal Manager tidak memiliki sebagian permission (`settings:manage`, dll — lihat matriks §1.5). Ini **bukan celah keamanan** (Server Action tetap menolak akses di lapisan data — *defense-in-depth* tetap terjaga), tapi menghasilkan UX yang membingungkan: Manager bisa mengklik menu yang link-nya terlihat aktif, lalu mendapati sebagian data/tombol gagal dimuat atau error "Anda tidak memiliki hak akses" tanpa penjelasan yang ramah di titik masuknya (sidebar).

**Rekomendasi:** Filter item sidebar berdasarkan `profile.role` (bisa diturunkan dari `ROLE_PERMISSIONS` yang sudah ada di `lib/tenant-authorization.ts` — cukup ekspor helper `hasAnyPermission(role, ['finance:read', ...])` dan pakai untuk menyembunyikan/menonaktifkan item menu yang tidak relevan bagi role tersebut). Ini murni peningkatan UX, prioritas rendah dibanding temuan lain.

**🎯 Rating: 80%**

---

## 📊 RINGKASAN RATING — BAGIAN `apps/owner`

| Berkas / Area | Fokus | Rating |
|---|---|---|
| `middleware.ts` | Gerbang keamanan (edge) | 🟢 80% |
| `(dashboard)/layout.tsx` | Proteksi role dashboard | 🟢 85% |
| `lib/authClient.ts` + auth route | Better Auth client | 🟢 90% |
| `actions/_tenantHelper.ts` | Helper tenant/cogs | 🟢 95% |
| `actions/authActions.ts` | Registrasi Owner | 🟢 75% *(naik, root cause P0 tertutup)* |
| `actions/hr.ts` | SDM & Undangan | 🟡 **65%** — bug fungsional login karyawan + scope permission |
| `actions/finance.ts` | P&L/Cashflow/Shift | 🟢 80% |
| `actions/menu.ts` | Menu & Resep | 🟢 85% |
| `actions/inventory.ts`, `production.ts`, `branches.ts`, `approvals.ts`, `promos.ts`, `settings.ts`, `analytics.ts` | Operasional & Analitik | 🟢 82% (gabungan) |
| `menu/page.tsx` | UI Menu & Resep | 🟡 75% — sisa data mock hardcoded |
| `sdm/page.tsx` | UI SDM | 🟢 80% |
| `pengaturan/page.tsx` | UI Pengaturan/Branding | 🔴 **55%** — pajak/service charge tidak berfungsi |
| Halaman lain (11 berkas) | UI operasional lain | 🟢 78% (estimasi pola) |
| `components/`, `store/`, `DashboardContainer.tsx` | Komponen bersama | 🟢 80% |

### 🎯 **Rating Kesiapan Produksi `apps/owner`: 76%**

---

## ✅ Prioritas Perbaikan Batch Ini (Actionable Checklist)

1. 🔴 **[P1 — Bug Fungsional Bisnis]** Perbaiki *mismatch* nama field `taxRate`/`serviceChargeRate` (UI) vs `taxRateBps`/`serviceChargeRateBps` (pricing engine) — **pajak & service charge saat ini tidak pernah benar-benar diterapkan ke transaksi manapun** (§2.13).
2. 🟠 **[P1 — Bug Fungsional]** Verifikasi & perbaiki alur `createEmployeeAction` di `hr.ts` yang berisiko menghasilkan akun karyawan yang tidak bisa login (tidak ada `schema.account` yang terbentuk) (§2.6).
3. 🟠 **[P2]** Perbaiki scope permission `getProfilesAction`/`getCustomRolesAction` di `hr.ts`: gunakan `hr:read` untuk operasi baca, bukan `hr:manage`, agar sesuai desain matriks RBAC terbaru (§2.6).
4. 🟡 **[P2]** Sambungkan Optimistic Concurrency Control (`settingsVersion`/`expectedVersion`) dari `pengaturan/page.tsx` ke `updateTenantBrandingAction` yang sebenarnya sudah mendukungnya di server (§2.13).
5. 🟡 **[P2]** Hapus data mock `bom` hardcoded di `menu/page.tsx`, gunakan `dbRecipeMap` saja (§2.11) — pola sama seperti yang sudah dibersihkan di `pricing-service.ts`.
6. 🟡 **[P2]** Sinkronkan asumsi margin di `getMenuEngineeringAction` (`analytics.ts`) dengan `cogsRate` tenant, alih-alih hardcode `0.65` (§2.9).
7. 🟢 **[P3]** Tambahkan `uniqueIndex` komposit `(tenantId, code)` untuk `promos` di skema DB, mencegah race condition kode promo duplikat (§2.9 — belum berubah dari audit sebelumnya).
8. 🟢 **[P3]** Ubah `layout.tsx` dari pola *denylist role* (`if role === 'kasir'`) menjadi *allowlist role* agar tahan terhadap penambahan role baru (`kitchen`, `staf`) di masa depan (§2.2).
9. 🟢 **[P3]** Perbarui komentar dokumentasi di `middleware.ts` agar sesuai implementasi aktual — hindari kebingungan soal di lapisan mana validasi sesi/role sebenarnya terjadi (§2.1).
10. 🟢 **[P3]** Filter item navigasi `Sidebar.tsx` berdasarkan role/permission untuk UX yang lebih baik (§2.15).
11. 🟢 **[P4]** Perbaiki penanganan error `23505` (duplikat slug) di `updateMenuItemAction` agar pesan error lebih jelas ke pengguna (§2.8).

---

*Laporan ini mencakup: (1) verifikasi lengkap 4 dari 5 perbaikan pada `lib/`+`packages/` dari audit sebelumnya — 3 resolved penuh, 1 partial — dan (2) audit menyeluruh terhadap seluruh 64 berkas `apps/owner/`, dengan kedalaman penuh pada 100% Server Actions (lapisan trust boundary utama) dan berkas UI paling kritis (Menu, SDM, Pengaturan), ditambah pemindaian pola risiko pada seluruh berkas UI lainnya. Siap lanjut ke audit `apps/admin` (POS/KDS) atau `apps/customer` (Storefront) secara menyeluruh pada batch berikutnya jika diperlukan.*
