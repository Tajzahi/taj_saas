# 🛡️ Audit Kode — Aplikasi Admin (`apps/admin`, port 3001)

> **Sumber kebenaran:** kode saat ini. **Tanggal:** 2026-08-05. Fokus: isolasi tenant, realtime, & konsistensi lintas-app.

## Ringkasan
Admin (portal kasir/POS) **jauh lebih sehat** daripada Customer. Lapisan server action & realtime **sudah ter-isolasi tenant dengan benar**. Temuan mayoritas minor/sedang dan berupa inkonsistensi lintas-app (bukan kebocoran data).

## ✅ Positif (Sudah Benar)
- `getTenantContext()` mengambil `x-tenant-id` dari header middleware → semua action scoped by `tenantId`.
- `updateOrderStatusAction`, `verifyPaymentStatusAction`, `toggleToppingAvailabilityAction` **mengecek `order.tenantId !== tenantId`** → tolak jika bukan milik tenant.
- **Realtime Ably tenant-scoped**: `ably.channels.get(\`orders:${tenantSlug}\`)` (`store/adminStore.ts`), cocok dengan channel publish customer → tidak bocor lintas tenant.
- Halaman butuh session (`authClient.useSession()`) → terproteksi auth.
- `NEXT_PUBLIC_ABLY_API_KEY` kosong → realtime dimatikan gracefully (tidak crash).

## Temuan
| # | Temuan | Severity | Lokasi |
|---|---|---|---|
| A1 | **Fitur "tutup toko" admin tidak berdampak ke customer**: admin menulis `branding.storeOpen`, tapi customer membaca `is_open: tenant.isActive ?? true` (`menuService.ts`) → pelanggan tetap bisa order saat toko "tutup" | 🟠 Medium | `actions.ts toggleStoreAction` ↔ `customer/lib/db/menuService.ts` |
| A2 | `getTenantContext()` **fallback ke `firstTenant`** kalau `x-tenant-id` hilang → operasi default ke tenant pertama (risiko isolasi bila header tidak ada, mis. panggilan di luar middleware) | 🟡 Low/Med | `app/actions.ts` |
| A3 | `createOfflineOrderAction` pakai `orderCode = OFF-${random 4 digit}` → rawan kolisi (`orders.orderCode` unique) | 🟡 Low | `app/actions.ts` |
| A4 | Enum `paymentMethod` tidak konsisten lintas app: admin offline menyimpan `'transfer'`, customer API mengharap `'qris'` (#18 customer) → owner reporting bisa salah interpretasi | 🟡 Low | `app/actions.ts` |
| A5 | `branding.storeOpen` (spt `qrisImageUrl/bankInfo/heroBannerUrl` #4 customer) **tidak ada di tipe `branding`** → disimpan untyped | 🟡 Low | `packages/db/schema.ts` |
| A6 | `AdminClientPage` hanya cek `if (!session)` tanpa cek role → user ter-autentikasi (termasuk owner) bisa akses admin | 🟡 Low | `app/AdminClientPage.tsx` |

## Catatan
- Tidak ditemukan kebocoran lintas-tenant di admin (berbeda dengan chatbot customer #1).
- A1 adalah satu-satunya bug fungsional yang mengganggu UX pilot: tutup-toko di admin tidak menghentikan order customer.
- Untuk multi-tenant UMKM, A2 perlu diperbaiki (jangan fallback ke firstTenant; lempar error bila tenant tidak terresolve).
