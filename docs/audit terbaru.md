# Laporan Audit Menyeluruh Folder `apps`

**Tanggal:** 17 Agustus 2026  
**Patokan:** `docs/CODE_AUDIT_PLAN_APPS.md`  
**Ledger:** `docs/audit/APP_CODE_AUDIT_LEDGER.md`  
**Baseline:** `docs/audit/APP_CODE_AUDIT_BASELINE.md`

## 1. Executive Summary

Seluruh **168 file** di `apps/admin`, `apps/customer`, dan `apps/owner` telah masuk ledger dan diperiksa melalui pembacaan statis, penelusuran antarfile, TypeScript, ESLint, production build, dependency audit, serta pemeriksaan metadata aset.

Build dan TypeScript saat ini lulus, tetapi kondisi tersebut **belum berarti aplikasi aman atau benar secara bisnis**. Risiko tertinggi berada pada empat area:

1. **Server action admin tidak melakukan autentikasi/otorisasi server-side.** UI menyembunyikan dashboard, tetapi server action tetap mempercayai tenant dari hostname/header.
2. **Identitas user tidak diikat ke tenant yang sedang diakses.** Owner yang valid dapat beroperasi pada hostname tenant lain karena action hanya memakai tenant hasil hostname.
3. **Beberapa operasi HR dan inventory dapat mengubah/menghapus data lintas tenant** akibat query tahap kedua yang tidak lagi memiliki filter tenant.
4. **Alur customer masih menggunakan possession-only order code** untuk membaca PII, membatalkan order, atau mengganti bukti pembayaran; tidak ada customer token, rate limit, maupun verifikasi nomor telepon.

Selain itu ditemukan masalah besar pada konsistensi keuangan, filter tanggal dashboard, upload bukti pembayaran, penyimpanan branding, konfigurasi real-time Ably, dependency rentan, dan pengujian.

### Rekap temuan utama

| Severity | Jumlah |
|---|---:|
| Critical | 4 |
| High | 17 |
| Medium | 18 |
| Low/Info | 10 |
| **Total** | **49** |

> Severity menilai dampak kode saat ini. Temuan yang bergantung pada konfigurasi deployment ditandai sebagai kondisi yang perlu diverifikasi.

## 2. Hal yang Sudah Baik

- Semua aplikasi mengaktifkan TypeScript `strict`.
- Type-check ketiga aplikasi lulus tanpa error.
- ESLint ketiga aplikasi lulus tanpa error.
- Production build ketiga aplikasi berhasil.
- Query utama owner pada umumnya sudah menyertakan `tenantId`.
- Query chatbot terhadap order sekarang sudah menyertakan `tenantId`.
- Upload proof sekarang membatasi ukuran sekitar 5 MB dan memeriksa prefix MIME `image/`.
- Harga dasar order customer dihitung ulang dari database.
- Modifier varian dihitung ulang dari opsi server/static, bukan langsung mempercayai angka client.
- Query order admin mengambil item secara batch dan menghindari N+1.
- Status toko admin sudah dibaca oleh customer melalui `branding.storeOpen`.
- `deliveryFee` kini memiliki kolom tersendiri pada schema order.
- Order code customer menggunakan `crypto.randomBytes`, bukan `Math.random()`.
- Subscription Ably dibersihkan saat dashboard admin unmount.

## 3. Temuan Critical

### SEC-001 — Server action admin tidak memiliki autentikasi dan RBAC server-side

**Lokasi:**

- `apps/admin/middleware.ts:5-38`
- `apps/admin/app/actions.ts:10-34`
- seluruh export action di `apps/admin/app/actions.ts:38-668`
- `apps/admin/app/AdminClientPage.tsx:42-44`

**Masalah:** Middleware admin hanya menyelesaikan tenant; tidak ada pemeriksaan session atau role. Pemeriksaan role hanya terjadi di client component. Semua server action mengambil tenant dari header lalu menjalankan query tanpa memverifikasi session, profile, atau role.

**Dampak:** Caller yang memperoleh referensi Server Action dapat membaca order/PII, mengubah status order, memverifikasi pembayaran, membuka/menutup shift, mengubah ketersediaan menu, menutup toko, dan membuat order POS tanpa login yang valid.

**Rekomendasi:** Buat helper server tunggal seperti `requireTenantRole(['owner','manager','kasir'])` yang:

1. Memanggil `auth.api.getSession()` menggunakan request headers.
2. Mengambil profile user dari DB.
3. Memastikan `profile.tenantId === x-tenant-id`.
4. Memastikan role diizinkan per action.
5. Menolak request jika header tenant kosong atau berbeda.

