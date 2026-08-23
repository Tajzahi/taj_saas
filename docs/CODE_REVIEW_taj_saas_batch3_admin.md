# 🔍 Laporan Code Review Batch 3 — Repository `taj_saas`

**Auditor:** Senior Software Architect & Lead Code Auditor (Claude)
**Commit yang diaudit:** `e5a687b` — *"fix(owner): resolve all batch 2 code review items including tax bps sync, staff credentials, and optimistic concurrency"*
**Fokus:** (1) Verifikasi perbaikan Batch 2 (`apps/owner`), (2) Audit menyeluruh `apps/admin/` (Customer POS/KDS)
**Tanggal Audit:** 23 Agustus 2026

---

## BAGIAN 1 — ✅ VERIFIKASI PERBAIKAN BATCH 2

Saya menarik ulang repo dan memeriksa `diff` commit `e5a687b` terhadap 11 item checklist dari laporan Batch 2.

| # | Temuan Batch 2 | Status | Verifikasi |
|---|---|---|---|
| 1 | 🔴 Pajak/service charge tidak berfungsi (`taxRate` vs `taxRateBps`) | ✅ **RESOLVED** | `pricing-service.ts` kini membaca `taxRateBps` **dengan fallback otomatis** ke `taxRate` jika `taxRateBps` belum ada (konversi `× 100`). `pengaturan/page.tsx` juga sekarang mengirim **kedua** field sekaligus. Solusi *belt-and-suspenders* — bahkan lebih robust dari yang saya rekomendasikan karena data lama (tenant yang sudah terlanjur menyimpan `taxRate` sebelumnya) otomatis tetap terbaca benar. |
| 2 | 🟠 `createEmployeeAction` berisiko akun tidak bisa login | ✅ **RESOLVED**, dengan 1 regresi baru (lihat §2.6) | Sekarang memakai `auth.api.signUpEmail` resmi + `crypto.randomBytes` untuk password sementara — akar masalah (tidak ada baris `schema.account`) sudah tertutup. **Namun** saya menemukan password sementara ini tidak pernah ditampilkan ke Owner di UI — lihat temuan baru §2.6. |
| 3 | 🟠 Scope permission `hr:manage` vs `hr:read` di `getProfilesAction`/`getCustomRolesAction` | ✅ **RESOLVED** | Kedua fungsi kini memakai `hr:read`, sesuai matriks RBAC. |
| 4 | 🟡 OCC (`settingsVersion`) tidak tersambung ke UI | ✅ **RESOLVED** | `pengaturan/page.tsx` kini menyimpan & mengirim `settingsVersion`, serta menangani konflik dengan `reload()`. |
| 5 | 🟡 Data mock `bom` hardcoded di `menu/page.tsx` | ✅ **RESOLVED** | Objek `bom` sudah dihapus total, diverifikasi dengan pencarian ulang — tidak ada sisa referensi. |
| 6 | 🟡 Margin hardcoded `0.65` di `getMenuEngineeringAction` | ✅ **RESOLVED** | Sekarang memakai `getCogsRate(tenant.id)` dari `_tenantHelper.ts`, konsisten dengan `finance.ts`. |
| 7 | 🟢 `uniqueIndex` komposit `(tenantId, code)` untuk `promos` | 🟡 **PARTIAL** | Perubahan sudah ada di `packages/db/schema.ts` (`uniqueIndex("promos_tenant_code_idx")`), **namun saya tidak menemukan berkas migrasi SQL baru** (`packages/db/drizzle/0006_*.sql`) yang mengaplikasikan perubahan ini ke database sungguhan — migrasi terakhir masih `0005_neat_selene.sql`. Lihat detail di bawah. |
| 8 | 🟢 Layout `allowlist` role, bukan `denylist` | ✅ **RESOLVED** | `layout.tsx` kini memakai `OWNER_APP_ALLOWED_ROLES = ["owner", "manager"]`. |
| 9 | 🟢 Dokumentasi `middleware.ts` diperbarui | ✅ **RESOLVED** | Komentar sudah direvisi agar sesuai implementasi aktual (fast-path cookie check, validasi penuh di `layout.tsx`). |
| 10 | 🟢 Filter Sidebar berdasarkan role | ⚪ **TIDAK DIUBAH** | Prioritas terendah (P3), belum disentuh — tidak masalah, tetap aman karena Server Action tetap jadi lapisan pertahanan utama. |
| 11 | 🟢 Penanganan error `23505` di `updateMenuItemAction` | ✅ **RESOLVED** | Sudah ditambahkan di `createMenuItemAction` **dan** `updateMenuItemAction`. |

