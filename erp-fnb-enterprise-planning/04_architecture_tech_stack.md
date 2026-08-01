# 04 — Architecture, Tech Stack, and Engineering Standards

## 1. Architecture Style

Baseline arsitektur:

- **Modular monolith** untuk backend.
- **3 frontend web/PWA** untuk customer, karyawan, owner/admin.
- **PostgreSQL** sebagai single source of truth.
- **Redis + BullMQ** untuk cache, queue, dan background job.
- **Socket.IO/WebSocket** untuk realtime order/kitchen/dashboard.
- **S3-compatible storage** untuk image menu, receipt, invoice, attachment.

## 2. Logical Architecture

```text
[Customer Web/PWA]
        |
[Staff POS-Kitchen Web/PWA] ----> [NestJS ERP Core API] ----> [PostgreSQL]
        |                                  |                     |
[Owner/Admin Web]                          |                     +--> [Backups]
                                           |
                                           +--> [Redis/BullMQ]
                                           +--> [S3-compatible Storage]
                                           +--> [WebSocket Gateway]
                                           +--> [Monitoring/Logging]
```

## 3. Recommended Tech Stack

| Layer | Stack |
|---|---|
| Monorepo | Turborepo atau Nx |
| Frontend | Next.js + React + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| State/data fetching | TanStack Query + Zustand |
| Form/validation | React Hook Form + Zod |
| PWA/offline | next-pwa + IndexedDB/Dexie.js |
| Backend | NestJS + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Realtime | Socket.IO |
| Cache/queue | Redis + BullMQ |
| Storage | Cloudflare R2/AWS S3/MinIO compatible |
| Auth | JWT session + refresh token, optional OTP |
| Testing | Jest/Vitest, Playwright, Supertest |
| Monitoring | Sentry, OpenTelemetry, Prometheus/Grafana optional |
| CI/CD | GitHub Actions |
| Deployment awal | Docker Compose di VPS |

## 4. Monorepo Structure

```text
erp-fnb/
├── apps/
│   ├── customer-web/
│   ├── staff-web/
│   ├── owner-web/
│   └── api/
├── packages/
│   ├── ui/
│   ├── shared/
│   ├── validation/
│   ├── database/
│   └── config/
├── docs/
├── docker-compose.yml
├── turbo.json
└── README.md
```

## 5. Backend Module Boundaries

```text
api/
├── auth
├── tenants
├── outlets
├── users
├── roles-permissions
├── customer
├── menu
├── pricing-promo
├── recipe-bom
├── pos-orders
├── kitchen
├── payments
├── shifts
├── inventory
├── purchasing
├── suppliers
├── transfers
├── production
├── quality-food-safety
├── crm-loyalty
├── finance
├── reports
├── notifications
├── audit-log
├── approval-workflow
└── integrations
```

## 6. Multi-Tenancy Strategy

Jika produk dijadikan SaaS, gunakan model:

```text
Tenant -> Brand -> Outlet -> Device/Shift/Order/Stock
```

Baseline data isolation:

- Setiap tabel transaksi memiliki `tenant_id`.
- Setiap data outlet-specific memiliki `outlet_id`.
- Semua query backend wajib scoped by tenant.
- Tambahkan database index pada `tenant_id`, `outlet_id`, `created_at`.
- Untuk enterprise besar, dapat migrasi ke dedicated database per tenant tertentu.

## 7. Data Consistency Strategy

ERP FnB sangat sensitif terhadap stok dan payment. Gunakan aturan:

- Order payment dan inventory deduction harus transactional atau idempotent.
- Inventory movement append-only; jangan update/delete movement historis.
- Adjustment adalah movement baru, bukan edit stok lama.
- Payment callback harus idempotent dengan unique external reference.
- Order status transition harus divalidasi.
- Setiap action kritikal harus dicatat audit log.

## 8. Event and Queue Strategy

Event internal contoh:

- `order.created`
- `order.paid`
- `order.completed`
- `inventory.deducted`
- `stock.low_detected`
- `shift.closed`
- `purchase.received`
- `waste.recorded`
- `approval.requested`

Queue digunakan untuk:

- Generate report.
- Send notification.
- Export PDF/CSV.
- Payment reconciliation.
- Sync printer/local agent.
- Recalculate food cost.

## 9. Realtime Strategy

WebSocket channel:

- `tenant:{tenantId}:outlet:{outletId}:orders`
- `tenant:{tenantId}:outlet:{outletId}:kitchen`
- `tenant:{tenantId}:outlet:{outletId}:shift`
- `tenant:{tenantId}:owner-dashboard`

Use cases:

- Order masuk ke kitchen.
- Kitchen status ke customer.
- Payment status update.
- Owner dashboard live sales.

## 10. Scalability Path

### Stage A: Low-cost production

- 1 VPS.
- Docker Compose.
- PostgreSQL same VPS.
- Redis optional.

### Stage B: Growing usage

- Managed PostgreSQL.
- Separate Redis.
- Frontend on CDN/edge.
- API on VPS/app server.
- Worker process separate.

### Stage C: Enterprise scale

- Multiple API instances behind load balancer.
- Managed Redis.
- PostgreSQL read replica.
- Dedicated worker cluster.
- Data warehouse for BI.
- Split modules into services only when needed.

## 11. Coding Standards

- Semua kode baru menggunakan TypeScript strict mode.
- Hindari business logic di controller; gunakan service/use-case layer.
- DTO/request validation menggunakan Zod/class-validator.
- Semua endpoint harus scoped by tenant dan permission.
- Semua perubahan data kritikal harus memanggil audit log service.
- Semua movement inventory harus append-only.
- Semua external callback harus idempotent.
- Error response harus konsisten.

## 12. Branching Strategy

```text
main        : production-ready
staging     : pre-production/UAT
develop     : integration branch
feature/*   : fitur
fix/*       : bugfix
release/*   : release candidate
hotfix/*    : production hotfix
```

## 13. Environment

```text
local       : developer machine
dev         : integration internal
staging     : UAT and QA
production  : live tenant/customer
```

## 14. Deployment Domains

Opsi subdomain:

```text
order.domain.com    -> customer web
pos.domain.com      -> karyawan web
admin.domain.com    -> owner/admin web
api.domain.com      -> backend API
```

Opsi path murah:

```text
domain.com/order
domain.com/pos
domain.com/admin
domain.com/api
```

## 15. Architecture Decisions

| Decision | Reason |
|---|---|
| Web/PWA first | Murah, cepat, cross-device, customer tidak perlu install app |
| Modular monolith | Lebih mudah build dan maintain di awal, tetap bisa split nanti |
| PostgreSQL | Relational, ACID, cocok untuk ERP/inventory/finance |
| 1 backend/database | Single source of truth untuk order, stok, laporan |
| Role-based portals | 3 experience berbeda tanpa memecah data core |