Jangan mengandalkan client rendering atau middleware sebagai satu-satunya kontrol akses.

### SEC-002 — Session owner tidak diikat ke tenant hostname

**Lokasi:**

- `apps/owner/middleware.ts:26-54`
- `apps/owner/app/actions/_tenantHelper.ts:12-23`
- seluruh action owner yang memanggil `getTenantId()`

**Masalah:** Middleware hanya menolak role `kasir`; role lain, role kosong, manager, atau string tak dikenal dapat lolos. Setelah itu `getTenantId()` hanya menggunakan slug dari hostname dan tidak memeriksa bahwa user/session memiliki profile pada tenant tersebut.

**Alur eksploitasi:**

`session owner Tenant A → buka hostname owner Tenant B → middleware menerima role owner → getTenantId() memilih Tenant B dari hostname → action membaca/mengubah Tenant B`.

**Dampak:** Kebocoran dan modifikasi data lintas tenant pada seluruh dashboard owner.

**Rekomendasi:** Tenant harus berasal dari irisan antara hostname dan membership session. Terapkan role allowlist eksplisit (`owner`, atau `superadmin` jika benar-benar ada), bukan sekadar blacklist `kasir`.

### SEC-003 — Operasi HR dapat mengubah atau menghapus user tenant lain

**Lokasi:**

- `apps/owner/app/actions/hr.ts:82-96`
- `apps/owner/app/actions/hr.ts:103-113`

**Masalah:**

- `updateEmployeeAction()` meng-update `schema.user` berdasarkan ID tanpa tenant filter sebelum profile tenant diverifikasi.
- `deleteEmployeeAction()` menghapus profile dengan tenant filter, tetapi tetap menghapus account dan user berdasarkan ID walaupun profile tidak ditemukan.

**Dampak:** Dengan ID user tenant lain, caller dapat mengganti nama atau menghapus akun user lintas tenant. Penghapusan user juga menghapus session/account melalui relasi cascade.

**Rekomendasi:** Query profile milik tenant terlebih dahulu; jika tidak ditemukan, hentikan. Gunakan ID hasil query tersebut untuk semua operasi berikutnya dalam transaksi atomik. Larang penghapusan owner terakhir dan self-delete tanpa prosedur khusus.

### SEC-004 — Inventory menerima mass assignment dan referensi lintas tenant

**Lokasi:**

- `apps/owner/app/actions/inventory.ts:73-78`
- `apps/owner/app/actions/inventory.ts:85-116`

**Masalah:**

- `{ tenantId, ...data }` memungkinkan `data.tenantId` menimpa tenant server.
- `createWasteLogAction()` menerima `inventoryId` dan `branchId` tanpa membuktikan keduanya milik tenant.
- Select/update stok hanya berdasarkan `inventory.id`, tanpa tenant filter.

**Dampak:** Pembuatan inventory pada tenant lain, pencatatan transaksi silang, dan pengurangan stok tenant lain.

**Rekomendasi:** Gunakan schema input eksplisit dan jangan spread object client ke query. Query inventory dan branch dengan kombinasi `id + tenantId`; lakukan insert transaksi dan pengurangan stok dalam satu transaksi dengan locking/atomic decrement.

## 4. Temuan High

### SEC-005 — Resolver hostname/domain tidak konsisten dan fallback ke tenant default

**Lokasi:**

- `packages/shared/index.ts:73-95`
- `packages/shared/tenant.ts:133-157`
- `apps/owner/app/actions/authActions.ts:50-67`

**Masalah:** Registrasi membuat `slug = martabak-pakde` dan `domain = martabak-pakde.com`, tetapi parser production menghasilkan slug `martabak-pakde.com`. Lookup kemudian dilakukan pada kolom `tenants.slug`, gagal, dan fallback ke `taj-saas`. Unknown host juga dapat diarahkan diam-diam ke tenant default lalu dicache dengan key host yang salah.

**Dampak:** Tenant baru dapat gagal dibuka, request domain lain dapat melihat tenant default, dan isolasi tenant menjadi bergantung pada fallback.

**Rekomendasi:** Resolve custom domain terhadap `tenants.domain`; resolve subdomain terhadap `tenants.slug`; hapus fallback tenant pada production; jangan memetakan `a6-nyuss` secara hardcoded.

### SEC-006 — Lookup menu order customer tidak difilter tenant

**Lokasi:** `apps/customer/app/api/orders/route.ts:77-91`

**Masalah:** `menuItems` dipilih hanya dengan `inArray(slug)` tanpa `tenantId`. Slug juga tidak unique per tenant.