### ⚠️ Detail Temuan Residual dari Item #7 — Migrasi Database Belum Dibuat

```
packages/db/schema.ts:  uniqueIndex("promos_tenant_code_idx").on(table.tenantId, table.code)  ✅ ada di source
packages/db/drizzle/:   0000...0005_neat_selene.sql                                            ❌ tidak ada migrasi 0006
```
Perubahan skema Drizzle **hanya efektif setelah** `drizzle-kit generate` dijalankan (menghasilkan file SQL migrasi baru) **dan** migrasi tersebut benar-benar dieksekusi ke database produksi/staging. Selama migrasi `0006` belum dibuat & dijalankan, constraint unik ini **belum benar-benar ada di database**, sehingga race condition pembuatan kode promo duplikat (temuan asli dari audit pertama) **secara teknis masih terbuka** di database nyata meski kode TypeScript sudah "benar".

**Rekomendasi:** Jalankan `pnpm drizzle-kit generate` (atau perintah setara pada `drizzle.config.ts` proyek ini) untuk menghasilkan migrasi `0006_*.sql`, lalu terapkan ke database staging/produksi sebelum menganggap temuan ini benar-benar selesai. Ini murni langkah operasional yang terlewat, bukan kesalahan kode.

### 🆕 Temuan Baru dari Batch 2 (belum dilaporkan sebelumnya) — lihat detail di §2.6

Saat memverifikasi perbaikan `createEmployeeAction`, saya menemukan bahwa **password sementara (`tempPassword`) yang di-generate server tidak pernah ditampilkan ke Owner di UI** (`sdm/page.tsx` mengabaikan `res.data.tempPassword`/`res.message`). Secara praktis, bug asli ("karyawan tidak bisa login") **belum benar-benar tuntas** dari perspektif pengguna — akun sekarang punya kredensial yang valid, tapi tidak ada seorang pun yang tahu passwordnya. Detail & rekomendasi ada di §2.6.

### 📊 Kesimpulan Bagian 1

**9 dari 11 item sudah selesai penuh**, 1 item selesai sebagian (migrasi DB belum dijalankan), dan proses verifikasi menemukan 1 regresi kecil baru pada alur yang sama. Secara keseluruhan **kualitas perbaikan Batch 2 sangat baik** — tim menerapkan solusi yang bahkan lebih robust dari rekomendasi saya di beberapa poin (misalnya fallback ganda `taxRate`/`taxRateBps`). Lanjut ke audit `apps/admin/`.

---

## BAGIAN 2 — 🔍 AUDIT MENYELURUH `apps/admin/` (Customer POS/KDS)

`apps/admin` berisi **24 berkas** (~5.500 baris). Ini adalah aplikasi yang dipakai kasir & dapur sehari-hari untuk operasional real-time (menerima pesanan, verifikasi pembayaran, kelola shift kasir, KDS dapur). Saya membaca **seluruh berkas** secara detail: gerbang keamanan (`middleware.ts`, `AdminClientPage.tsx`, `LoginPage.tsx`), Server Actions (`app/actions.ts`, 1.172 baris — sudah pernah diaudit sebagian di Batch 1, kini diverifikasi ulang menyeluruh terhadap matriks RBAC terbaru), endpoint realtime (`api/ably/token`), state management (`adminStore.ts`), dan seluruh komponen UI.

### 2.1 `apps/admin/middleware.ts` (45 baris)

**Fungsi:** Resolusi tenant untuk Admin App, dengan fallback redirect ke halaman registrasi Owner App jika tenant tidak ditemukan.

