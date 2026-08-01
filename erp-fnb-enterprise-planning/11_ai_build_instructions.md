# 11 — AI Build Instructions

Dokumen ini digunakan untuk memberi instruksi kepada AI coding agent agar dapat membangun project berdasarkan seluruh dokumen planning ERP FnB Enterprise.

## 1. Prinsip Penting

AI tidak sebaiknya diminta membuat seluruh ERP enterprise dalam satu prompt pendek. Cara profesional adalah:

1. AI membaca seluruh dokumen planning.
2. AI membuat rencana implementasi teknis.
3. AI membuat struktur monorepo.
4. AI mengimplementasikan modul per wave.
5. AI menjalankan build/test/lint.
6. AI memperbaiki error.
7. AI membuat dokumentasi hasil implementasi.

Walaupun pengerjaan dibagi menjadi wave, scope tetap dianggap **full enterprise target**, bukan MVP.

## 2. File yang Harus Dibaca AI

Minta AI membaca seluruh file berikut sebagai source of truth:

- `README.md`
- `01_master_blueprint.md`
- `02_enterprise_scope_modules.md`
- `03_functional_requirements.md`
- `04_architecture_tech_stack.md`
- `05_data_model.md`
- `06_rbac_workflows.md`
- `07_ui_ux_sitemap.md`
- `08_api_devops_security_qa.md`
- `09_delivery_acceptance_plan.md`
- `10_prebuild_checklist.md`
- `appendix/module-feature-matrix.csv`
- `appendix/rbac-matrix.csv`
- `appendix/initial-backlog.csv`

File `.mmd` dan `.yaml` boleh diabaikan jika tidak terbaca, karena hanya gambaran tambahan.

## 3. Master Prompt untuk AI Coding Agent

Gunakan prompt ini di Cursor/Windsurf/Claude Code/GitHub Copilot Agent/Arena Agent atau AI coding agent lain:

```text
Anda adalah senior full-stack architect, tech lead, dan principal engineer yang akan membangun ERP FnB Enterprise multi-outlet berdasarkan dokumen planning dalam folder ini.

Tugas Anda:
1. Baca seluruh file Markdown dan CSV dalam folder planning ini.
2. Perlakukan dokumen tersebut sebagai source of truth.
3. Abaikan file .mmd dan .yaml jika tidak bisa dibaca; itu hanya appendix visual.
4. Bangun project sebagai full-scope enterprise target, bukan MVP.
5. Namun implementasi harus dilakukan bertahap per wave agar stabil, testable, dan maintainable.
6. Gunakan stack berikut:
   - Monorepo: Turborepo atau Nx
   - Frontend: Next.js + React + TypeScript
   - UI: Tailwind CSS + shadcn/ui
   - Backend: NestJS + TypeScript
   - Database: PostgreSQL
   - ORM: Prisma
   - Realtime: Socket.IO
   - Queue/Cache: Redis + BullMQ
   - Testing: Jest/Vitest, Supertest, Playwright
   - Deployment: Docker Compose
7. Buat 3 frontend app:
   - customer-web
   - staff-web
   - owner-web
8. Buat 1 backend app:
   - api
9. Buat shared packages:
   - ui
   - shared
   - validation
   - database
   - config
10. Pastikan arsitektur mengikuti prinsip:
   - 3 portal
   - 1 backend ERP core
   - 1 PostgreSQL database
   - modular monolith
   - RBAC
   - audit log
   - approval workflow
   - inventory movement append-only
   - tenant/outlet scoping

Sebelum menulis kode besar, buat dulu file:
- IMPLEMENTATION_PLAN.md
- PROJECT_STRUCTURE.md
- DATABASE_PLAN.md
- API_PLAN.md
- TASKS.md

Setelah itu mulai implementasi Wave 1 sesuai dokumen `09_delivery_acceptance_plan.md`.

Jangan menghapus scope enterprise. Jika ada fitur yang belum diimplementasikan dalam wave saat ini, masukkan ke TASKS.md dengan status planned.

Setelah setiap wave:
- jalankan install/build/lint/test jika memungkinkan
- perbaiki error
- update TASKS.md
- update CHANGELOG.md
- jelaskan file yang dibuat/diubah
```