**Dampak:** Item tenant lain dengan slug sama dapat menentukan harga, availability, varian, dan `menuItemId` order tenant saat ini. Hasil bergantung pada urutan row database.

**Rekomendasi:** Tambahkan `and(eq(menuItems.tenantId, tenant.id), inArray(...))`; validasi category dan varian dari tenant yang sama; tambahkan unique index `(tenant_id, slug)`.

### SEC-007 — Order code berfungsi sebagai satu-satunya authorization secret

**Lokasi:**

- `apps/customer/app/api/orders/[code]/route.ts:7-88`
- `apps/customer/app/api/orders/[code]/route.ts:93-184`
- `apps/customer/app/tracking/page.tsx:395-409`

**Masalah:** Siapa pun yang mengetahui order code dapat membaca nama, nomor HP, alamat, item, total, dan bukti pembayaran. Caller yang sama dapat membatalkan order atau mengganti `paymentProofUrl`. Tidak ada customer token, verifikasi nomor HP, session, atau rate limit.

**Dampak:** IDOR/akses PII dan modifikasi order ketika code bocor melalui screenshot, WhatsApp, log, referer, atau perangkat bersama.

**Rekomendasi:** Saat membuat order, keluarkan customer access token acak terpisah dan simpan hash-nya. GET/PUT harus membutuhkan token tersebut. Alternatif: OTP nomor HP. Tambahkan rate limit dan response minimal.

### SEC-008 — Public Ably API key dan PII pada channel realtime

**Lokasi:**

- `apps/admin/store/adminStore.ts:301-389`
- `apps/customer/app/api/orders/route.ts:225-239`
- environment `NEXT_PUBLIC_ABLY_API_KEY`

**Masalah:** Admin membuat `Realtime({ key: NEXT_PUBLIC_ABLY_API_KEY })`. API key yang ditempatkan di browser dapat dicuri. Event `new-order` membawa object order yang berisi nama, nomor HP, alamat, dan detail transaksi.

**Dampak:** Jika capability key tidak dibatasi secara sangat ketat, attacker dapat subscribe channel tenant, membaca PII, atau publish event palsu ke dashboard admin.

**Rekomendasi:** Jangan pernah mengirim Ably API key ke browser. Gunakan token authentication endpoint server-side, capability terbatas pada channel tenant session, TTL pendek, dan subscribe-only bila sesuai.

### SEC-009 — Upload gambar dapat menjadi stored active content dan storage abuse

**Lokasi:**

- `apps/customer/app/api/upload-proof/route.ts:8-36`
- `apps/customer/app/api/files/[id]/route.ts:18-27`

**Masalah:** Server mempercayai `fileType` client selama diawali `image/`, tidak memeriksa magic bytes, dan mengizinkan SVG. File disajikan inline dengan MIME pilihan user dan tanpa `X-Content-Type-Options: nosniff`/safe disposition. Upload juga tetap membuat file saat `orderCode` invalid dan tidak memiliki rate limit.

**Dampak:** Stored active content/XSS pada origin aplikasi, storage DoS, dan orphan files.

**Rekomendasi:** Allowlist JPEG/PNG/WebP, verifikasi signature setelah decode, tolak SVG, validasi order/token sebelum insert, gunakan object storage, tambahkan quota/rate limit, dan serve dengan security headers.

### BUG-001 — Upload bukti pada halaman tracking menyimpan gambar mock, bukan file user

**Lokasi:** `apps/customer/app/tracking/page.tsx:84-146`

**Masalah:** File user hanya diperiksa ukurannya. Fungsi lalu menyimpan URL tetap `placehold.co/...Bukti+Transfer+MOCK` melalui PUT.

**Dampak:** Admin menerima bukti pembayaran palsu yang sama untuk semua pelanggan yang membayar kemudian. Verifikasi pembayaran menjadi tidak dapat dipercaya.

**Rekomendasi:** Gunakan endpoint upload proof yang sama dengan checkout dan hapus jalur PUT URL arbitrer.

### BUG-002 — Redirect setelah upload QRIS menuju route yang tidak ada

**Lokasi:** `apps/customer/app/checkout/page.tsx:131`

**Masalah:** Kode mengarahkan ke `/tracking/${orderCode}`, sedangkan aplikasi hanya memiliki `/tracking/page.tsx`; tidak ada `tracking/[code]/page.tsx`.

**Dampak:** Pengguna mendapat 404 setelah berhasil upload bukti dari checkout.

**Rekomendasi:** Arahkan ke `/tracking?code=...` dan implementasikan pembacaan query, atau buat dynamic route yang benar.

