# 🛡️ Audit Kode — Aplikasi Owner (`apps/owner`, port 3002)

> **Sumber kebenaran:** kode saat ini. **Tanggal:** 2026-08-05. Fokus: isolasi tenant, RBAC, & onboarding multi-tenant.

## Ringkasan
Owner (executive cockpit, 11 dashboard + 11 modul server action) adalah **paling sehat secara isolasi tenant** dari ketiga app. Seluruh server action memanggil `getTenantId()` yang **strict (throw kalau tenant tak ditemukan)** dan memfilter `eq(entity.tenantId, tenantId)`. Tidak ditemukan kebocoran lintas-tenant.

## ✅ Positif (Sudah Benar)
- `_tenantHelper.getTenantId()` strict → tidak ada fallback ke tenant lain (lebih aman dari admin yang fallback `firstTenant`).
- Semua action (`analytics`, `finance`, `inventory`, `menu`, `production`, `hr`, `approvals`, `branches`, `settings`) konsisten `eq(tenantId, tenantId)` — termasuk operasi `delete`/`update` (cek `and(eq(id), eq(tenantId))`).
- `hr.ts` hapus user/account juga diikat ke profile milik tenant.
- Halaman butuh session (`authClient.useSession()`).

## Temuan
| # | Temuan | Severity | Lokasi |
|---|---|---|---|
| O1 | **Onboarding rapuh**: `registerOwnerAction` membuat tenant+user+profile, tapi `lib/auth.ts` (hook `user.create.after`) juga otomatis membuat `profiles` untuk tenant default (`NEXT_PUBLIC_TENANT_SLUG`/`taj-saas`) lalu `registerOwnerAction` menghapus & membuat ulang profile di tenant baru → race/duplikasi & polusi tenant default | 🟠 Medium | `app/actions/authActions.ts` ↔ `lib/auth.ts` |
| O2 | Field `branding` (`cogsRate`, `storeOpen`, `qrisImageUrl`, `bankInfo`, `heroBannerUrl`) **tidak ada di tipe `branding`** (`packages/db/schema.ts`) → disimpan untyped | 🟡 Low | `packages/db/schema.ts` |
| O3 | Default warna baru tenant di-hardcode `#D94708`/`#E05009` (sama dgn A6 Nyuss) | 🟡 Low | `authActions.ts` |
| O4 | Seed script hardcode `a6-nyuss` & campur `.ts`/`.js` (7 ts + 5 js) → mengikat DB ke 1 merchant & clutter | 🟡 Low | `packages/db/scripts/*` |

## Catatan
- Tidak ada kebocoran lintas-tenant di owner (berbeda dg chatbot customer C1).
- O1 baru relevan saat **onboarding tenant baru**; untuk pilot A6 Nyuss (tenant sudah ada) tidak memblokir.
- Multi-tenant generalization (O3, O4, seed) bukan prioritas pilot A6 Nyuss (single-tenant).