## 4. Prompt Eksekusi Wave 1

```text
Mulai implementasi Wave 1 — Foundation Platform.

Berdasarkan dokumen planning, buat monorepo production-ready dengan:
- apps/customer-web
- apps/staff-web
- apps/owner-web
- apps/api
- packages/ui
- packages/shared
- packages/validation
- packages/database
- packages/config

Implementasikan:
1. Setup TypeScript strict.
2. Setup Next.js untuk 3 frontend.
3. Setup NestJS untuk backend API.
4. Setup Prisma + PostgreSQL schema baseline.
5. Entity awal: Tenant, Outlet, User, Role, Permission, UserRole, UserOutlet, AuditLog, ApprovalRequest.
6. Auth module baseline.
7. RBAC guard baseline.
8. Tenant/outlet scoping baseline.
9. Docker Compose untuk PostgreSQL, Redis, API, dan web apps.
10. README development setup.
11. Unit test awal untuk auth/RBAC jika memungkinkan.

Setelah selesai, jalankan build/test/lint jika memungkinkan dan perbaiki error.
```

## 5. Prompt Eksekusi Wave 2

```text
Lanjutkan implementasi Wave 2 — Menu, POS, Kitchen, Order.

Implementasikan:
1. Menu category.
2. Menu item.
3. Variant.
4. Add-on.
5. Outlet menu availability.
6. Customer menu browsing.
7. Customer cart and checkout baseline.
8. Staff POS menu grid and cart.
9. Order entity, order item, order status.
10. Payment entity and payment method baseline.
11. Kitchen board realtime dengan Socket.IO.
12. Shift open/close baseline.
13. Receipt data structure.
14. API endpoints dan DTO validation.
15. Tests untuk create order, update kitchen status, shift flow.

Pastikan order dari customer/POS dapat muncul di kitchen board.
```

## 6. Prompt Eksekusi Wave 3

```text
Lanjutkan implementasi Wave 3 — Recipe, Inventory, Food Cost.

Implementasikan:
1. Item master: raw material, packaging, semi-finished, finished goods, operational item.
2. Unit dan unit conversion.
3. Recipe/BOM dan recipe lines.
4. Recipe versioning baseline.
5. Stock balance.
6. Inventory movement append-only ledger.
7. Sale deduction berdasarkan recipe saat order completed/paid sesuai policy.
8. Food cost calculation.
9. Gross margin calculation.
10. Low stock alert baseline.
11. Stock card endpoint.
12. Tests untuk unit conversion, recipe deduction, movement ledger.

Pastikan tidak ada update stok langsung tanpa inventory movement.
```

## 7. Prompt Eksekusi Wave 4

```text
Lanjutkan implementasi Wave 4 — Outlet Operations Enterprise.

Implementasikan:
1. Stock opname header dan lines.
2. System stock vs physical stock variance.
3. Stock adjustment dengan reason.
4. Approval workflow untuk adjustment.
5. Waste/spoilage record.
6. Waste mengurangi stok dan mencatat cost.
7. Receiving barang sederhana.
8. Stock transfer request, approval, ship, receive.
9. Void/refund approval.
10. Shift variance approval.
11. Reports: stock variance, waste, shift.
12. Audit log untuk semua action kritikal.
```

## 8. Prompt Eksekusi Wave 5

```text
Lanjutkan implementasi Wave 5 — Purchasing, Supplier, Production, QC.

Implementasikan:
1. Supplier management.
2. Purchase request.
3. Purchase order.
4. Goods receipt note.
5. Supplier invoice status.
6. Purchase return.
7. Batch/lot dan expiry date.
8. FIFO/FEFO baseline.
9. Production order central kitchen.
10. Production input/output, yield, waste, costing.
11. QC inspection.
12. Reject supplier.
13. Temperature log.
14. Batch traceability.
```

