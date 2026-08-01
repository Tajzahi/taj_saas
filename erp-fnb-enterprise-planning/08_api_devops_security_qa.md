# 08 — API, DevOps, Security, and QA

## 1. API Style

- REST JSON baseline.
- Prefix: `/api/v1`.
- Auth: Bearer token/JWT, refresh token.
- Idempotency key untuk payment/order critical operations.
- Response dan error format wajib konsisten.

### Common Headers

```http
Authorization: Bearer <token>
X-Tenant-Id: <tenant_id>
X-Outlet-Id: <outlet_id optional>
Idempotency-Key: <uuid for critical requests>
```

### Endpoint Groups

```text
/auth
/outlets
/customer/orders
/orders
/kitchen/orders
/shifts
/menu-categories
/menu-items
/recipes
/items
/stock-balances
/inventory-movements
/stock-opnames
/waste-records
/suppliers
/purchase-requests
/purchase-orders
/goods-receipts
/stock-transfers
/reports
/approval-requests
/audit-logs
```

### Example Create Order Payload

```json
{
  "outletId": "outlet_uuid",
  "source": "pos",
  "orderType": "dine_in",
  "tableId": "table_uuid",
  "customer": {
    "name": "Budi",
    "phone": "08123456789"
  },
  "items": [
    {
      "menuItemId": "menu_uuid",
      "variantId": "variant_uuid",
      "quantity": 1,
      "addOns": [
        { "addOnId": "addon_uuid", "quantity": 1 }
      ],
      "note": "less sugar"
    }
  ],
  "discountCode": "KOPI20"
}
```

## 2. Security Requirements

- Password dan PIN harus di-hash.
- Gunakan HTTPS di semua environment non-local.
- RBAC dan outlet scoping wajib di backend, bukan hanya frontend.
- Semua endpoint harus validasi input.
- Rate limiting untuk login, OTP, public order.
- CORS dibatasi per domain.
- Sensitive secrets disimpan di environment/secret manager.
- Jangan menyimpan data kartu; gunakan payment gateway token/callback.
- Payment callback harus validate signature.
- Audit log untuk aktivitas kritikal.
- Export data harus permission-based dan tercatat audit.

## 3. OWASP Baseline

- Injection prevention: ORM parameterized query.
- Broken auth prevention: secure session/refresh token rotation.
- Sensitive data exposure: encryption at rest where needed, HTTPS.
- Broken access control: guard/policy per endpoint.
- Security misconfiguration: hardened headers, no debug in production.
- Logging and monitoring: suspicious activity alert.

## 4. Audit Log Scope

Wajib audit:

- Login/logout/gagal login.
- Perubahan role/permission.
- Perubahan harga.
- Perubahan recipe.
- Void/refund.
- Stock adjustment.
- Stock opname approval.
- Purchase order approval.
- Promo/voucher creation.
- Export report/data.

Audit fields:

- actor_user_id.
- action.
- entity_type.
- entity_id.
- before_json.
- after_json.
- ip_address.
- user_agent.
- created_at.

## 5. DevOps and Deployment

### Environment

```text
local       : developer machine
dev         : internal integration
staging     : QA/UAT
production  : live
```

### Initial Deployment

```text
1 VPS
├── Caddy/Nginx
├── customer-web
├── staff-web
├── owner-web
├── api
├── PostgreSQL
├── Redis
└── backup job
```

### Backup

- PostgreSQL daily backup minimum.
- Point-in-time recovery jika sudah managed DB.
- Backup file storage metadata.
- Restore test minimal bulanan.

### Observability

- Error tracking: Sentry.
- Uptime monitoring: Uptime Kuma.
- API logs: structured JSON logs.
- Metrics: request latency, error rate, DB latency, queue failures.
- Business alerts: payment failure spike, order stuck, stock negative, backup failed.

## 6. Non-Functional Requirements

| Area | Requirement |
|---|---|
| POS menu load | < 2 detik pada koneksi normal |
| Create order | < 1 detik server processing target |
| Kitchen update | < 2 detik propagation target |
| Dashboard load | < 3 detik untuk range normal |
| Report export | Async job jika > 5 detik |
| Availability awal | >= 99.5% monthly target |
| Security | OWASP baseline, RBAC, audit |
| Data integrity | ACID transaction untuk payment/order/stock critical flow |

## 7. QA Strategy

### Test Types

| Type | Scope |
|---|---|
| Unit test | Business logic: order total, tax, discount, recipe deduction |
| Integration test | API + database transaction |
| E2E test | Customer order, POS order, kitchen, closing shift |
| Regression test | Critical flow before release |
| Performance test | POS load, order creation, dashboard/report |
| Security test | Auth, RBAC, tenant isolation, input validation |
| UAT | Owner, kasir, dapur, admin, finance scenario |

### Critical E2E Scenarios

1. Customer QR order sampai order completed dan stok berkurang.
2. POS cash order sampai receipt, kitchen, closing shift.
3. Void/refund dengan approval dan audit log.
4. Purchase receiving menambah stok batch/expiry.
5. Stock opname membuat variance dan adjustment.
6. Waste mengurangi stok dan muncul di report.
7. Recipe change dengan versioning dan approval.
8. Owner melihat report sales, food cost, waste, stock.

## 8. Release Gate

Sebelum production release:

- Semua migration berhasil di staging.
- Semua test critical pass.
- Backup restore test berhasil.
- Security checklist pass.
- UAT signoff dari stakeholder.
- Monitoring dan alert aktif.
- Rollback plan tersedia.