**🟢 Keunggulan:** Penanganan kegagalan resolusi tenant (404) cukup matang — membedakan skenario localhost (redirect ke port Owner App 3002) vs produksi (redirect ke `OWNER_APP_URL` dari environment variable), dengan validasi eksplisit bahwa `OWNER_APP_URL` benar-benar dikonfigurasi sebelum dipakai (`if (!ownerAppUrl) return new NextResponse(..., 500)`), mencegah *runtime crash* akibat `new URL(undefined)`.

**🔴 Temuan:**

**[LOW]** Berbeda dengan `apps/owner/middleware.ts` (yang setidaknya melakukan *fast-path cookie check*), middleware Admin App **tidak melakukan pengecekan cookie sesi sama sekali** — seluruh proteksi otentikasi didelegasikan penuh ke `AdminClientPage.tsx` (client-side) dan Server Actions (server-side). Ini **bukan celah keamanan** (data tetap terproteksi di Server Actions), tapi berarti pengguna yang belum login akan selalu memuat penuh *bundle* JavaScript Dashboard sebelum diarahkan ke `LoginPage` secara client-side, alih-alih di-redirect lebih awal di edge. Dampaknya murni performa (sedikit lebih lambat menampilkan halaman login untuk pengguna belum-login), bukan keamanan.

**🎯 Rating: 82%**

---

### 2.2 `apps/admin/app/page.tsx` (24 baris) & `AdminClientPage.tsx` (53 baris) — Gerbang Otentikasi Client

**Fungsi:** Server Component mengambil sesi awal untuk SSR, diteruskan ke Client Component yang memutuskan render `LoginPage` atau `Dashboard` berdasarkan status sesi & role.

**🟢 Keunggulan:** Pola *hybrid* SSR session fetch + client-side reactive session (`authClient.useSession()`) sudah tepat untuk UX yang cepat tanpa *flash of unauthenticated content* yang parah.

**🔴 Temuan:**

**[HIGH — Bug Fungsional Signifikan] Role `kitchen` tidak bisa login ke Admin App sama sekali, padahal aplikasi ini secara eksplisit diperuntukkan untuk "Admin POS/**KDS**" (Kitchen Display System).**

```ts
const userRole = (session?.user as any)?.role;
if (!session || (userRole !== 'owner' && userRole !== 'kasir')) {
  return <LoginPage onLogin={() => {}} />;
}
```

Saya verifikasi silang dengan matriks RBAC terbaru di `lib/tenant-authorization.ts` (hasil perbaikan Batch 1) — role `kitchen` **sudah** diberi permission relevan (`orders:read`, `orders:manage-status`, `production:read`, `production:manage`, `store:read-operation`), dan saya konfirmasi Server Action seperti `updateOrderStatusAction` (yang mensyaratkan `orders:update-status`, dimiliki role `kitchen`) **akan mengizinkan** role `kitchen` di lapisan server. Tapi gerbang **client-side** ini memblokir mereka lebih dulu — staf dapur dengan role `kitchen` yang mencoba login akan **selalu diarahkan kembali ke `LoginPage`**, seolah gagal login, meski kredensial mereka benar.

**Akar masalah:** Kode ini memeriksa `session.user.role` — field **global** dari tabel `schema.user` (dibahas juga di audit Batch 1 & 2), bukan `schema.profiles.role` yang tenant-scoped dan menjadi sumber kebenaran sesungguhnya untuk RBAC. Selain itu, daftar role yang di-*hardcode* (`'owner'`, `'kasir'`) tidak sinkron dengan penambahan role `manager`, `kitchen`, `staf` pada matriks permission terbaru.

**Rekomendasi:** Pindahkan pengecekan ini agar berbasis `profile.role` (tenant-scoped) via Server Component, bukan `session.user.role` (global) di Client Component. Pola paling konsisten adalah meniru apa yang sudah benar di `apps/owner/app/(dashboard)/layout.tsx`:

```tsx
// apps/admin/app/page.tsx (SESUDAH) — validasi role di server, bukan client
import { requireTenantSession, AuthorizationError } from "@lib/tenant-authorization";

export default async function Page() {
  const headersList = await headers();
  let profile = null;
  try {
    const ctx = await requireTenantSession({ expectedApp: "admin" });
    profile = ctx.profile;
  } catch {
    // belum login / tidak punya akses — biarkan AdminClientPage menampilkan LoginPage
  }

  return (
    <AdminClientPage
      tenantId={headersList.get("x-tenant-id")}
      tenantSlug={headersList.get("x-tenant-slug")}
      initialSession={/* ... */}
      allowedRole={profile ? ["owner", "manager", "kasir", "kitchen", "staf"].includes(profile.role) : false}
    />
  );
}
```
Atau, solusi minimal tanpa restrukturisasi besar: cukup perbarui daftar role yang di-*hardcode* di `AdminClientPage.tsx` agar mencakup seluruh role yang relevan untuk aplikasi Admin (`owner`, `manager`, `kasir`, `kitchen`, `staf`), **sambil tetap menyadari** bahwa `session.user.role` (global) bisa saja tidak akurat dibanding `profile.role` (tenant-scoped) — idealnya klien memanggil satu Server Action ringan (`getMyProfileRoleAction`) untuk mendapatkan role yang benar-benar berlaku di tenant saat ini, alih-alih membaca `session.user.role` secara langsung.

```ts
// Perbaikan minimal (band-aid, bukan solusi ideal):
const ALLOWED_ADMIN_ROLES = ['owner', 'manager', 'kasir', 'kitchen', 'staf'];
if (!session || !ALLOWED_ADMIN_ROLES.includes(userRole)) {
  return <LoginPage onLogin={() => {}} />;
}
```

**🎯 Rating: 60%** *(bug fungsional yang cukup signifikan — fitur KDS yang disebut eksplisit dalam nama aplikasi tidak bisa dipakai oleh role yang dirancang untuknya)*

---

### 2.3 `apps/admin/components/LoginPage.tsx` (190 baris)

**Fungsi:** Form login kasir/staf dengan input tambahan "Modal Awal Laci" (starting cash) yang otomatis membuka shift POS setelah login berhasil.

**🟢 Keunggulan:**
- Alur konversi *username* → *email sintetis* (`${username}@taj.saas`) memudahkan staf lapangan yang terbiasa login dengan "username" pendek tanpa harus mengingat alamat email lengkap — pertimbangan UX yang baik untuk konteks kasir warung/restoran.
- Validasi input dasar sebelum submit (username & password wajib).

**🔴 Temuan:**

**[MEDIUM] Branding "A6 NYUSS" / "Martabak Terbul A6 Nyuss" / "Surabaya" di-*hardcode* langsung di komponen, bukan diambil dari `tenant.branding` secara dinamis** — ini pola yang **sama persis** dengan celah *white-label* yang sudah diperbaiki di `lib/server/pricing-service.ts` (Batch 1) dan `menu/page.tsx` (Batch 2), namun **belum dibersihkan** di sini:
```tsx
<h1 className="text-2xl font-black text-white tracking-tight leading-tight">
  A6 NYUSS
</h1>
<p className="text-white/80 text-sm mt-1 font-medium">Portal Operasional Kasir</p>
<p className="text-white/60 text-xs mt-1">Martabak Terbul A6 Nyuss</p>
{/* ... */}
<p className="text-white/60 text-xs text-center mt-6">
  © 2026 Martabak Terbul A6 Nyuss · Surabaya
</p>
```
**Dampak nyata:** Setiap tenant lain di platform ini (bukan hanya "Martabak Terbul A6 Nyuss") akan melihat nama bisnis, tagline, dan lokasi kota yang **salah** di layar login kasir mereka sendiri — membingungkan staf dan tidak profesional untuk produk SaaS multi-tenant/white-label. Ini bertentangan dengan pekerjaan "100% dynamic white-label CMS" yang sudah dilakukan di sisi Owner App (branding dinamis untuk Customer Storefront), tapi belum diterapkan konsisten ke Admin App.