## 9. Prompt Eksekusi Wave 6

```text
Lanjutkan implementasi Wave 6 — CRM, Loyalty, Promo.

Implementasikan:
1. Customer profile.
2. Customer OTP login baseline.
3. Order history.
4. Voucher.
5. Promo rule.
6. Loyalty point.
7. Membership level.
8. Promo usage report.
9. Feedback and complaint.
10. Customer account pages.
```

## 10. Prompt Eksekusi Wave 7

```text
Lanjutkan implementasi Wave 7 — Finance and BI.

Implementasikan:
1. Payment reconciliation.
2. Expense.
3. Cash in/out.
4. COGS report.
5. P&L per outlet.
6. Sales by outlet/menu/category/hour/day/channel.
7. Payment method report.
8. Waste report.
9. Inventory valuation.
10. Dashboard owner advanced.
11. CSV/PDF export dengan audit log.
```

## 11. Prompt Eksekusi Wave 8

```text
Lanjutkan implementasi Wave 8 — Hardening, Scale, Governance.

Implementasikan:
1. Security hardening.
2. Rate limiting.
3. Input validation audit.
4. Offline POS queue dengan IndexedDB/Dexie.
5. Printer integration strategy atau browser print stable.
6. Monitoring hooks.
7. Backup scripts.
8. Seed demo data.
9. E2E test critical flows dengan Playwright.
10. Documentation final.
11. Deployment guide production.
```

## 12. Prompt untuk Melanjutkan Jika AI Berhenti

Jika AI berhenti di tengah, gunakan prompt:

```text
Lanjutkan dari kondisi repository saat ini.
Baca TASKS.md, IMPLEMENTATION_PLAN.md, dan CHANGELOG.md.
Identifikasi pekerjaan terakhir yang belum selesai.
Lanjutkan implementasi tanpa mengulang dari awal.
Jangan menghapus file yang sudah dibuat kecuali ada alasan teknis jelas.
Setelah selesai, update TASKS.md dan CHANGELOG.md.
```

## 13. Prompt untuk Audit Hasil Kode

```text
Audit repository ini terhadap dokumen planning ERP FnB Enterprise.
Buat laporan:
1. Modul yang sudah lengkap.
2. Modul yang sebagian selesai.
3. Modul yang belum dibuat.
4. Inkonsistensi terhadap dokumen planning.
5. Risiko arsitektur/security/data integrity.
6. Rekomendasi perbaikan berurutan.

Jangan menulis kode dulu. Buat AUDIT_REPORT.md.
```

## 14. Prompt untuk Generate Test

```text
Buat test otomatis untuk critical flow ERP FnB:
1. Customer QR order sampai kitchen dan completed.
2. POS order cash sampai receipt dan closing shift.
3. Recipe deduction mengurangi stok.
4. Waste mengurangi stok dan muncul di report.
5. Stock opname menghasilkan variance dan adjustment approval.
6. Purchase receiving menambah stok batch/expiry.
7. Void/refund membutuhkan approval dan audit log.
8. RBAC dan outlet scoping mencegah akses data outlet lain.

Gunakan unit test, integration test, dan E2E test sesuai kebutuhan.
```

## 15. Aturan agar AI Tidak Keluar Jalur

Instruksikan AI:

- Jangan membuat 3 backend terpisah.
- Jangan membuat 3 database terpisah.
- Jangan memakai MongoDB/Firebase sebagai database utama.
- Jangan mengubah stack tanpa alasan dan konfirmasi.
- Jangan membuat inventory update langsung tanpa movement ledger.
- Jangan mengabaikan tenant/outlet scoping.
- Jangan menghapus scope enterprise; jika belum dibuat, masukkan planned backlog.
- Jangan skip audit log untuk action kritikal.
- Jangan hardcode outlet/tenant/user.
