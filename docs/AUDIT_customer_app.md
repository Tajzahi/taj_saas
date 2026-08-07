# 🛡️ Audit Kode — Aplikasi Customer (`apps/customer`, port 3000)

> **Tujuan audit:** Review kualitas & keamanan aplikasi Customer mengikuti *5-Layer Quality Assurance Framework* (`CODE_REVIEW_GUIDE.md`).
> **Sumber kebenaran:** Kode saat ini (bukan blueprint `erp-fnb-enterprise-planning`).
> **Tanggal audit:** 2026-08-05
> **Status setup & verify:** `pnpm install` ✅ · `eslint` ✅ (0 error) · `tsc --noEmit` ✅ (0 error) · `next build` ✅ (22 halaman terkompilasi). Verifikasi *runtime* penuh butuh kredensial Neon/Ably/Gemini (lihat bawah).
>
> **🔄 Update (deep-dive):** Penelaahan lanjut menemukan **+4 temuan (#17–#20)**, termasuk **2 bug 🔴 yang MEMUTUS ALUR INTI** — order *delivery* dan pembayaran *QRIS* **seluruhnya gagal** karena ketidakcocokan antara client & server. Total temuan: **20**.

---

## Legenda Severity

| Severity | Arti |
|---|---|
| 🔴 **High** | Kebocoran data lintas-tenant / akses tidak sah / manipulasi finansial |
| 🟠 **Medium** | Bug fungsional, hardcoded client-specific, potensi abuse |
| 🟡 **Low** | Konsistensi skema, drift dokumentasi, hygiene kode |

---

## Ringkasan Temuan

| # | Temuan | Severity | Lokasi |
|---|---|---|---|
| 1 | Tool AI chatbot query order **tanpa filter `tenantId`** → kebocoran lintas-tenant | 🔴 High | `app/api/chat/route.ts` |
| 2 | `GET /api/files/[id]` kembalikan file apa pun **tanpa auth & tanpa cek tenant** (IDOR) | 🔴 High | `app/api/files/[id]/route.ts` |
| 3 | `POST /api/upload-proof` update order **tanpa verifikasi `tenantId`** (orderCode bisa ditebak) | 🔴 High | `app/api/upload-proof/route.ts` |
| 4 | `getStoreSettings` baca field `qrisImageUrl`/`bankInfo`/`heroBannerUrl` yang **tidak ada di skema DB** → selalu fallback hardcoded "A6 Nyuss" | 🟠 Medium | `lib/db/menuService.ts` + `packages/db/schema.ts` |
| 5 | Hardcoded brand spesifik klien ("A6 Nyuss", alamat Surabaya, nomor WA) di banyak tempat | 🟠 Medium | `layout.tsx`, `page.tsx`, `menuService.ts`, `chat/route.ts` |
| 6 | `paymentStatus: 'waiting_verification'` tidak ada di enum skema (`pending|paid|failed`) | 🟡 Low | `upload-proof`, `orders/[code]` PUT |
| 7 | `deliveryFee` di GET order dihitung `total - subtotal` → **under-reported** saat ada diskon promo | 🟠 Medium | `app/api/orders/[code]/route.ts` |
| 8 | `variantPriceModifier` dari client hanya di-clamp `[0,25000]`, **tidak divalidasi ke opsi varian DB** (bisa overcharge) | 🟠 Medium | `app/api/orders/route.ts` |
| 9 | `VALID_DELIVERY_FEES` hardcoded `[0,10000,15000,20000]` — tidak mengikuti config tenant | 🟡 Low | `app/api/orders/route.ts` |
| 10 | `orderCode` pakai `Math.random()` 4-digit → bisa ditebak & kolisi saat ramai | 🟠 Medium | `app/api/orders/route.ts` |
| 11 | `upload-proof` tidak batasi ukuran/tipe file → base64 disimpan ke `text` Postgres (abuse storage/DoS) | 🟠 Medium | `app/api/upload-proof/route.ts` |
| 12 | `validate-promo` menelan error silently tanpa log (langgar prinsip "No Silent Error Swallowing") | 🟡 Low | `app/api/validate-promo/route.ts` |
| 13 | `lib/auth-schema.ts` duplikat skema auth yang **tidak punya kolom `role`** (inkonsisten dgn `packages/db/schema.ts`) | 🟡 Low | `lib/auth-schema.ts` |
| 14 | `packages/ui` & `packages/config` kosong (hanya `.gitkeep`) tapi direferensikan | 🟡 Low | `packages/*` |
| 15 | Rate-limit chatbot in-memory per-proses (reset saat cold-start serverless) | 🟡 Low | `app/api/chat/route.ts` |
| 16 | `middleware.ts` sudah deprecated di Next 16 → gunakan `proxy` | 🟡 Low | `app/middleware.ts` |
| 17 | **Fee delivery client {8000,13000,18000} ≠ server {0,10000,15000,20000} → semua order delivery valid ditolak 400** | 🔴 High | `components/DeliveryMap.tsx` ↔ `app/api/orders/route.ts` |
| 18 | **Client kirim `transfer` (label QRIS) tapi server hanya terima `cod\|qris` → order QRIS ditolak 400** | 🔴 High | `app/checkout/page.tsx` ↔ `app/api/orders/route.ts` |
| 19 | Koordinat outlet `OUTLET_LAT/LNG` di-hardcode ke A6 Nyuss Surabaya → jarak/ongkir & pusat peta salah untuk tenant lain | 🟠 Medium | `components/DeliveryMap.tsx` |
| 20 | `generateOrderCode()` duplikat dgn format beda (cartStore `A6-YYYYMMDD-####` vs format.ts `A6-YYMMDD-XXXX` vs server) | 🟡 Low | `store/cartStore.ts`, `lib/utils/format.ts` |

---

## Detail Temuan & Bukti

### 🔴 #1 — Tool chatbot query order tanpa `tenantId` (Kebocoran lintas-tenant)
`app/api/chat/route.ts` — fungsi `checkOrderStatus` & `findOrderCodesByPhone` mem-query `schema.orders` **hanya** by `orderCode` / `customerPhone`, tanpa `eq(schema.orders.tenantId, tenant.id)`.

```ts
// checkOrderStatus
const ordersResult = await db.select().from(schema.orders)
  .where(eq(schema.orders.orderCode, trimmedCode)).limit(1);
// findOrderCodesByPhone
const ordersResult = await db.select().from(schema.orders)
  .where(eq(schema.orders.customerPhone, trimmedPhone)).orderBy(...);
```

**Dampak:** Pengguna di tenant manapun bisa melihat status + detail pesanan tenant lain hanya dengan menebak `orderCode` (`A6-{tanggal}-{rand 4 digit}`, mudah ditebak) atau memasukkan nomor HP. Ini melanggar prinsip isolasi multi-tenant (Lapis 3).
**Perbaikan:** Teruskan `tenantId` dari `x-tenant-slug` → `tenant.id` dan tambahkan ke kedua `where(...)`.

### 🔴 #2 — `GET /api/files/[id]` IDOR (akses file tanpa auth/tenant)
`app/api/files/[id]/route.ts`:
```ts
const fileResult = await db.select().from(schema.files).where(eq(schema.files.id, id)).limit(1);
```
Tidak ada cek `tenantId`, tidak ada auth. Semua bukti pembayaran (PII/finansial) dapat diakses publik dengan mengiterasi UUID.
**Perbaikan:** Wajib auth + filter `tenantId`; atau lebih baik jangan expose file via URL publik — serve lewat route terproteksi yang memvalidasi kepemilikan order.

### 🔴 #3 — `upload-proof` update order tanpa cek `tenantId`
`app/api/upload-proof/route.ts`:
```ts
await db.update(schema.orders).set({ paymentProofUrl:..., paymentStatus:'waiting_verification' })
  .where(eq(schema.orders.orderCode, orderCode)).returning();
```
Request terautentikasi hanya sebagai "tenant valid manapun" bisa melampirkan bukti bayar / mengubah status order milik tenant lain (orderCode dapat ditebak).
**Perbaikan:** Resolve `tenant.id` dari `x-tenant-slug`, lalu `.where(and(eq(orderCode), eq(tenantId, tenant.id)))`.

### 🟠 #4 — Field branding tidak ada di skema DB
`lib/db/menuService.ts` mengembalikan `qris_image_url`, `bank_info`, `hero_banner_url` dari `tenant.branding`, namun tipe `branding` di `packages/db/schema.ts` hanya punya: `logoUrl, primaryColor, secondaryColor, businessName, whatsappNumber?, flatDeliveryFee?, minimumOrderAmount?, storeAddress?, googleMapsUrl?, openingHours?`.
**Dampak:** QRIS, info rekening bank, & hero banner **selalu** pakai fallback hardcoded "Martabak A6 Nyuss" → fitur branding tidak pernah berfungsi untuk tenant lain.
**Perbaikan:** Tambahkan kolom ke tipe `branding` (atau normalisasi ke tabel `store_settings`), lalu seed + baca dari sana.

### 🟠 #5 — Hardcoded brand spesifik klih ("A6 Nyuss")
Judul `layout.tsx` = "A6 Nyuss - Martabak & Terang Bulan"; default state `page.tsx`, fallback `menuService.ts`, dan system prompt chatbot semuanya terikat ke satu merchant Surabaya. Sebagai "generic multi-tenant SaaS" ini mengikat produk ke satu klien.
**Perbaikan:** Angkat semua nilai default ke `tenants.branding` / config tenant; hilangkan string "A6 Nyuss" dari kode generik.

### 🟠 #7 — `deliveryFee` salah saat ada diskon
`app/api/orders/[code]/route.ts`:
```ts
deliveryFee: Number(order.totalPrice) - Number(order.subtotal),
```
Karena `total = subtotal + fee - discount`, maka `deliveryFee` turun sebesar diskon. Seharusnya simpan `deliveryFee` eksplisit di tabel `orders`.
**Perbaikan:** Tambahkan kolom `deliveryFee` ke `orders` dan kembalikan nilai aslinya.

### 🟠 #8 — `variantPriceModifier` tidak divalidasi ke DB
`app/api/orders/route.ts`:
```ts
const safeModifier = Math.min(Math.max(0, Number(item.variantPriceModifier) || 0), MAX_VARIANT_MODIFIER);
const unitPrice = dbItem.price + safeModifier;
```
Positif di-clamp (aman dari undercut), tapi tidak dicek ke `menu_variants.options[].priceModifier` → klien bisa mengirim modifier lebih tinggi dari varian asli (overcharge pelanggan).
**Perbaikan:** Cari opsi varian by `variantName` di DB, gunakan `priceModifier` DB-nya.

### 🟠 #10 — `orderCode` mudah ditebak
`generateOrderCode()` → `A6-{date}-{Math.floor(Math.random()*9000)+1000}`. 4 digit acak = 9000 kombinasi/hari, dapat ditebak & berpotensi kolisi (kolom `unique`).
**Perbaikan:** Gunakan suffix acak crypto-secure (mis. `crypto.randomBytes`) atau UUID, bukan `Math.random()`.

### 🟠 #11 — `upload-proof` tanpa batas ukuran/tipe
`fileBase64` (base64 teks) langsung disimpan ke kolom `text` Postgres tanpa validasi ukuran/tipe → abuse storage & potensi DoS.
**Perbaikan:** Validasi `fileType` (hanya image), batasi ukuran (mis. ≤5 MB decode), dan simpan ke object storage (S3/R2) alih-alih base64 di DB.

---

### 🔴 #17 — Fee delivery client ≠ server → order delivery selalu ditolak (PUTUS ALUR INTI)
`components/DeliveryMap.tsx` menghitung ongkir per zona radius:
```ts
const ZONES = [
  { maxKm: 3,  fee: 8000,  name: 'Zona 1 (0-3 km)' },
  { maxKm: 6,  fee: 13000, name: 'Zona 2 (3-6 km)' },
  { maxKm: 10, fee: 18000, name: 'Zona 3 (6-10 km)' },
];
// fee: zone?.fee ?? 0  → 8000 | 13000 | 18000
```
`app/checkout/page.tsx` mengirim `deliveryFee: mapResult?.fee ?? 0` ke `POST /api/orders`.
Tapi server memvalidasi:
```ts
const VALID_DELIVERY_FEES = new Set([0, 10000, 15000, 20000]); // orders/route.ts
if (!VALID_DELIVERY_FEES.has(claimedFee)) return 400;
```
**Dampak:** Untuk order delivery valid (jarak 0–10 km), `fee` pasti 8000/13000/18000 → **tidak ada di set server** → server balas `400 "Ongkos kirim tidak valid"`. Artinya **seluruh alur order delivery rusak** (hanya lolos jika `fee=0`, yaitu kasus di-`??` yang sebenarnya diblokir oleh validasi `isOutOfRange`).
**Perbaikan:** Samakan definisi fee antara client & server (satu sumber: config tenant `flatDeliveryFee`/zona dari DB), atau buat `VALID_DELIVERY_FEES` dihitung dari konfigurasi tenant, bukan hardcode.

### 🔴 #18 — Enum metode bayar client `transfer` ≠ server `qris` → order QRIS ditolak (PUTUS ALUR INTI)
`app/checkout/page.tsx`:
```ts
const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
// opsi UI: { val: 'transfer', label: 'QRIS' }
// payload: paymentMethod  → 'transfer'
```
Server (`orders/route.ts`):
```ts
if (!['cod', 'qris'].includes(paymentMethod)) return 400; // 'transfer' tidak dikenali
```
**Dampak:** Pelanggan yang memilih **QRIS** mengirim `paymentMethod:'transfer'` → server balas `400 "Metode pembayaran tidak valid"`. **Alur pembayaran QRIS rusak seluruhnya**; hanya COD yang bisa order.
**Perbaikan:** Gunakan `qris` di client (bukan `transfer`) agar cocok dengan enum server, atau perluas validasi server ke alias `transfer`.

### 🟠 #19 — Koordinat outlet di-hardcode (bukan per-tenant)
`components/DeliveryMap.tsx`:
```ts
const OUTLET_LAT = -7.2432537;   // outlet A6 Nyuss, Surabaya
const OUTLET_LNG = 112.7206275;
```
Untuk SaaS multi-tenant, tiap tenant punya outlet berbeda. Koordinat & zona ongkir harus diambil dari `tenants.branding` / config tenant, bukan konstanta. Selain salah hitung jarak/ongkir, pusat peta & marker outlet juga salah untuk tenant lain.
**Perbaikan:** Baca lat/lng outlet dari `getStoreSettings()` (tambahkan field ke `branding`/tabel store settings).

### 🟡 #20 — `generateOrderCode()` duplikat dgn format berbeda
Tiga implementasi berbeda:
- `store/cartStore.ts` → `A6-YYYYMMDD-####` (4 digit angka)
- `lib/utils/format.ts` → `A6-YYMMDD-XXXX` (4 huruf acak)
- `app/api/orders/route.ts` → `A6-YYYYMMDD-####` (authoritative, disimpan ke DB)

Generator client (cartStore/format.ts) sebenarnya **dead code** karena `orderCode` riil di-set dari server; tapi duplikasi + format tak konsisten menambah kebingungan dan berisiko kolisi.
**Perbaikan:** Hapus duplikat client; andalkan `orderCode` dari server. (Lihat juga #10: gunakan suffix acak kripto-aman, bukan `Math.random()`.)

---

## Catatan Positif (Sudah Benar)

- ✅ `app/api/orders/route.ts` & `orders/[code]` (GET/PUT) **sudah** memvalidasi `order.tenantId === tenant.id` → isolasi tenant aman di alur order utama.
- ✅ Harga inti diambil dari DB (`dbItem.price`), bukan dari client → cegah tampering harga dasar.
- ✴️ `chat/route.ts` sudah punya rate-limit (20 req/IP/menit) & sanitasi input (panjang + control chars).
- ✅ Build statis untuk shell halaman; data per-tenant di-fetch saat runtime via Server Action (`menuService.ts`) yang membaca header `x-tenant-slug` dari middleware → **bukan** bug isolasi (sudah saya verifikasi di `app/page.tsx`).
- ✅ Lint & typecheck bersih; kode terkompilasi penuh (Next 16 / Turbopack).

---

## Prioritas Perbaikan (Disarankan)

> ⚠️ **Dua bug 🔴 #17 & #18 memutus alur inti (order delivery & QRIS gagal 100%)** — jauh lebih kritis daripada isu sekuriti edge-case. Perbaiki paling depan.

1. **🔴 KRITIS (putus alur inti):** #17 (fee delivery client≠server), #18 (enum `transfer`≠`qris`). Tanpa ini, pelanggan **tidak bisa** order delivery maupun bayar QRIS.
2. **🔴 Segera (sekuriti/isolasi tenant):** #1, #2, #3 — kebocoran lintas-tenant & IDOR file.
3. **🟠 Penting:** #4 (branding tidak jalan), #19 (outlet hardcode), #8 (validasi varian), #10 (orderCode), #11 (batas upload). *(#7 digabung ke #17.)*
4. **🟡 Rapihkan:** #5 (hardcode brand), #6/#9 (enum & fee config), #12 (log error), #13/#14 (skema/auth duplikat & paket kosong), #15/#16/#20 (middleware→proxy, rate-limit, duplikat `generateOrderCode`).

---

## Catatan Verifikasi Runtime

`next build` sukses **tanpa** DATABASE_URL nyata karena halaman storefront adalah Client Component yang memuat data via Server Action saat runtime (shell statis di-build). Untuk verifikasi *end-to-end* (order flow, realtime Ably, chatbot Gemini) diperlukan:
- `DATABASE_URL` Neon + migrasi (`pnpm --filter @taj-saas/db db:migrate`) + seed.
- `BETTER_AUTH_SECRET` (≥32 char), `ABLY_API_KEY`, `GEMINI_API_KEY`.
- Lalu `pnpm dev` dan uji alur `localhost:3000`.

Tanpa kredensial tersebut, verifikasi dibatasi pada kompilasi/type/lint (semua hijau).