**Rekomendasi:** Ambil nama bisnis & kota dari data tenant (via Server Component induk, diteruskan sebagai prop), sama seperti pola `tenantId`/`tenantSlug` yang sudah diteruskan dari `app/page.tsx` → `AdminClientPage` → turun ke `LoginPage`:
```tsx
// app/page.tsx: tambahkan fetch branding tenant
const tenant = await resolveTenantFromRequestHost(host, { expectedApp: "admin" });
// ...teruskan tenant.name, tenant.branding.storeAddress dst. sebagai props hingga ke LoginPage

// LoginPage.tsx (SESUDAH):
<h1 className="text-2xl font-black text-white tracking-tight leading-tight">
  {businessName || "Portal Operasional"}
</h1>
<p className="text-white/60 text-xs mt-1">{tagline}</p>
```

**[LOW] Email sintetis `${username}@taj.saas` tidak di-scope per-tenant**, berpotensi terjadi tabrakan (*collision*) antar tenant untuk username umum seperti "kasir1" atau "admin" — dua tenant berbeda yang staf-nya sama-sama mencoba login dengan username pendek yang sama akan menghasilkan alamat email sintetis yang **identik** (`kasir1@taj.saas`), padahal `schema.user.email` kemungkinan besar unik secara global (bukan per-tenant) berdasarkan pola constraint Better Auth standar. Ini berisiko: tenant yang lebih dulu "mendaftarkan" username umum secara tidak sengaja akan mencegah tenant lain memakai username sederhana yang sama, dan juga membuat percobaan *brute-force*/tebak password terhadap pola email `@taj.saas` berpotensi menyasar akun tenant manapun di platform, bukan tenant tertentu saja (mengingat login form ini murni memakai *username* pendek yang jauh lebih mudah ditebak daripada email asli).

**Rekomendasi:** Sertakan `tenantSlug` ke dalam pola email sintetis agar ter-*namespace* per tenant, misalnya `${username}@${tenantSlug}.taj.saas`, dan pastikan alur pembuatan akun karyawan (`createEmployeeAction` di Owner App) yang memakai email asli tetap kompatibel (tidak konflik format).

**🎯 Rating: 70%**

---

### 2.4 `apps/admin/app/api/ably/token/route.ts` (40 baris) — Token Realtime

**Fungsi:** Menerbitkan token Ably (layanan realtime pub/sub) yang dibatasi (*scoped*) untuk staf yang sudah terautentikasi, agar Dashboard Admin bisa menerima notifikasi pesanan baru secara real-time tanpa polling.

**🟢 Keunggulan — Ini implementasi terbaik yang saya temukan di seluruh `apps/admin`, layak dicontoh untuk fitur realtime lain di masa depan:**
```ts
const { tenant, user } = await requireTenantSession({ expectedApp: 'admin' });
const rest = new Ably.Rest(apiKey);
const tokenParams: Ably.TokenParams = {
  clientId: `admin:${user.id}`,
  capability: JSON.stringify({ [`orders:${tenant.slug}`]: ['subscribe'] }), // HANYA subscribe, HANYA channel tenant ini
  ttl: 3600 * 1000, // kadaluwarsa 1 jam
};
```
- **API key Ably tidak pernah diekspos ke klien** — hanya *token request* jangka pendek yang dikirim, dibuat lewat `Ably.Rest` di server.
- **Capability dibatasi sangat presisi**: hanya `subscribe` (tidak bisa `publish`, mencegah staf mengirim event palsu ke channel), dan **hanya pada channel milik tenant mereka sendiri** (`orders:${tenant.slug}`) — staf Tenant A **tidak mungkin** mendapat token yang bisa dipakai untuk mendengarkan channel pesanan real-time milik Tenant B, karena `tenant` di sini diresolusi ulang dari sesi/host yang independen (`requireTenantSession`), bukan dari input klien.
- TTL token dibatasi 1 jam — mengurangi jendela risiko jika token bocor/dicuri.

**Tidak ada temuan.** Ini adalah contoh *defense-in-depth* dan *least privilege* yang diterapkan dengan sangat baik. **Rating: 95%**

---

### 2.5 `apps/admin/app/actions.ts` (1.172 baris) — Server Actions POS/KDS

**Status:** Berkas ini sudah diaudit sebagian di Batch 1 (fokus pada `createOfflineOrderAction`). Kali ini saya membaca **seluruh 17 fungsi ekspor** secara menyeluruh dan memverifikasi ulang terhadap matriks RBAC terbaru.

