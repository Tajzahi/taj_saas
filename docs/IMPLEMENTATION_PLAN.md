# 🗺️ Implementation Plan — Perbaikan Bug Seluruh Aplikasi Taj SaaS

> **Hasil audit:** Customer (20 temuan) + Admin (6) + Owner (4) = **30 temuan terkumpul**.
> **Konteks:** Pilot dengan tenant **A6 Nyuss** (single-tenant). Generalisasi multi-tenant untuk UMKM lain = fase akhir.
> **Prinsip:** Fix yang memblokir pilot dulu; kebocoran lintas-tenant segera; hardcode brand ditunda (tidak menghalangi pilot A6 Nyuss).

---

## Legenda
🔴 High (blokir/alur inti/sekuriti) · 🟠 Medium (fungsional/inkonsistensi) · 🟡 Low (rapihin/housekeeping)

---

## Konsolidasi Temuan (30)
| ID | App | Temuan | Sev |
|---|---|---|---|
| C1 | Customer | Chatbot `checkOrderStatus`/`findOrderCodesByPhone` tanpa filter `tenantId` (bocor lintas-tenant) | 🔴 |
| C2 | Customer | `GET /api/files/[id]` IDOR — file (bukti bayar) tanpa auth/tenant | 🔴 |
| C3 | Customer | `POST /api/upload-proof` update order tanpa cek `tenantId` | 🔴 |
| C16 | Customer | **Fee delivery client {8000,13000,18000} ≠ server {0,10000,15000,20000} → order delivery ditolak 400** | 🔴 |
| C17 | Customer | **Client kirim `transfer` (label QRIS) ≠ server `qris` → order QRIS ditolak 400** | 🔴 |
| A1 | Admin | Admin "tutup toko" (`branding.storeOpen`) tak berdampak ke customer (`is_open = isActive`) | 🟠 |
| C7 | Customer | `deliveryFee = total - subtotal` salah saat ada diskon | 🟠 |
| C10 | Customer | `orderCode` `A6-YYYYMMDD-####` (`Math.random()`) rawan kolisi | 🟠 |
| A3 | Admin | `createOfflineOrderAction` `OFF-####` rawan kolisi | 🟡 |
| C4 | Customer | Field `qrisImageUrl/bankInfo/heroBannerUrl` tak ada di tipe `branding` | 🟠 |
| C8 | Customer | `variantPriceModifier` tak divalidasi ke opsi varian DB (bisa overcharge) | 🟠 |
| C11 | Customer | `upload-proof` tak batasi ukuran/tipe file | 🟠 |
| C18 | Customer | Koordinat outlet `OUTLET_LAT/LNG` hardcode Surabaya | 🟠 |
| A2 | Admin | `getTenantContext` fallback ke `firstTenant` kalau header hilang | 🟡 |
| A4 | Admin | Enum `paymentMethod` `transfer` (admin) ≠ `qris` (customer API) | 🟡 |
| O1 | Owner | `registerOwnerAction` bentrok dg hook `lib/auth.ts` soal `profiles` (onboarding rapuh) | 🟠 |
| C5 | Customer | Hardcode brand "A6 Nyuss" di ~20 file | 🟠 |
| C6/C9 | Customer | `paymentStatus:'waiting_verification'` & `VALID_DELIVERY_FEES` hardcode | 🟡 |
| C12–C15,C19 | Customer | silent error, `auth-schema.ts` dup, pkg kosong, middleware deprec, dup `generateOrderCode` | 🟡 |
| A5/A6 | Admin | `branding.storeOpen` untyped; admin tak cek role | 🟡 |
| O2/O3/O4 | Owner | `branding` fields untyped; default warna hardcode; seed script hardcode a6-nyuss | 🟡 |

---

## Fase Eksekusi

### 🔥 Phase 0 — BLOKKER PILOT (wajib sblm uji real-case A6 Nyuss)
1. **C16** Samakan definisi fee delivery client↔server (sumber tunggal dari config tenant / `VALID_DELIVERY_FEES`). *File: `components/DeliveryMap.tsx`, `app/api/orders/route.ts`.*
2. **C17** Gunakan `qris` di client (bukan `transfer`) agar cocok enum server, atau perluas allow-list server. *File: `app/checkout/page.tsx`, `app/api/orders/route.ts`.*
3. **A1** Buat customer membaca `storeOpen` (bukan `isActive`) saat mengecek buka/tutup toko. *File: `customer/lib/db/menuService.ts`, `checkout/page.tsx`.*
4. **C7** Simpan `deliveryFee` eksplisit di tabel `orders`. *File: schema + `orders/[code]/route.ts`.*

### 🔒 Phase 1 — Keamanan / Isolasi Tenant (High)
5. **C1** Tambah `tenantId` ke tool chatbot + filter `eq(tenantId)`.
6. **C2** Proteksi `GET /api/files/[id]` (auth + `tenantId`), atau simpan ke object storage.
7. **C3** Verifikasi `order.tenantId === tenant.id` di `upload-proof`.
8. **A2** Hapus fallback `firstTenant`; throw bila tenant tak terresolve.

### 🛠️ Phase 2 — Korektnes Fungsional (Medium)
9. **C10/A3** `orderCode` pakai suffix acak kripto-aman.
10. **C8** Validasi `variantPriceModifier` ke opsi varian DB.
11. **C11** Batas ukuran/tipe file di `upload-proof` + simpan ke storage.
12. **C4/O2/A5** Tambah field ke tipe `branding` (`qrisImageUrl`, `bankInfo`, `heroBannerUrl`, `storeOpen`, `cogsRate`, `outletLat`, `outletLng`).
13. **C18** Outlet coord dari config tenant, bukan hardcode.
14. **O1** Rapatkan onboarding: jangan biarkan hook & action sama-sama tulis `profiles`; pastikan 1 profile per user per tenant.
15. **A4/C6/C9** Seragamkan enum `paymentMethod` & fee config lintas app.

### 🌐 Phase 3 — Skalabilitas Multi-Tenant (tunda, bukan pilot)
16. **C5/O3** Angkat semua hardcode "A6 Nyuss" (warna, alamat, WA, brand) ke `tenants.branding`/config; bersihkan `data/menu.ts` mock.
17. **O4** Rapikan seed script (pilih ts/js, hilangkan hardcode `a6-nyuss` atau jadikan template).

### 🧹 Phase 4 — Housekeeping
18. **C12** Log error di `validate-promo`.
19. **C13** Hapus `lib/auth-schema.ts` duplikat (inkonsisten dgn `packages/db/schema.ts`).
20. **C14** Isi/bersihkan `packages/ui` & `packages/config` (atau hapus ref).
21. **C15** Migrasi `middleware.ts` → `proxy` (Next 16).
22. **C19** Hapus duplikat `generateOrderCode`.

---

## Catatan Verifikasi
- `pnpm install` ✅ · `eslint` ✅ · `tsc --noEmit` ✅ · `next build` ✅.
- Uji end-to-end butuh `DATABASE_URL` Neon + seed + `ABLY_API_KEY` + `GEMINI_API_KEY`.
- Setelah Phase 0 selesai: uji real-case di link Netlify pribadi Anda (customer/admin/owner) sebelum deklarasikan "normal".
- Laporan per-app: `docs/AUDIT_customer_app.md`, `docs/AUDIT_admin_app.md`, `docs/AUDIT_owner_app.md`.