### BUG-003 — Penyimpanan branding mengganti seluruh JSON dan menghapus setting lintas aplikasi

**Lokasi:**

- `apps/owner/app/actions/settings.ts:18-23`
- `apps/owner/app/(dashboard)/pengaturan/page.tsx:108-123`
- pembaca di `apps/customer/lib/db/menuService.ts:118-133`

**Masalah:** Form owner mengirim sebagian field lalu action mengganti seluruh `branding`. Field yang tidak ada di form—misalnya `storeOpen`, `flatDeliveryFee`, `minimumOrderAmount`, `storeAddress`, `outletLat`, `outletLng`, `openingHours`—hilang.

**Dampak:** Menyimpan warna/QRIS dapat membuka kembali toko, mereset ongkir/lokasi/alamat, dan mengubah perilaku customer.

**Rekomendasi:** Read-modify-write dengan schema tervalidasi atau pecah settings menjadi kolom/tabel typed. Gunakan optimistic concurrency/version jika beberapa aplikasi dapat menulis settings.

### BUG-004 — Admin menerima status bebas, tidak punya state machine, dan dapat mencatat pembayaran ganda

**Lokasi:**

- `apps/admin/app/actions.ts:112-174`
- `apps/admin/app/actions.ts:184-241`

**Masalah:** `newStatus` bertipe string tanpa allowlist/transisi. Pemanggilan `completed` berulang pada COD atau verifikasi `paid` berulang selalu menambah `shiftLogs.cash_in` lagi.

**Dampak:** Status invalid dan kas shift terduplikasi.

**Rekomendasi:** Terapkan state machine dan conditional update berdasarkan status lama. Buat payment ledger dengan unique key per order/event agar idempotent.

### SEC-010 — `closeShiftAction` dapat menutup shift tenant lain dan mempercayai expected cash client

**Lokasi:** `apps/admin/app/actions.ts:359-383`

**Masalah:** Update shift hanya berdasarkan `shiftId`, tanpa `tenantId` atau status `open`. `expectedCash` berasal dari client dan digunakan menghitung drift serta audit text.

**Dampak:** Cross-tenant mutation dan rekonsiliasi kas yang dapat dimanipulasi.

**Rekomendasi:** Filter `shift.id + tenantId + status=open`; hitung expected cash di server dari ledger; validasi actual cash finite/nonnegative.

### SEC-011 — POS offline mempercayai harga dan total dari client

**Lokasi:**

- `apps/admin/components/POSOfflineModal.tsx:119-151`
- `apps/admin/app/actions.ts:614-659`

**Masalah:** Client mengirim harga setiap item dan grand total; server menyimpannya langsung tanpa lookup menu, pajak, availability, atau rekonsiliasi subtotal-total.

**Dampak:** Caller dapat membuat order completed/paid dengan nilai arbitrer dan merusak laporan keuangan.

**Rekomendasi:** Kirim ID/qty saja. Server harus mengambil harga/menu tenant, menghitung pajak/service, dan total sendiri.

### BUG-005 — Filter tanggal dan cabang owner sebagian besar tidak bekerja

**Lokasi:**

- `apps/owner/app/actions/analytics.ts:9-61`
- `apps/owner/app/actions/finance.ts:7-81,149-176`
- `apps/owner/store/ownerStore.ts`

**Masalah:** Parameter `dateRange` diterima tetapi tidak digunakan pada query. `selectedBranchId` berada di global store, tetapi mayoritas action tidak menerimanya dan tidak memfilter branch.

**Dampak:** UI memberi kesan laporan “hari ini/7 hari/bulan/custom/cabang”, padahal data biasanya seluruh waktu dan seluruh cabang.

**Rekomendasi:** Bentuk range UTC dari timezone tenant, gunakan `gte/lte`, filter branch server-side, dan tampilkan label hanya jika query benar-benar menerapkannya.

### BUG-006 — Revenue/P&L dapat memasukkan order batal dan metrik antarhalaman tidak konsisten

**Lokasi:**

- `apps/owner/app/actions/finance.ts:13-26,88-100`
- `apps/owner/app/actions/branches.ts:14-26`
- `apps/owner/app/actions/analytics.ts:216-240`

**Masalah:** Finance/branch memakai kondisi `completed OR paid`, sehingga order `cancelled + paid` ikut masuk. Top menu tidak memfilter status sama sekali. Revenue overview hanya memakai `completed`.

**Dampak:** Omzet, P&L, cabang, dan top menu dapat menampilkan angka yang saling berbeda.

