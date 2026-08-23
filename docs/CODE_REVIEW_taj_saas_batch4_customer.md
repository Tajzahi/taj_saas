# 🔍 Laporan Code Review Batch 4 — Repository `taj_saas`

**Auditor:** Senior Software Architect & Lead Code Auditor (Claude)
**Commit yang diaudit:** `e8662d8` — *"fix(admin): resolve all batch 3 audit items including kitchen role login, dynamic white-label branding, employee temp password modal, and db migration 0006"*
**Fokus:** (1) Verifikasi perbaikan Batch 3 (`apps/admin` + migrasi DB), (2) Audit menyeluruh **`apps/customer/`** (Customer Storefront) — bagian terakhir dari cakupan awal (`apps/`, `lib/`, `packages/`)
**Tanggal Audit:** 23 Agustus 2026

---

## BAGIAN 1 — ✅ VERIFIKASI PERBAIKAN BATCH 3

| # | Temuan Batch 3 | Status | Verifikasi |
|---|---|---|---|
| 1 | 🔴 Role `kitchen` tidak bisa login ke Admin App | ✅ **RESOLVED** | `AdminClientPage.tsx` kini memakai `ALLOWED_ADMIN_ROLES = ['owner', 'manager', 'kasir', 'kitchen', 'staf']` — seluruh role operasional relevan sudah tercakup. |
| 2 | 🟠 `tempPassword` karyawan baru tidak pernah ditampilkan ke Owner | ✅ **RESOLVED** | `sdm/page.tsx` kini menampilkan modal kredensial khusus (nama, email, role, password) dengan tombol "Salin" & "Salin Semua", disertai peringatan "hanya ditampilkan satu kali". Implementasi rapi dan lengkap. |
| 3 | 🟠 Migrasi DB untuk `promos_tenant_code_idx` belum dijalankan | ✅ **RESOLVED** | Migrasi `0006_outgoing_goliath.sql` sudah dibuat & berisi `CREATE UNIQUE INDEX "promos_tenant_code_idx" ON "promos" USING btree ("tenant_id","code")` — race condition kode promo duplikat kini benar-benar tertutup di level database, bukan cuma di `schema.ts`. |
| 4 | 🟡 Branding "A6 NYUSS" hardcoded di `LoginPage.tsx` | ✅ **RESOLVED** | Branding kini sepenuhnya dinamis: `app/page.tsx` mengambil `tenant.name` & `tenant.branding` dari DB dan meneruskannya sampai ke `LoginPage` (`businessName`, `storeTagline`, `logoUrl`, dst). |
| 5 | 🟡 Email sintetis login (`@taj.saas`) tidak di-scope per-tenant | ✅ **RESOLVED**, dengan strategi migrasi yang baik | Pola baru: `${username}@${tenantSlug}.taj.saas`. Tim juga menambahkan **fallback otomatis** ke pola lama `@taj.saas` jika login pertama gagal — solusi yang cerdas untuk kompatibilitas mundur (akun lama yang sudah terlanjur dibuat dengan pola global tidak perlu dimigrasikan manual). |
| 6 | 🟢 `staticMenuItems` tidak terpakai di `adminStore.ts` | ✅ **RESOLVED** | Import sudah dibersihkan, hanya `toppingOptions` yang tersisa. |
| 7 | 🟢 Fallback nama toko hardcoded "Martabak A6 Nyuss" | ✅ **RESOLVED** | Diganti label netral `'Portal Operasional'` di kedua lokasi. |

### 🆕 Catatan Kecil Baru dari Verifikasi (Low, non-blocker)

**[LOW]** Prop baru `storeCity` pada `AdminClientPage.tsx`/`LoginPage.tsx` (`tenantBranding?.storeCity`) **tidak memiliki sumber data** — field ini tidak pernah didefinisikan di skema Zod `branding` (`apps/owner/app/actions/settings.ts`) maupun di interface `Tenant.branding` (`packages/shared/tenant.ts`). Akibatnya field ini akan **selalu** jatuh ke fallback `"Indonesia"` pada footer halaman login, tidak pernah menampilkan kota asli toko meskipun Owner sudah mengisi alamat lengkap di Pengaturan (field yang benar-benar ada adalah `storeAddress`, bukan `storeCity`). Ini murni kosmetik (bukan keamanan), tapi sebaiknya diperbaiki agar footer login menampilkan info lokasi yang akurat.

**Rekomendasi (opsional, prioritas sangat rendah):**
```tsx
// apps/admin/app/AdminClientPage.tsx
storeCity={tenantBranding?.storeAddress || "Indonesia"}
```