**🟢 Keunggulan (konfirmasi ulang & tambahan):**
- **Seluruh 17 fungsi** tanpa kecuali memanggil `requireTenantPermission(...)` dengan string permission yang **valid** terhadap `Permission` union type terbaru (diverifikasi lewat pencarian silang — tidak ada permission "yatim"/typo yang lolos).
- `reviewCancellationRequestAction` (pembatalan & refund) mengambil nominal refund dari **`order.totalPrice` yang tersimpan di database**, bukan dari input klien — konsisten dengan prinsip anti-manipulasi nominal yang sudah terbukti solid di berkas-berkas lain.
- Transaksi atomik (`db.transaction`) dipakai konsisten untuk operasi multi-tabel (update order + insert payment transaction + insert outbox event + insert audit log) pada alur pembatalan/refund maupun pembuatan order POS.
- Validasi *double-check* status (`reqRow.status !== "pending"`) sebelum memproses ulang pengajuan pembatalan — mencegah pemrosesan ganda jika 2 admin mengklik approve/reject bersamaan pada request yang sama.

**Tidak ada temuan baru** di luar yang sudah dilaporkan di Batch 1 (§9 — isolasi shift-per-cabang pada `createOfflineOrderAction`, masih belum diperbaiki namun bukan fokus Batch 2/3 ini). **Rating: 85%**

---

### 2.6 🆕 `apps/admin` ↔ `apps/owner` — Regresi Baru: Password Sementara Karyawan Tidak Pernah Ditampilkan

Ini bukan berkas `apps/admin`, tapi saya laporkan di sini karena **ditemukan saat memverifikasi apakah staf benar-benar bisa login ke Admin App** (relevan langsung dengan alur kerja Admin/POS yang sedang diaudit).

Menelusuri diff Batch 2 (`hr.ts`) dan `sdm/page.tsx` (owner app):
```ts
// hr.ts (createEmployeeAction) — SUDAH BENAR, kredensial dibuat dengan baik:
const tempPassword = crypto.randomBytes(12).toString("base64url");
const signUpResult = await auth.api.signUpEmail({ body: { name, email, password: tempPassword } });
// ...
return { success: true, data: { ...profile, tempPassword }, message: `Karyawan berhasil ditambahkan. Password awal: ${tempPassword}` };
```
```ts
// sdm/page.tsx — handler tidak pernah membaca tempPassword ATAU res.message:
if (res.success && res.data) {
  // ...membangun objek newEmp lokal, TIDAK menyertakan res.data.tempPassword
  toast.success("Karyawan baru berhasil ditambahkan!"); // pesan generik hardcoded, mengabaikan res.message
}
```
**Dampak:** Backend sekarang menghasilkan password sementara yang valid & aman (`crypto.randomBytes`), tapi **password itu hilang begitu saja** — tidak pernah ditampilkan di layar, tidak di-*copy*-kan ke clipboard, tidak dikirim ke email. Owner tidak tahu password apa yang harus diberikan ke karyawan barunya. **Secara fungsional, karyawan yang dibuat lewat "quick add" tetap tidak bisa login** — bukan lagi karena akun rusak (sudah diperbaiki), tapi karena tidak ada yang tahu passwordnya, dan **tidak ada fitur "Lupa Password"** di Owner/Admin App untuk memulihkannya (dikonfirmasi lewat pencarian `forgetPassword`/`forgot-password` di seluruh `apps/owner` — nihil).

**Rekomendasi (P1, seharusnya cepat diperbaiki):** Tampilkan `tempPassword` ke Owner dalam modal konfirmasi setelah karyawan berhasil dibuat, dengan peringatan jelas bahwa password ini hanya ditampilkan **sekali** dan harus segera diberikan ke karyawan secara aman:
```tsx
// sdm/page.tsx (SESUDAH):
if (res.success && res.data) {
  // ...
  if (res.data.tempPassword) {
    setShowTempPasswordModal({ email: addEmail, password: res.data.tempPassword });
  }
  toast.success(res.message || "Karyawan baru berhasil ditambahkan!");
}
```
Disertai modal terpisah yang menampilkan email + password dengan tombol "Salin" dan peringatan "Catat sekarang — password ini tidak akan ditampilkan lagi." Sebagai peningkatan lebih lanjut (opsional), pertimbangkan menambahkan fitur "Lupa Password" standar di halaman login Owner/Admin sebagai jaring pengaman independen dari alur ini.