**Rekomendasi:** Definisikan satu kontrak “recognized revenue” dan gunakan helper/query bersama di seluruh modul.

### SEC-012 — Dependency produksi memiliki 23 jalur vulnerability High

**Lokasi:** package manifests/lockfile, terutama Next 16.2.6 dan xlsx 0.18.5.

**Masalah:** Audit menemukan 40 vulnerability path. Next yang digunakan terdampak middleware bypass, Server Action DoS/SSRF, dan endpoint disclosure hingga versi 16.2.10.

**Dampak:** Sangat relevan karena aplikasi mengandalkan middleware dan Server Actions sebagai boundary.

**Rekomendasi:** Prioritaskan Next `>=16.2.11`, Better Auth `>=1.6.22`, dan transitive updates. Evaluasi penggantian `xlsx` karena advisory registry tidak menyediakan patched npm version.

### BUG-007 — Registrasi tenant tidak atomik dan dapat meninggalkan tenant yatim

**Lokasi:**

- `apps/owner/app/actions/authActions.ts:38-99`
- `lib/auth.ts:27-91`

**Masalah:** Tenant dan branch dibuat sebelum user. Jika sign-up gagal (misalnya email sudah ada), tenant/branch tetap ada. Slug collision memakai loop non-atomic. Better Auth hook membuat profile pada tenant default lalu action memindahkannya ke tenant baru.

**Dampak:** Orphan tenant, race pada slug, dan membership sementara/polusi tenant default.

**Rekomendasi:** Gunakan transaksi/compensating cleanup, unique conflict handling, dan onboarding flow tunggal yang tidak bersaing dengan global user hook.

### BUG-008 — Notes customer tidak pernah sampai ke order

**Lokasi:**

- `apps/customer/app/checkout/page.tsx:235-252`
- `apps/customer/app/api/orders/route.ts:209`

**Masalah:** API mengharapkan `item.note`, tetapi payload checkout tidak mengirim `note`; `generalNote` juga tidak dikirim.

**Dampak:** Instruksi alergi/pedas/tanpa bahan hilang sebelum dapur/kasir melihat order.

**Rekomendasi:** Definisikan DTO bersama dan kirim/validasi note dengan batas panjang. Jangan gunakan notes untuk data yang membutuhkan struktur khusus seperti alergi.

### BUG-009 — Server tidak menegakkan status toko, required variant, atau jarak delivery

**Lokasi:** `apps/customer/app/api/orders/route.ts:31-222`

**Masalah:** Proteksi hanya ada di UI. Request langsung tetap dapat membuat order saat `storeOpen=false`, menghilangkan required variant, dan memilih salah satu fee allowlist termasuk `0` untuk delivery. Koordinat/jarak tidak dikirim sebagai field terstruktur dan tidak diverifikasi server.

**Dampak:** Order di luar jam operasional, undercharge ongkir, dan item tanpa varian wajib.

**Rekomendasi:** Semua aturan bisnis harus divalidasi ulang di server dari konfigurasi tenant dan data menu.

## 5. Temuan Medium

### ARCH-001 — Pembuatan order dan item tidak atomik

Order diinsert pada `apps/customer/app/api/orders/route.ts:196`, lalu item diinsert pada baris 222. Jika tahap kedua gagal, order kosong tetap tersimpan. Pola non-atomik serupa muncul pada shift, audit log, HR, inventory, dan registrasi.

Gunakan driver/transport yang mendukung transaksi atau stored procedure/CTE atomik. Jika tidak memungkinkan, implementasikan idempotency dan compensating action yang eksplisit.

### BUG-010 — Tidak ada idempotency checkout

Double click, retry browser, atau timeout dapat membuat beberapa order karena request tidak memiliki idempotency key. Tombol loading membantu UI normal, tetapi tidak melindungi retry jaringan atau request langsung.

### BUG-011 — Input API order tidak memiliki schema runtime yang ketat

`request.json()` dicast menjadi interface TypeScript. Tidak ada batas jumlah item, panjang nama/alamat/note, finite-number check, atau pemeriksaan tipe quantity. Nilai `NaN`, string coercion, payload sangat besar, dan text sangat panjang dapat menghasilkan 500/abuse.

Gunakan Zod/Valibot atau validator setara dengan batas eksplisit.

### BUG-012 — Promo validation endpoint menghitung dari subtotal/item client

`apps/customer/app/api/validate-promo/route.ts` aman sebagai preview, tetapi hasilnya dapat dibesar-besarkan karena subtotal dan category total dipercaya dari client. Checkout menghitung ulang, sehingga bukan fraud final, namun UI dapat menampilkan diskon yang tidak sesuai sebelum submit. Persentase promo juga tidak diclamp 0–100 pada kedua endpoint.