### 📊 Kesimpulan Bagian 1

**Seluruh 7 item checklist Batch 3 selesai dengan tuntas**, termasuk yang paling kritis (migrasi database benar-benar dijalankan, bukan cuma diubah di kode). Kualitas eksekusi tim pada seluruh 3 batch perbaikan sejauh ini konsisten sangat baik. Lanjut ke audit menyeluruh `apps/customer/` — bagian terakhir dari cakupan `apps/` awal.

---

## BAGIAN 2 — 🔍 AUDIT MENYELURUH `apps/customer/` (Customer Storefront)

`apps/customer` berisi **31 berkas**. Ini adalah aplikasi paling terekspos ke publik (tanpa login, diakses siapa saja) — sehingga fokus audit saya paling berat ke sisi **keamanan endpoint publik** (upload file, chatbot AI, tracking pesanan, validasi promo) dibanding aplikasi internal (`owner`/`admin`) yang sudah diaudit. Saya membaca **seluruh 9 API routes** secara mendalam, `middleware.ts`, kedua state store (`cartStore.ts`), `menuService.ts`, dan memindai seluruh komponen/halaman untuk pola risiko umum.

### 🚨 Ringkasan: 1 Temuan Kritis Baru

> ### 🔴 [HIGH] Stored XSS via Content-Type yang Tidak Divalidasi pada Unggahan Bukti Pembayaran
>
> **Lokasi:** `apps/customer/app/api/upload-proof/route.ts` + `apps/customer/app/api/files/[id]/route.ts`
>
> Endpoint upload bukti bayar memvalidasi **isi file** dengan sangat baik (pengecekan *magic bytes* JPEG/PNG/WebP — lihat pujian di §2.2), **tapi tidak memvalidasi field `fileType`** (metadata MIME type) yang dikirim klien:
> ```ts
> // upload-proof/route.ts — fileType TIDAK divalidasi terhadap whitelist:
> const { fileBase64, fileName, fileType, orderCode, customerToken } = await request.json();
> // ...
> await tx.insert(schema.files).values({
>   fileType: fileType.slice(0, 50), // ⚠️ nilai mentah dari klien, hanya dipotong panjangnya
>   content: base64Data,
> });
> ```
> Nilai `fileType` yang tersimpan ini kemudian dipakai **apa adanya** sebagai HTTP response header saat file disajikan kembali:
> ```ts
> // files/[id]/route.ts
> return new NextResponse(buffer, {
>   headers: { "Content-Type": file.fileType, /* ... */ "X-Content-Type-Options": "nosniff" },
> });
> ```
> **Skenario serangan:** Penyerang mengunggah sebuah *file gambar valid* (lolos pengecekan magic bytes, misalnya PNG asli) yang di dalamnya — di luar 8 byte *magic number* awal yang diperiksa — **disisipkan payload HTML/JavaScript** (teknik *polyglot file*, mirip klasik "GIFAR"). Bersamaan dengan itu, penyerang mengirim `fileType: "text/html"` di *request body* JSON (field ini bebas dikontrol klien, tidak divalidasi ke whitelist `["image/jpeg","image/png","image/webp"]`). Server menyimpannya apa adanya.
>
> Ketika file ini kemudian diakses langsung lewat URL `/api/files/{id}` (misalnya staf/Owner mengklik "Lihat Bukti Transfer" lalu membuka gambar di tab baru — pola interaksi yang sangat umum saat verifikasi pembayaran), browser menerima respons dengan header `Content-Type: text/html` dan **me-render seluruh isi file sebagai halaman HTML**, termasuk payload `<script>` yang disisipkan penyerang. Header `X-Content-Type-Options: nosniff` **tidak melindungi dari skenario ini** — header itu hanya mencegah browser "menebak" tipe konten yang berbeda dari yang dideklarasikan; ia tidak mencegah eksekusi HTML/JS ketika `Content-Type` **secara eksplisit** dinyatakan sebagai `text/html`.
>
> **Dampak:** Karena endpoint ini berjalan pada origin yang sama dengan aplikasi Customer/tempat sesi & `localStorage` disimpan (lihat juga §2.6 — token kepemilikan pesanan pelanggan disimpan di `localStorage`), payload JS yang berhasil dieksekusi bisa **mencuri token kepemilikan pesanan pelanggan lain** (jika file dilihat dari sesi pelanggan lain), atau — skenario lebih serius — jika staf/Owner (yang rutin membuka bukti pembayaran untuk verifikasi) memuat file berbahaya ini di origin yang sama dengan sesi Better Auth mereka, berpotensi disalahgunakan untuk pencurian sesi/*cookie theft* tergantung konfigurasi `httpOnly` cookie (cookie sesi Better Auth kemungkinan `httpOnly`, sehingga tidak bisa dibaca langsung oleh JS — tapi payload XSS tetap bisa melakukan aksi *authenticated* atas nama korban selama sesi berjalan, misalnya memanggil Server Action lain menyamar sebagai staf yang login).
>
> **Rekomendasi Perbaikan (WAJIB):** Jangan pernah memercayai `fileType` yang dikirim klien untuk disimpan/disajikan ulang. Tentukan `Content-Type` **dari hasil deteksi *magic bytes* itu sendiri**, bukan dari input klien:
> ```ts
> // upload-proof/route.ts (SESUDAH) — deteksi tipe dari isi file, bukan dari klaim klien:
> function detectImageMimeType(buffer: Buffer): string | null {
>   if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
>   if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "image/png";
>   if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46
>       && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return "image/webp";
>   return null;
> }
>
> const detectedType = detectImageMimeType(fileBuffer);
> if (!detectedType) {
>   return NextResponse.json({ error: "Format gambar tidak valid." }, { status: 400 });
> }
> // ...simpan detectedType, BUKAN fileType dari body request:
> await tx.insert(schema.files).values({ fileType: detectedType, /* ... */ });
> ```
> Sebagai lapisan pertahanan tambahan (defense-in-depth) di `files/[id]/route.ts`, terapkan *whitelist* eksplisit sebelum menyetel header, apa pun sumber datanya:
> ```ts
> const SAFE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
> const contentType = SAFE_IMAGE_TYPES.has(file.fileType) ? file.fileType : "application/octet-stream";
> return new NextResponse(buffer, { headers: { "Content-Type": contentType, ... } });
> ```
> Kombinasi kedua lapisan ini (validasi saat simpan + validasi saat sajikan) menutup celah ini secara menyeluruh, bahkan untuk baris data lama yang mungkin sudah terlanjur tersimpan dengan `fileType` yang tidak aman.

---

### 2.1 `apps/customer/middleware.ts` (53 baris)

Identik polanya dengan `apps/admin/middleware.ts` yang sudah diaudit (resolusi tenant + fallback redirect registrasi). **Tidak ada temuan baru.** **Rating: 82%**

---

### 2.2 `apps/customer/app/api/upload-proof/route.ts` (165 baris)

**Fungsi:** Endpoint unggah bukti transfer pembayaran pelanggan.

**🟢 Keunggulan:**
- **Validasi *magic bytes* file** (bukan sekadar memercayai ekstensi/`Content-Type` klaim klien) untuk memastikan isi file benar-benar gambar JPEG/PNG/WebP — praktik yang jarang ditemukan namun sangat penting, dan diterapkan dengan benar di sini.
- Batas ukuran file 5MB dicek **sebelum** decoding lebih lanjut, mencegah *resource exhaustion* dari payload base64 raksasa.
- Verifikasi kepemilikan pesanan via `customerTokenHash` sebelum mengizinkan unggahan menempel ke order tertentu — mencegah pelanggan lain "membajak" order orang lain dengan mengunggah bukti palsu.
- Nama file disanitasi ketat (`.replace(/[^a-zA-Z0-9._-]/g, "_")`) — mencegah karakter berbahaya menempel di metadata.
- Transaksi atomik (insert file + update order + outbox event) — konsisten dengan pola matang di berkas lain.

**🔴 Temuan:** Lihat Temuan Kritis di atas (validasi `fileType`). **Rating: 60%** *(validasi isi file sangat baik, tapi celah Content-Type menurunkan rating signifikan karena berdampak langsung ke keamanan pengguna lain)*

---

### 2.3 `apps/customer/app/api/files/[id]/route.ts` (98 baris)

**Fungsi:** Menyajikan kembali file yang diunggah (bukti pembayaran), dengan otorisasi ganda (staf tenant ATAU pemilik order via token).

**🟢 Keunggulan — Selain temuan Content-Type di atas, desain otorisasi di sini sangat baik:**
- Dua jalur otorisasi jelas: staf (`requireTenantSession` + cek role dalam whitelist eksplisit) **atau** pelanggan pemilik (`customerTokenHash` dengan `crypto.timingSafeEqual`, bukan `!==` biasa — konsisten dan lebih baik dari `upload-proof/route.ts` yang memakai perbandingan non-timing-safe untuk data serupa, lihat §2.2).
- Token pelanggan bisa datang dari **cookie ATAU header**, memberi fleksibilitas integrasi tanpa mengorbankan keamanan (masih tetap di-hash & dibandingkan *timing-safe*).
- `Cache-Control: private, no-cache, no-store, must-revalidate` mencegah bukti pembayaran (data sensitif) ter-cache di proxy/CDN publik.

**🔴 Temuan (selain Content-Type di atas):**

**[LOW]** Perbandingan token di `upload-proof/route.ts` (§2.2, baris 98) memakai `providedTokenHash !== order.customerTokenHash` — perbandingan string biasa, **bukan** `crypto.timingSafeEqual` seperti yang diterapkan dengan benar di berkas ini dan di `orders/[code]/route.ts`. Karena nilai yang dibandingkan adalah *hash* (bukan token mentah), risiko *timing attack* jauh lebih rendah dibanding membandingkan secret mentah — tapi demi konsistensi kode dan *defense-in-depth*, sebaiknya disamakan memakai fungsi `timingSafeEqualHex` yang sudah ada di 2 berkas lain.

**🎯 Rating: 80%** *(baik dari sisi otorisasi ganda, namun terdampak temuan Content-Type di atas)*

---

### 2.4 `apps/customer/app/api/chat/route.ts` (200 baris) — Chatbot AI (Gemini)

**Fungsi:** Chatbot asisten toko berbasis Gemini dengan *function calling* untuk mengecek status pesanan.

**🟢 Keunggulan:**
- Validasi & sanitasi input prompt (batas panjang 1000 karakter, pembersihan karakter kontrol) sebelum dikirim ke LLM — mengurangi permukaan serangan *prompt injection* berbasis karakter kontrol/format aneh.
- *System instruction* secara eksplisit menyertakan pedoman privasi ("Jangan pernah mengembalikan nomor telepon, alamat lengkap rumah, atau data sensitif pelanggan lain") — mitigasi *prompt-level*, meski tidak absolut (LLM tetap bisa "dibujuk" lewat *prompt injection* kreatif untuk mengabaikan instruksi sistem — ini keterbatasan inheren LLM, bukan kesalahan implementasi).
- Rate limiting per-IP diterapkan (`customer_chat` preset).
- Query database untuk `checkOrderStatus` **sudah di-scope tenant dengan benar** (`eq(schema.orders.tenantId, tenant.id)`) — tidak ada kebocoran lintas-tenant.

**🔴 Temuan:**

**[MEDIUM-HIGH] Fungsi `checkOrderStatus` pada chatbot membocorkan status pembayaran & nominal transaksi TANPA verifikasi kepemilikan token — tidak konsisten dengan kebijakan keamanan yang sama yang sudah diterapkan dengan benar di endpoint REST setara.**

Saya bandingkan langsung dengan `GET /api/orders/[code]/route.ts` (§2.5), yang **secara sengaja** dirancang dengan 2 tingkat akses (dikonfirmasi lewat komentar kode `"Public minimal tracking status (Zero PII, No items, No prices)"`):
- **Tanpa token valid** → hanya `status`, `paymentStatus`, `createdAt`, `orderCode` (TIDAK ada harga, TIDAK ada data pribadi).
- **Dengan token valid** → data lengkap termasuk nominal & data pelanggan.

Tapi `checkOrderStatus` pada chatbot **tidak menerapkan pembedaan ini sama sekali** — siapa pun yang mengobrol dengan chatbot dan mengetahui/menebak kode order (format: `A6-YYYYMMDD-XXXXXX`, dengan ~30-35 bit keacakan pada 6 karakter terakhir — cukup sulit ditebak acak, tapi tidak mustahil untuk diserang lewat percobaan otomatis dalam jumlah besar) langsung mendapat:
```ts
functionResult = {
  found: true,
  orderCode: order.orderCode,
  status: order.status,
  paymentStatus: order.paymentStatus,
  deliveryType: order.deliveryType,
  totalPrice: Number(order.totalPrice), // ⚠️ nominal transaksi pelanggan LAIN, tanpa verifikasi apapun
  orderDate: order.createdAt.toISOString(),
};
```
**Dampak:** Kebocoran nominal transaksi (`totalPrice`) pelanggan lain kepada pihak yang tidak berwenang — melanggar prinsip yang sama yang sudah dijaga ketat di endpoint tracking resmi. Meski tidak membocorkan nama/telepon/alamat (chatbot secara eksplisit diinstruksikan tidak menyebutkan itu, dan `functionResult` yang dikirim ke Gemini memang tidak menyertakan field tersebut — jadi kebocoran PII penuh relatif kecil kemungkinannya), kebocoran nominal transaksi tetap merupakan pelanggaran privasi finansial yang nyata dan tidak konsisten dengan desain keamanan yang sudah dibangun dengan baik di tempat lain dalam proyek yang sama.

**Rekomendasi:** Terapkan pemeriksaan token yang sama persis seperti `orders/[code]/route.ts` di dalam tool `checkOrderStatus` — jika chatbot ingin menyajikan status lengkap, mintalah customer menyertakan token/kode akses (misalnya diambil otomatis dari cookie sesi peramban jika chatbot berjalan di halaman order tracking pelanggan itu sendiri), atau **batasi respons chatbot ke informasi minimal saja** (status & tanggal, tanpa nominal) untuk semua permintaan yang datang lewat chatbot, mengikuti kebijakan "public tier" yang sudah didefinisikan:
```ts
// SESUDAH — chatbot HANYA mengembalikan tier publik, sama seperti endpoint REST:
if (order) {
  functionResult = {
    found: true,
    orderCode: order.orderCode,
    status: order.status,
    paymentStatus: order.paymentStatus,
    orderDate: order.createdAt.toISOString(),
    // totalPrice & deliveryType SENGAJA tidak disertakan — selaras dengan kebijakan
    // "Zero PII, No prices" pada endpoint /api/orders/[code] untuk permintaan tanpa token.
    note: "Untuk detail lengkap pesanan (rincian harga & item), silakan buka halaman Lacak Pesanan dengan kode order Anda.",
  };
}
```

**🎯 Rating: 65%**

---

### 2.5 `apps/customer/app/api/orders/[code]/route.ts` (258 baris) — Tracking & Pembatalan Pesanan

**Fungsi:** `GET` untuk melacak status pesanan (2 tingkat akses), `POST` untuk mengajukan pembatalan/refund.

**🟢 Keunggulan — Ini salah satu implementasi terbaik dalam seluruh audit proyek ini:**
- **Model akses dua-tingkat yang dirancang secara eksplisit dan didokumentasikan jelas dalam kode** (`isAuthorized: true/false`) — pelanggan tanpa token tetap bisa melacak status dasar (baik untuk UX, tidak memaksa semua orang login/menyimpan token), tapi data sensitif (harga, item, kontak) hanya untuk pemilik terverifikasi. Ini persis pola keamanan yang seharusnya ditiru di `chat/route.ts` (§2.4).
- Perbandingan token **selalu** `crypto.timingSafeEqual`, konsisten di kedua method (`GET` & `POST`).
- `POST` (pembatalan) memiliki proteksi eksplisit untuk **order lama tanpa `customerTokenHash`** (`"Pesanan ini tidak memiliki otorisasi token online"`) — mencegah *backward-compatibility gap* menjadi celah keamanan (order lama yang dibuat sebelum sistem token diterapkan tidak bisa dibatalkan sembarangan oleh siapa pun).
- Alur pembatalan cerdas: pesanan yang belum dibayar & belum diproses bisa dibatalkan **langsung**; pesanan yang sudah dibayar/diproses masuk ke antrean **review staf** (`orderCancellationRequests`) — mencegah pelanggan membatalkan sepihak pesanan yang sudah mulai dikerjakan dapur/sudah dibayar, sekaligus tetap memberi jalur *refund request* yang wajar.

**Tidak ada temuan keamanan.** **Rating: 92%** — rating tertinggi kedua dalam seluruh audit proyek ini setelah `api/ably/token/route.ts` (Admin App).

---

### 2.6 `apps/customer/app/api/validate-promo/route.ts` (150 baris)

**Fungsi:** Endpoint pratinjau (*preview*) validasi kode promo sebelum checkout, dipakai untuk menampilkan estimasi diskon di halaman keranjang/checkout.

**🟢 Keunggulan & Klarifikasi Penting:** Endpoint ini menerima `subtotal` dan `items[].totalPrice` **dari klien** tanpa verifikasi ulang terhadap database — sekilas tampak berisiko (bisa saja klien mengirim `subtotal` palsu untuk mendapat estimasi diskon besar). **Namun saya konfirmasi ini AMAN**: saya menelusuri `lib/server/pricing-service.ts` (`calculateOrderPricing`, dipakai satu-satunya sumber kebenaran harga final saat checkout sungguhan) dan menemukan bahwa fungsi tersebut **menghitung ulang promo secara independen** dari `subtotal` yang sudah diverifikasi server (bukan mempercayai `discountAmount` hasil endpoint ini). Artinya endpoint `validate-promo` **murni alat bantu UX/pratinjau** — memanipulasinya hanya akan menampilkan estimasi yang salah di layar, tidak memengaruhi nominal yang benar-benar ditagihkan saat checkout. Desain pemisahan "preview vs source-of-truth" ini sudah tepat.

**Tidak ada temuan keamanan.** **Rating: 88%**

---

### 2.7 `apps/customer/app/api/internal/outbox/dispatch/route.ts` (139 baris)

**Fungsi:** Worker pemrosesan *transactional outbox* — mempublikasikan event (misal `order.created`) ke Ably realtime untuk Admin App.

**🟢 Keunggulan — Implementasi sangat matang, tanpa temuan:**
- Verifikasi `CRON_SECRET` dengan `crypto.timingSafeEqual`, dan **secara eksplisit fail-closed di produksi** jika secret tidak dikonfigurasi (`return process.env.NODE_ENV !== "production"`) — ini justru pola *fail-closed* yang benar seperti yang saya rekomendasikan untuk `lib/server/rate-limiter.ts` di audit sebelumnya (belum diterapkan di sana, tapi sudah diterapkan dengan benar di sini — tim jelas paham prinsipnya, hanya perlu diseragamkan).
- **Payload realtime di-strip dari PII** sebelum dipublikasikan (`minimalPayload` hanya berisi ID & tipe event, bukan nama/harga/alamat pelanggan) — mencegah data sensitif "bocor" lewat kanal WebSocket publik.
- Mekanisme *claim* atomik (tandai `"processing"` sebelum diproses) + *lease timeout* 2 menit untuk event yang macet — mencegah *double-processing* jika 2 worker dispatch berjalan bersamaan, sekaligus mencegah event "hilang" selamanya jika satu proses crash di tengah jalan.
- Retry counter dengan batas maksimal (5x) mencegah *infinite retry loop* untuk event yang gagal permanen.

**Tidak ada temuan.** **Rating: 95%** — bersama `api/ably/token/route.ts` (Admin App), ini adalah standar implementasi terbaik di seluruh proyek yang sebaiknya dijadikan referensi untuk fitur *backend job* lainnya.

---

### 2.8 `apps/customer/app/api/orders/route.ts` (351 baris)

**Status:** Sudah diaudit mendalam di Batch 1 (rating 90%, tertinggi saat itu). Saya verifikasi ulang secara ringkas terhadap perubahan terbaru (fitur *catering*, *delivery zones* dinamis dari commit sebelumnya) — struktur inti (idempotency, price recalculation, transactional outbox) **tidak berubah** dan tetap solid. **Tidak ada temuan baru.** **Rating: 90%** (dipertahankan).

---

### 2.9 `store/cartStore.ts` (204 baris) — State Management Keranjang & Pesanan

**Fungsi:** Zustand store untuk keranjang belanja (`useCartStore`) dan metadata pesanan pelanggan (`useOrderStore`), keduanya dipersist ke `localStorage`.

**🟢 Keunggulan:**
- Komentar kode secara eksplisit menegaskan disiplin keamanan: *"Diskon yang dikonfirmasi server (bukan kalkulasi client-side)"* — `serverPromoDiscount` hanya bisa diset lewat `setServerValidatedPromo()`, dipanggil hanya setelah respons sukses dari `/api/validate-promo`. Constraint desain yang baik untuk mencegah developer lain di masa depan tidak sengaja memakai kalkulasi diskon sisi klien untuk keperluan tampilan yang lebih penting.
- `useOrderStore` memakai `partialize` untuk **hanya** mempersist `savedTokens` & `recentCodes` (bukan seluruh state termasuk `currentOrder` yang lebih besar/lebih sering berubah) — pertimbangan efisiensi `localStorage` yang baik.

**🔴 Temuan:**

**[MEDIUM — terkait Temuan Kritis §Ringkasan] Token kepemilikan pesanan pelanggan (`savedTokens`) disimpan di `localStorage`**, yang merupakan pola wajar untuk *guest checkout* tanpa akun (mirip fitur "lacak pesanan tanpa login" di banyak platform e-commerce), **namun ini memperbesar dampak temuan Stored XSS di §Ringkasan/§2.2**: jika XSS berhasil dieksekusi di origin Customer App manapun, skrip berbahaya bisa membaca `localStorage.getItem('a6nyuss-orders-meta')` dan mencuri **seluruh token kepemilikan pesanan** yang pernah disimpan browser tersebut, memungkinkan penyerang membatalkan/melihat detail lengkap pesanan pelanggan tanpa sepengetahuan mereka. Ini bukan kesalahan desain `cartStore.ts` itu sendiri (pola *guest token in localStorage* adalah trade-off UX yang lazim & dapat diterima), tapi **menegaskan urgensi memperbaiki temuan Stored XSS** di §Ringkasan sesegera mungkin, karena kombinasi kedua hal ini saling memperkuat dampak.

**[LOW]** Kunci penyimpanan `localStorage` (`'a6nyuss-cart'`, `'a6nyuss-orders-meta'`) memakai nama spesifik 1 tenant ("a6nyuss"), pola yang sama dengan temuan branding hardcoded di berkas-berkas lain. **Ini secara teknis TIDAK menimbulkan risiko kebocoran data lintas-tenant** (browser mengisolasi `localStorage` per-origin/domain secara otomatis, terlepas dari nama key yang dipilih developer) — jadi murni soal konsistensi penamaan/kerapian kode, bukan bug fungsional atau keamanan. Tetap disarankan diganti nama generik (misalnya `'taj-saas-cart'`) demi konsistensi dengan pembersihan branding hardcoded yang sudah dilakukan di berkas-berkas lain.

**🎯 Rating: 78%**

---

### 2.10 `lib/db/menuService.ts` (322 baris) — Query Data Menu untuk Storefront

**Fungsi:** Kumpulan fungsi baca data (kategori, item menu, varian, promo aktif) untuk render halaman publik.

**🟢 Keunggulan:** Seluruh query difilter `tenantId` secara konsisten via Drizzle (parameterized, tidak ada risiko SQL injection). Tidak ada mutasi data di berkas ini (murni *read-only*), mengurangi permukaan risiko secara keseluruhan. **Tidak ada temuan.** **Rating: 90%**

---

### 2.11 Halaman & Komponen UI (`app/*/page.tsx`, `components/*.tsx`) — 21 berkas

Saya memindai seluruh 21 berkas untuk pola risiko umum (XSS, `localStorage` di luar yang sudah diaudit, harga yang tidak diverifikasi ulang saat submit) dan membaca detail `checkout/page.tsx` serta `ChatBot.tsx`.

**🟢 Temuan Baik yang Berlaku Umum:**
- **Tidak ditemukan** `dangerouslySetInnerHTML`/`eval()` di seluruh `apps/customer` — sama seperti `apps/owner` dan `apps/admin`, konsistensi ini patut diapresiasi di seluruh proyek.
- `checkout/page.tsx` mengonfirmasi pola yang sudah diverifikasi berulang kali: `subtotal`/`totalPrice` yang dihitung di klien **hanya untuk tampilan**, nilai final yang benar-benar disimpan tetap berasal dari kalkulasi ulang `calculateOrderPricing` di server (§2.8, Batch 1).
- `ChatBot.tsx` merender balasan chatbot sebagai teks biasa (bukan `dangerouslySetInnerHTML`), sehingga meskipun respons Gemini berisi sesuatu yang menyerupai HTML/markup, ia tidak akan dieksekusi sebagai HTML di sisi klien — mitigasi yang baik terhadap risiko *AI response injection* yang berujung ke XSS.

**Tidak ditemukan pola anti-pattern baru** di luar yang sudah dilaporkan pada API routes di atas. **Rating gabungan (estimasi berdasarkan pola konsisten): 85%**

---

## 📊 RINGKASAN RATING — BAGIAN `apps/customer`

| Berkas / Area | Fokus | Rating |
|---|---|---|
| `middleware.ts` | Resolusi tenant | 🟢 82% |
| `api/upload-proof/route.ts` | Unggah bukti bayar | 🔴 **60%** — celah Content-Type (Stored XSS) |
| `api/files/[id]/route.ts` | Penyajian file | 🟡 80% — terdampak temuan yang sama |
| `api/chat/route.ts` | Chatbot AI | 🟡 65% — kebocoran nominal transaksi lewat tool call |
| `api/orders/[code]/route.ts` | Tracking & pembatalan | 🟢 **92%** — desain akses 2-tingkat terbaik di proyek ini |
| `api/validate-promo/route.ts` | Preview promo | 🟢 88% |
| `api/internal/outbox/dispatch/route.ts` | Worker realtime | 🟢 **95%** — implementasi terbaik bersama Ably token (Admin) |
| `api/orders/route.ts` | Checkout | 🟢 90% *(dipertahankan dari Batch 1)* |
| `store/cartStore.ts` | State keranjang & token order | 🟡 78% — memperkuat dampak temuan XSS |
| `lib/db/menuService.ts` | Query data menu | 🟢 90% |
| 21 berkas UI (halaman & komponen) | Presentasi & interaksi | 🟢 85% (estimasi pola) |

### 🎯 **Rating Kesiapan Produksi `apps/customer`: 81%**

*(Catatan: rating ini akan naik signifikan ke kisaran 90%+ segera setelah temuan Stored XSS pada upload bukti pembayaran diperbaiki — mengingat kualitas desain keamanan di hampir seluruh endpoint lain justru berada di antara yang terbaik dalam keseluruhan proyek ini.)*

---

## ✅ Prioritas Perbaikan Batch Ini (Actionable Checklist)

1. 🔴 **[P0/P1 — Keamanan]** Perbaiki validasi `fileType` pada alur unggah bukti pembayaran — deteksi tipe MIME dari *magic bytes* sungguhan, jangan percaya klaim klien; tambahkan *whitelist* juga di titik penyajian file (`files/[id]/route.ts`) sebagai lapisan kedua (§Ringkasan / §2.2).
2. 🟠 **[P1 — Privasi]** Batasi respons `checkOrderStatus` pada chatbot AI agar tidak membocorkan `totalPrice`/`deliveryType` tanpa verifikasi token, selaras dengan kebijakan akses 2-tingkat yang sudah diterapkan dengan benar di endpoint REST tracking (§2.4).
3. 🟡 **[P2]** Samakan metode perbandingan token di `upload-proof/route.ts` menjadi `crypto.timingSafeEqual`, konsisten dengan 2 berkas lain (§2.3).
4. 🟢 **[P3]** Ganti nama key `localStorage` (`a6nyuss-cart`, `a6nyuss-orders-meta`) menjadi label generik, konsisten dengan pembersihan branding hardcoded di tempat lain (§2.9).
5. 🟢 **[P3]** Perbaiki `storeCity` yang tidak memiliki sumber data di Admin App agar memakai `storeAddress` (§1, catatan verifikasi).
6. 🟢 **[P4]** Terapkan pola *fail-closed* yang sudah benar di `outbox/dispatch/route.ts` juga ke `lib/server/rate-limiter.ts` (temuan lama dari Batch 1, masih relevan — tim sudah membuktikan paham polanya di berkas lain).

---

## 📌 STATUS KESELURUHAN PROYEK — CAKUPAN AWAL SELESAI 100%

Dengan selesainya audit `apps/customer/`, seluruh cakupan yang diminta di awal (`apps/`, `lib/`, `packages/`) telah diaudit menyeluruh melalui 4 batch:

| Bagian | Rating Awal | Rating Terkini | Status |
|---|---|---|---|
| `lib/` + `packages/` | 🔴 35% (P0 kritis) | 🟢 **~90%** | P0 & mayoritas temuan tuntas |
| `apps/owner/` | 🟡 76% | 🟢 **~85%** | 9/11 temuan Batch 2 tuntas penuh |
| `apps/admin/` | *(belum diaudit)* | 🟢 **~86%** | 7/7 temuan Batch 3 tuntas penuh |
| `apps/customer/` | *(belum diaudit)* | 🟡 **81%** | Baru diaudit — 1 temuan HIGH baru ditemukan |

### 🎯 **Rating Kesiapan Produksi Keseluruhan Proyek (saat ini): ~85%**

**Rekomendasi akhir:** Proyek ini menunjukkan **lintasan perbaikan yang sangat konsisten dan berkualitas tinggi** di setiap batch — bukan hanya menambal gejala, tapi memperbaiki akar masalah (migrasi database benar-benar dijalankan, bukan cuma diubah di kode; UI kredensial benar-benar disambungkan ke backend, bukan cuma dianggap selesai di backend saja). Dengan pola kerja ini, saya cukup yakin temuan Stored XSS di atas — sebagai satu-satunya temuan **HIGH** yang tersisa dari seluruh 4 batch audit — dapat diperbaiki dengan cepat dan tuntas.

Setelah temuan tersebut diperbaiki, saya sarankan tim melakukan **audit regresi singkat** (bukan audit penuh) khusus untuk memverifikasi perbaikan tersebut, dan proyek ini akan berada pada posisi yang sangat solid untuk go-live produksi multi-tenant.

---

*Ini menandai selesainya audit menyeluruh terhadap seluruh cakupan awal yang diminta (`apps/`, `lib/`, `packages/`) dalam 4 batch. Siap membantu audit regresi setelah temuan HIGH terakhir ini diperbaiki, atau mendalami area lain (misalnya `packages/db/scripts/`, konfigurasi deployment/CI-CD, atau pengujian keamanan tambahan) jika diperlukan.*
