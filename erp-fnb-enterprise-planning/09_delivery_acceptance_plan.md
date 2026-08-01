# 09 — Enterprise Delivery and Acceptance Plan

## 1. Prinsip Delivery

User menginginkan target utuh, bukan MVP. Karena itu delivery plan ini menggunakan istilah **Full-Scope Enterprise Delivery**.

Namun secara profesional, full scope tetap dipecah menjadi gelombang implementasi agar:

- Risiko teknis terkendali.
- Dependencies jelas.
- QA dapat dilakukan bertahap.
- Stakeholder dapat memberi feedback sebelum terlambat.

Semua gelombang di bawah tetap bagian dari target akhir.

## 2. Implementation Waves

### Wave 1 — Foundation Platform

- Monorepo setup.
- Auth, tenant, outlet, user, role.
- Database schema baseline.
- Audit log baseline.
- UI shell untuk 3 portal.
- CI/CD, Docker, environments.

### Wave 2 — Menu, POS, Kitchen, Order

- Menu category/item/variant/add-on.
- Customer menu and cart.
- Staff POS.
- Kitchen board realtime.
- Payment method baseline.
- Receipt.
- Shift open/close.

### Wave 3 — Recipe, Inventory, Food Cost

- Item master.
- Unit conversion.
- Recipe/BOM.
- Inventory movement ledger.
- Sale deduction.
- Stock balance.
- Food cost and margin.
- Low stock alert.

### Wave 4 — Outlet Operations Enterprise

- Stock opname.
- Adjustment approval.
- Waste/spoilage.
- Receiving.
- Transfer stock.
- Void/refund approval.
- Shift approval and variance.

### Wave 5 — Purchasing, Supplier, Production, QC

- Supplier.
- PR/PO/GRN/invoice status.
- Purchase return.
- Central kitchen/production order.
- Batch/expiry/FEFO.
- QC inspection, reject, temperature log.

### Wave 6 — CRM, Loyalty, Promo, Customer Account

- Customer profile.
- OTP/member login.
- Voucher.
- Loyalty point.
- Promo rule.
- Feedback/complaint.

### Wave 7 — Finance and BI

- Payment reconciliation.
- Expense.
- COGS.
- P&L per outlet.
- Sales/menu/payment/waste/stock reports.
- Executive dashboard.
- Export PDF/CSV.

### Wave 8 — Hardening, Scale, Enterprise Governance

- Security hardening.
- Performance optimization.
- Offline POS queue.
- Printer integration strategy.
- Monitoring and alerting.
- Backup/restore drill.
- Full UAT.
- Documentation and training material.

## 3. Definition of Done

Sebuah fitur dianggap done jika:

- Requirement ID terpenuhi.
- UI responsive sesuai role.
- API divalidasi dan permission-protected.
- Database migration aman.
- Audit log ada jika action kritikal.
- Unit/integration/E2E test relevan pass.
- Error state dan empty state tersedia.
- Dokumentasi API/flow diperbarui.
- QA signoff.
- UAT signoff jika fitur user-facing.

## 4. Product-Level Acceptance Criteria

Produk ERP FnB enterprise diterima jika:

1. Customer dapat order via QR/web sampai tracking selesai.
2. Kasir dapat menjalankan POS, payment, receipt, kitchen, closing shift.
3. Owner dapat mengelola outlet, menu, user, role, price, promo.
4. Recipe/BOM aktif dan penjualan mengurangi stok otomatis.
5. Food cost dan margin tampil per menu/outlet.
6. Inventory movement ledger akurat dan append-only.
7. Stock opname, adjustment, waste, receiving, transfer berjalan.
8. Purchasing supplier berjalan dari PR/PO sampai receiving/invoice status.
9. Void, refund, recipe change, price change, stock adjustment memiliki approval/audit sesuai rule.
10. Dashboard/report utama tersedia.
11. RBAC dan tenant/outlet scoping berjalan.
12. Backup, monitoring, logging, dan restore plan tersedia.
13. QA critical scenarios pass.
14. Dokumentasi developer, API, dan user flow tersedia.

## 5. Risks and Mitigation

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Scope terlalu luas | Build lama | Pecah wave, requirement freeze per wave |
| Inventory salah | Laporan profit salah | Ledger append-only, test transaction, audit |
| Offline POS kompleks | Data conflict | Mulai cache/offline queue terbatas, sync rules jelas |
| Printer thermal sulit | Operasional terganggu | Browser print awal, local agent/wrapper later |
| Payment callback duplikat | Double paid | Idempotency key dan unique external ref |
| Multi-tenant data leak | Risiko fatal | Tenant guard, test isolation, DB indexes |
| Reporting lambat | Owner experience buruk | Async export, indexes, read replica later |

## 6. Team Roles Recommended

- Product Owner/Business Analyst.
- Tech Lead/Architect.
- Backend Engineer.
- Frontend Engineer.
- UI/UX Designer.
- QA Engineer.
- DevOps Engineer.
- Data/Reporting Engineer untuk BI lanjutan.

## 7. Project Artifacts per Wave

Setiap wave sebaiknya menghasilkan:

- Updated requirements.
- UI wireframe/mockup.
- API contract.
- Database migration.
- Test cases.
- Release notes.
- UAT checklist.
- Operational guide.