### SEC-013 — File bukti pembayaran dicache publik satu tahun

`apps/customer/app/api/files/[id]/route.ts:24` memakai `Cache-Control: public, max-age=31536000` untuk data finansial/PII. Setelah akses diberikan, intermediary/browser dapat menyimpan bukti selama satu tahun. Gunakan private/no-store atau signed short-lived object URL.

### SEC-014 — Endpoint Sentry test tersedia pada production

`apps/customer/app/api/test-sentry-server/route.ts` sengaja melempar error dan halaman `/test-sentry` memicunya. Tanpa production guard, endpoint dapat dipakai untuk membanjiri observability dan biaya/log.

### PERF-001 — Rate limit chatbot bersifat per-process dan mudah dilewati

`apps/customer/app/api/chat/route.ts:24-52` menggunakan Map memory. Scale-out/cold start mereset limit. IP `unknown` juga menggabungkan banyak user bila proxy header tidak tersedia. Gunakan distributed rate limiter dan identitas tenant+IP.

### BUG-013 — Knowledge base chatbot menunjuk direktori yang tidak ada

`apps/customer/app/api/chat/route.ts` memakai `process.cwd()/src/data`, sedangkan file berada pada `apps/customer/data`. Build berhasil karena `existsSync` mengembalikan false; knowledge markdown tidak pernah dimuat pada struktur saat ini.

### ARCH-002 — Chatbot dan banyak halaman masih hardcoded A6 Nyuss

System prompt, nomor WhatsApp, alamat Surabaya, testimonials, metadata, popup peta, teks legal, login admin, receipt, serta nama storage key terikat ke satu merchant. Ini tidak konsisten dengan arsitektur SaaS multi-tenant.

### BUG-014 — Setting payment/tax owner tidak diterapkan pada checkout/POS

Owner menyimpan `taxRate`, `serviceChargeRate`, `enableQris`, `enableBankTransfer`, dan `enableCash`, tetapi customer tetap selalu menawarkan COD/QRIS dan kalkulasi order tidak menerapkan pajak/service. POS memakai pajak hardcoded 10%.

### BUG-015 — Payment method tidak konsisten (`qris` vs `transfer`)

Customer menerima `qris`, server menyimpannya sebagai `transfer`, schema comment menyebut `qris`, admin type memakai `transfer`, dan branch default memakai `qris`. Kontrak ini mudah merusak filter/reporting.

### BUG-016 — Staff yang dibuat owner tidak memiliki credential login yang valid

`createEmployeeAction()` memasukkan row `user` dan profile secara manual tanpa account/password. Pesan menyuruh memakai “Lupa Password”, tetapi konfigurasi auth tidak menunjukkan flow reset email. Role profile juga tidak disinkronkan ke `user.role`, padahal middleware membaca role user.

### BUG-017 — Produksi bukan data produksi yang persisten

`getProductionPlanAction()` menamai quantity penjualan all-time sebagai `producedQty`. `createProductionPlanItemAction()` hanya membuat menu bila belum ada lalu mengembalikan object plan tanpa menyimpan target/produced. Edit dan delete di page hanya mengubah state client.

### BUG-018 — Cashflow menggabungkan bulan lintas tahun dan mengabaikan PO tanpa order

`getCashflowAction()` memakai key nama bulan saja, sehingga Januari tahun berbeda digabung. Approved PO hanya ditambahkan jika bucket bulan sudah dibuat oleh order; bulan dengan biaya namun tanpa penjualan hilang. COGS juga hardcoded 30%, tidak memakai setting tenant.

### BUG-019 — Top menu menghitung order belum selesai/batal

`getTopMenusAction()` hanya filter tenant pada join dan tidak filter status. Ini menggelembungkan volume serta menu engineering.

### BUG-020 — Shift/accounting tidak memiliki boundary shift yang konsisten

Dashboard menghitung COD dari seluruh order “hari ini”, sedangkan server expected cash menjumlah shift logs. QRIS verification juga ditulis sebagai `cash_in`, padahal tidak selalu masuk laci tunai. Offline POS tidak menulis shift log. Hasil rekonsiliasi dapat berbeda antar layar.

### SEC-015 — CSV admin rentan formula injection dan escaping tidak lengkap

`apps/admin/components/Dashboard.tsx:159-196` mengekspor nama pelanggan langsung ke CSV, hanya membungkus dengan quote tanpa menggandakan quote internal atau menetralkan prefix `=`, `+`, `-`, `@`. Spreadsheet dapat mengeksekusi formula dari nama pelanggan berbahaya.