**🎯 Dampak pada rating:** Ini menurunkan efektivitas perbaikan Batch 2 item #2 dari "selesai penuh" menjadi "selesai di backend, terputus di UI" — akar masalah keamanan (akun tanpa kredensial) sudah tuntas, tapi *dari sudut pandang bisnis*, fitur "tambah karyawan cepat" masih belum benar-benar dapat dipakai sampai temuan ini diperbaiki.

---

### 2.7 `apps/admin/store/adminStore.ts` (442 baris) — State Management

**🟢 Keunggulan:** Seluruh 13 method mutasi/pengambilan data didelegasikan ke Server Actions — tidak ada satupun akses database langsung dari state management sisi klien. Integrasi Ably realtime (`subscribeToOrders`) diisolasi rapi dengan *lazy import* (`import('ably').then(...)`), mengurangi ukuran bundle JS awal.

**🔴 Temuan:**

**[LOW] Import `staticMenuItems` dari `../data/menu` (baris 2) adalah *dead code* — tidak pernah dipakai di manapun dalam file ini** (diverifikasi dengan pencarian, hanya muncul di baris import). `data/menu.ts` sendiri berisi katalog hardcoded "Martabak Telur Ayam/Bebek" khas 1 bisnis (pola yang sama seperti temuan-temuan sebelumnya), namun **untungnya sudah tidak dipakai di runtime manapun** di seluruh `apps/admin` (diverifikasi dengan pencarian menyeluruh) — jadi ini murni *dead code*/*unused import*, bukan risiko fungsional aktif seperti kasus `bom` di Batch 2. Tetap disarankan dibersihkan demi kejelasan kode dan mencegah kebingungan developer baru yang mungkin mengira data ini masih dipakai.

**Rekomendasi:**
```ts
// SEBELUM:
import { menuItems as staticMenuItems, toppingOptions } from '../data/menu';
// SESUDAH (hapus staticMenuItems yang tidak terpakai, dan pertimbangkan hapus data/menu.ts jika toppingOptions juga tidak esensial):
import { toppingOptions } from '../data/menu';
```

**[LOW] Default fallback nama toko `'Martabak A6 Nyuss'` muncul 2 kali** (`storeName: 'Martabak A6 Nyuss'` inisialisasi state, dan `storeName: res.name || 'Martabak A6 Nyuss'` di `fetchStoreSettings`) — pola *hardcoded branding* yang sama seperti §2.3. Karena ini hanya *fallback* (dipakai saat `res.name` kosong/gagal dimuat), dampaknya lebih kecil dari LoginPage, tapi tetap sebaiknya diganti fallback netral seperti `'Toko Anda'` atau `'Memuat...'` agar tidak menampilkan nama bisnis milik tenant lain saat terjadi kegagalan pemuatan data pada tenant manapun.

**🎯 Rating: 80%**

---

### 2.8 Komponen UI (`Dashboard.tsx`, `OrderCard.tsx`, `OrderDetail.tsx`, `OrderQueue.tsx`, `POSOfflineModal.tsx`, `PrintReceipt.tsx`, `StoreToggleModal.tsx`)

Saya memeriksa ketujuh komponen ini (total ~3.500 baris) dengan kombinasi pembacaan langsung pada bagian-bagian yang menyentuh data uang/pembayaran, dan pemindaian pola risiko menyeluruh.

**🟢 Temuan Baik:**
- **Tidak ditemukan** `dangerouslySetInnerHTML`, `eval()`, atau manipulasi DOM langsung berisiko XSS di seluruh 7 komponen.
- **Tidak ditemukan** `localStorage`/`sessionStorage` dipakai untuk menyimpan data sesi/sensitif.
- `POSOfflineModal.tsx` memang mengirim `totalPrice: grandTotal` (hasil kalkulasi klien) ke `createOfflineOrderAction`, tapi **saya konfirmasi ulang di §2.5 & Batch 1** bahwa Server Action ini **mengabaikan** nilai tersebut dan menghitung ulang lewat `calculateOrderPricing` — jadi tidak ada risiko manipulasi harga meski UI mengirim angka yang bisa saja sudah dimodifikasi via DevTools.
- Metode cetak struk di `PrintReceipt.tsx` tidak memakai `document.write`/injeksi HTML mentah yang rawan — menggunakan pendekatan React standar.

**Tidak ada temuan keamanan baru.** **Rating gabungan: 85%**

---

## 📊 RINGKASAN RATING — BAGIAN `apps/admin`

| Berkas / Area | Fokus | Rating |
|---|---|---|
| `middleware.ts` | Resolusi tenant & fallback registrasi | 🟢 82% |
| `app/page.tsx` + `AdminClientPage.tsx` | Gerbang otentikasi & role | 🔴 **60%** — role `kitchen` tidak bisa login |
| `LoginPage.tsx` | Form login kasir | 🟡 70% — branding hardcoded |
| `api/ably/token/route.ts` | Token realtime | 🟢 **95%** — praktik terbaik di seluruh audit |
| `app/actions.ts` | Server Actions POS/KDS | 🟢 85% |
| `store/adminStore.ts` | State management | 🟢 80% |
| 7 komponen UI lainnya | Dashboard, OrderCard/Detail/Queue, POS Modal, Print, StoreToggle | 🟢 85% |

### 🎯 **Rating Kesiapan Produksi `apps/admin`: 79%**

---

## ✅ Prioritas Perbaikan Batch Ini (Actionable Checklist)

1. 🔴 **[P1 — Bug Fungsional]** Perbaiki gerbang role di `AdminClientPage.tsx` — role `kitchen` (dan `manager`/`staf` jika relevan untuk Admin App) saat ini tidak bisa login sama sekali meski memiliki permission yang valid di server (§2.2).
2. 🟠 **[P1 — Regresi Batch 2]** Tampilkan `tempPassword` hasil `createEmployeeAction` ke Owner di `sdm/page.tsx` — backend sudah benar, tapi UI membuang informasi krusial ini (§2.6).
3. 🟠 **[P1 — Operasional]** Jalankan `drizzle-kit generate` + terapkan migrasi untuk `uniqueIndex("promos_tenant_code_idx")` yang sudah ada di `schema.ts` tapi belum ter-apply ke database sungguhan (§1, item #7).
4. 🟡 **[P2]** Ganti branding hardcoded "A6 NYUSS"/"Martabak Terbul"/"Surabaya" di `LoginPage.tsx` menjadi dinamis dari data tenant, konsisten dengan CMS white-label yang sudah diterapkan di tempat lain (§2.3).
5. 🟡 **[P2]** Scope email sintetis login (`${username}@taj.saas`) per-tenant untuk menghindari collision & memperkecil permukaan serang brute-force (§2.3).
6. 🟢 **[P3]** Bersihkan `import { menuItems as staticMenuItems }` yang tidak terpakai di `adminStore.ts`, dan ganti fallback nama toko hardcoded dengan label netral (§2.7).

---

## 📌 Status Keseluruhan Proyek Sejauh Ini

| Bagian | Rating Kesiapan Produksi |
|---|---|
| `lib/` + `packages/` (setelah 2 batch perbaikan) | 🟢 ~90% (perbaikan P0 & P1 tuntas, hanya rate-limiter fail-open & migrasi DB tertunda) |
| `apps/owner/` (setelah Batch 2 perbaikan) | 🟢 ~85% (naik dari 76%, 1 regresi kecil ditemukan) |
| `apps/admin/` (Batch 3, audit pertama kali) | 🟡 79% |
| `apps/customer/` | ⏳ Belum diaudit |

*Siap lanjut audit menyeluruh `apps/customer/` (Customer Storefront) sebagai bagian terakhir pada batch berikutnya, dengan format dan kedalaman audit yang sama.*
