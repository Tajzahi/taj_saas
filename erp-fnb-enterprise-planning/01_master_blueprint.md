# 01 — Master Blueprint ERP FnB Enterprise

## 1. Ringkasan Produk

Produk yang akan dibangun adalah **ERP FnB multi-outlet kelas enterprise** untuk cafe, coffee shop, restoran kecil-menengah, cloud kitchen, bakery, catering, dan FnB startup.

Produk memiliki 3 web app/portal:

1. **Customer Web** — customer melihat menu, scan QR, order, checkout, bayar, dan tracking order.
2. **Karyawan Web** — staff outlet melakukan POS/kasir, kitchen/order board, pembayaran, shift, closing, stock opname, waste, dan receiving sederhana.
3. **Owner/Admin Web** — owner/admin mengelola ERP lengkap: multi-outlet, menu, recipe/BOM, inventory, purchasing, supplier, food cost, finance, reporting, user/role, audit, approval, CRM/loyalty, promo, production, QC, HR, asset, dan governance.

## 2. Prinsip Utama

```text
Customer Web/PWA
       |
Karyawan POS-Kitchen Web/PWA  --->  ERP Backend/API  --->  PostgreSQL
       |
Owner/Admin ERP Web
```

- Tiga portal web berbeda.
- Satu backend ERP core.
- Satu database utama.
- Role dan permission membedakan akses.
- Semua data transaksi, stok, payment, dan laporan berasal dari single source of truth.
- Sistem menggunakan web/PWA sebagai baseline agar murah di awal dan mudah dipakai lintas device.

## 3. Validasi Pemahaman 3 Portal

Pemahaman berikut benar:

| Portal | Analogi | Fungsi Utama |
|---|---|---|
| Customer Web | E-commerce FnB/online ordering | Lihat menu, cart, checkout, payment, tracking, loyalty |
| Karyawan Web | POS + dapur + operasional outlet | Kasir, kitchen, shift, payment, stok outlet, waste |
| Owner/Admin Web | ERP/backoffice lengkap | Master data, inventory, purchasing, finance, reporting, role, audit |

Catatan: Customer Web mirip e-commerce, tetapi bukan marketplace umum. Ia adalah **digital ordering/QR ordering system** khusus FnB.

## 4. Target Enterprise, Bukan MVP

Dokumen ini tidak menggunakan konsep MVP sebagai batas scope. Semua modul yang didefinisikan adalah target utuh produk enterprise. Namun secara engineering, implementasi tetap harus diurutkan agar risiko teknis terkendali.

Istilah yang digunakan:

- **P0 Fundamental**: fondasi wajib agar sistem ERP FnB valid.
- **P1 Enterprise Core**: fitur inti enterprise yang wajib ada pada target release utuh.
- **P2 Advanced Enterprise**: fitur lanjutan enterprise yang tetap masuk target produk lengkap.

Prioritas ini bukan untuk membuang scope, tetapi untuk menyusun urutan build.

## 5. Business Goals

- Mengurangi pekerjaan manual outlet.
- Mengintegrasikan POS, kitchen, inventory, purchasing, finance, customer ordering, dan reporting.
- Mengontrol food cost, waste, dan margin.
- Memberikan dashboard real-time untuk owner.
- Mendukung multi-outlet, multi-role, multi-payment, dan multi-channel ordering.
- Menjadi platform ERP FnB yang siap scale ke SaaS/multi-tenant.

## 6. Enterprise Readiness Criteria

Produk dianggap enterprise-ready jika memiliki:

- RBAC/permission detail.
- Audit log untuk aktivitas kritikal.
- Approval workflow.
- Multi-outlet dan multi-tenant readiness.
- Reporting operasional dan finansial.
- Inventory transaction ledger yang akurat.
- Security baseline sesuai OWASP.
- Backup, monitoring, observability.
- Test automation dan QA process.
- Dokumentasi API, data model, deployment, dan user flow.

## 7. Stakeholder

| Stakeholder | Kepentingan |
|---|---|
| Owner | Laporan, profit, kontrol outlet, keputusan bisnis |
| Admin pusat | Master data, inventory, purchasing, promo, user |
| Manager outlet | Operasional outlet, shift, stok, closing, staff |
| Kasir | Input order, pembayaran, struk, closing |
| Staff dapur | Proses order, ubah status pesanan |
| Staff gudang | Receiving, transfer, stok, batch/expiry |
| Finance | Rekonsiliasi, expense, purchase, COGS, P&L, cash/bank |
| Customer | Menu, order, payment, tracking, loyalty |
| Developer/IT | Maintainability, scalability, monitoring, deployment |

## 8. Business Rules Utama

- Semua transaksi harus memiliki `tenant_id` dan `outlet_id` jika relevan.
- Harga menu bisa berbeda per outlet dan channel.
- Menu bisa aktif di outlet tertentu saja.
- Order dapat berasal dari customer web, POS, atau integrasi marketplace.
- Setiap order paid/completed harus menghasilkan inventory deduction berdasarkan recipe.
- Inventory movement tidak boleh diubah langsung; koreksi harus melalui adjustment dengan audit.
- Waste harus mengurangi stok dan tercatat sebagai cost.
- Void/refund/stock adjustment/perubahan harga/perubahan recipe dapat membutuhkan approval.
- Closing shift harus merekonsiliasi pembayaran sistem dan kas fisik.
- Owner dapat melihat semua outlet; manager hanya outlet yang ditugaskan.
- Customer dapat checkout sebagai guest atau akun loyalty.

## 9. Success Metrics

| Metric | Target Enterprise |
|---|---|
| Akurasi stok | Selisih opname menurun dan dapat ditelusuri |
| Food cost visibility | Food cost per menu/outlet tersedia real-time/daily |
| Waktu closing | Closing shift bisa dilakukan kurang dari 10 menit |
| Order processing | Order customer/POS masuk ke kitchen realtime |
| Reporting | Sales report tersedia per outlet, menu, channel, payment |
| Auditability | 100% aktivitas kritikal memiliki audit trail |
| Availability | Target production awal >= 99.5%, naik sesuai skala |

## 10. Rekomendasi Tech Stack Singkat

| Layer | Rekomendasi |
|---|---|
| Frontend | Next.js + React + TypeScript |
| Styling/UI | Tailwind CSS + shadcn/ui |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma atau Drizzle; rekomendasi awal Prisma |
| Realtime | Socket.IO/WebSocket |
| Queue/Cache | Redis + BullMQ |
| Storage | S3-compatible, contoh Cloudflare R2/MinIO |
| Deployment awal | Docker Compose di VPS |
| Scale path | Managed DB, CDN, multiple API instances, workers, read replica |