### PERF-002 — Query analytics mengambil seluruh histori ke memory

Banyak action owner mengambil semua order/shifts lalu reduce/group di Node. Karena date filter belum diterapkan, biaya tumbuh linear terhadap seluruh histori. Gunakan agregasi SQL, range filter, pagination, dan index komposit `(tenant_id, created_at/status)`.

## 6. Temuan Low/Info

### QUAL-001 — Penggunaan `any` sangat tinggi

Terdapat 169 kemunculan `any`, terutama owner pages, instrumentation, middleware session, store realtime, dan DTO action. Ini melemahkan manfaat `strict` dan menyembunyikan kontrak response yang tidak konsisten.

### QUAL-002 — Komponen terlalu besar

Contoh:

- `customer/tracking/page.tsx`: 1.190 baris.
- `admin/components/Dashboard.tsx`: 931 baris.
- `admin/components/OrderDetail.tsx`: 786 baris.
- `customer/checkout/page.tsx`: 762 baris.
- `owner/pengaturan/page.tsx`: 751 baris.

Pisahkan presentational components, hooks, DTO, dan domain service.

### ARCH-003 — Duplikasi lintas aplikasi

- `data/menu.ts` admin dan customer identik.
- Data knowledge markdown diduplikasi.
- Auth route identik di tiga app.
- `cn.ts`, Sentry config, PostCSS config, dan sebagian formatting diulang.
- `packages/ui` hampir kosong walaupun ada banyak komponen reusable.

### QUAL-003 — Error response membocorkan detail internal

Banyak action mengembalikan `err.message` langsung ke client. Error DB/constraint dapat mengungkap schema atau detail operasi. Log internal di server, tetapi kirim error code/message aman ke client.

### QUAL-004 — Audit log tidak mencatat actor/IP secara konsisten

Admin `writeAuditLogAction()` menerima action/details dari client dan tidak mengisi user ID/IP. User dapat memalsukan operatorName/details. Audit trail belum layak sebagai bukti keamanan.

### TEST-001 — Cakupan test sangat rendah dan Playwright belum runnable

Hanya satu file E2E owner dengan tiga happy-path test. Tidak ada test customer/admin, unit test finansial, tenant isolation, authorization, negative path, atau idempotency. Konfigurasi reporter berada di dalam outputDir dan webServer bergantung pada `pnpm` PATH.

### TEST-002 — Test cabang meninggalkan data

E2E membuat `Cabang Test E2E` tanpa cleanup atau ID unik. Pengulangan test mencemari database dan dapat membuat assertion ambigu.

### PERF-003 — Aset fallback rusak dan beberapa aset terlalu besar

`public/assets/menu/placeholder.jpg` berukuran 0 byte. Favicon 424 KB, logo.ico 176 KB, dan QRIS PNG 588 KB perlu dioptimasi. Ada SVG template Next/Vercel yang tampak tidak terkait produk.

### ARCH-004 — `middleware.ts` deprecated pada Next 16

Ketiga build memberi peringatan untuk migrasi ke konvensi `proxy`. Ini juga kesempatan untuk menyatukan policy auth/tenant yang saat ini berbeda.

### QUAL-005 — State/order history menyimpan PII di localStorage

Zustand persist menyimpan nama, nomor HP, alamat/order history pada browser dengan key hardcoded `a6nyuss-orders`. Perangkat bersama atau XSS dapat membaca data tersebut. Batasi data, retensi, dan gunakan key tenant-scoped.

## 7. Analisis Antar-Aplikasi

### 7.1 Alur order

`Customer menuService → Cart Zustand → Checkout → POST /api/orders → orders/order_items → Ably → Admin store → Admin actions → Owner analytics`

Titik ketidakkonsistenan:

- DTO tidak berada di package bersama.
- Customer mengirim `qris`, DB menyimpan `transfer`, admin membaca `transfer`.
- Notes hilang sebelum API.
- Status tidak didefinisikan sebagai enum/state machine bersama.
- Owner modules memakai definisi revenue yang berbeda.
- Order online divalidasi harga server-side, sedangkan POS offline mempercayai client.

### 7.2 Alur tenant

`Hostname parser → resolveTenantMiddleware → injected x-tenant-id/slug → server action/API`

Kelemahan utama:

- Production domain diperlakukan sebagai slug.
- Unknown tenant fallback ke default.
- Membership user tidak dibandingkan dengan tenant hostname.
- Beberapa API mencari tenant lagi berdasarkan slug, bukan memakai ID hasil middleware.
- Development fallback dapat meneruskan tenant ID kosong ketika DB gagal.

### 7.3 Alur auth/RBAC

- Admin: session diperiksa di page/client, tidak di action.
- Owner: session diperiksa middleware, tetapi hanya role `kasir` ditolak dan tenant membership tidak dicek.
- Better Auth menyimpan role di `user`, sedangkan domain HR mengubah role di `profiles`; kedua sumber dapat drift.
- Semua aplikasi mengekspos handler auth yang sama, sementara tenant-aware onboarding belum menjadi satu flow atomik.

### 7.4 Arsitektur data

Schema menyediakan recipe/BOM dan inventory, tetapi laporan COGS masih memakai persentase estimasi. Production plan tidak memiliki tabel persisten. Banyak domain entity memakai text bebas untuk status/type tanpa constraint database. Foreign key memastikan row ada, tetapi tidak memastikan referenced row berasal dari tenant yang sama.

## 8. Prioritas Remediasi

### P0 — sebelum deployment atau penggunaan multi-tenant

1. Tambahkan server-side auth/RBAC/membership pada semua admin dan owner action.
2. Perbaiki cross-tenant HR dan inventory.
3. Hapus fallback tenant default dan betulkan resolusi domain.
4. Update Next ke versi aman minimal 16.2.11.
5. Ganti Ably browser API key dengan scoped token auth.
6. Amankan GET/PUT order dengan customer access token/OTP.

### P1 — sebelum transaksi nyata

1. Perbaiki upload mock dan redirect tracking.
2. Filter menu order berdasarkan tenant.
3. Terapkan server-side store/variant/delivery validation.
4. Buat order, item, payment, dan shift idempotent/atomik.
5. Jangan percaya harga/total POS client.
6. Merge branding dengan aman atau normalisasi settings.
7. Terapkan state machine status dan payment ledger.
8. Perbaiki staff account lifecycle.

### P2 — sebelum laporan owner dijadikan dasar keputusan

1. Terapkan filter tanggal/cabang yang nyata.
2. Satukan definisi recognized revenue.
3. Perbaiki cashflow lintas tahun dan biaya tanpa order.
4. Gunakan BOM/actual cost atau tandai semua angka sebagai estimasi.
5. Persist production plan pada tabel domain yang benar.

### P3 — maintainability dan UX

1. Hapus hardcode A6 Nyuss dari layer generik.
2. Pindahkan DTO/status/formatter/UI ke package bersama.
3. Pecah komponen besar.
4. Kurangi `any` dan buat discriminated action response.
5. Optimasi aset dan hapus template asset yang tidak dipakai.
6. Migrasi middleware ke proxy.

## 9. Regression Test Minimum yang Harus Ditambahkan

### Authorization dan tenant

- Anonymous caller tidak dapat memanggil action admin/owner.
- Kasir tidak dapat menjalankan owner action.
- Owner tenant A tidak dapat membaca/mengubah tenant B melalui hostname atau ID.
- HR delete/update dengan ID tenant lain selalu no-op/403.
- Waste log dengan inventory/branch tenant lain selalu ditolak.

### Customer/order

- Menu slug sama di dua tenant tetap memakai harga tenant yang benar.
- Store tutup menolak order langsung ke API.
- Delivery fee dihitung server dan tidak dapat dipilih nol.
- Required variant tidak dapat dihilangkan.
- Retry idempotency key tidak membuat order ganda.
- Gagal insert item tidak meninggalkan order kosong.
- Token customer yang salah tidak dapat GET/cancel/upload proof.
- SVG/polyglot/oversized upload ditolak.
- Upload dari tracking menyimpan file aktual dan redirect valid.

### Finance/shift

- Order cancelled+paid tidak dihitung sebagai revenue tanpa aturan refund eksplisit.
- Date range dan branch filter menghasilkan dataset berbeda yang benar.
- Verifikasi payment berulang tidak menggandakan ledger.
- Shift tenant lain tidak dapat ditutup.
- QRIS tidak menambah kas fisik.
- Bulan sama pada tahun berbeda tidak digabung.

## 10. Kesimpulan

Secara kompilasi repository berada dalam kondisi baik: build, TypeScript, dan lint per-app lulus. Namun, untuk standar SaaS multi-tenant, **authorization server-side, pengikatan session-ke-tenant, integritas transaksi, dan akurasi laporan belum siap dianggap aman**.

Audit ini tidak mengubah kode produksi. Tahap selanjutnya sebaiknya dimulai dari paket remediasi P0 dengan test tenant isolation terlebih dahulu, kemudian P1 untuk integritas order/payment.