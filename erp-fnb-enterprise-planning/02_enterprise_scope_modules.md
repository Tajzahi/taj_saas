# 02 — Enterprise Scope and Module Map

## 1. Scope Utuh Produk

Scope final ERP FnB enterprise mencakup 3 portal dan seluruh domain bisnis FnB: customer ordering, POS, kitchen, inventory, recipe/BOM, purchasing, finance, CRM, loyalty, reporting, security, audit, approval, production, QC, HR, asset, dan integrasi.

## 2. Portal Map

| Portal | Pengguna | Fokus |
|---|---|---|
| Customer Web | Guest/customer/member | Menu, order, checkout, payment, tracking, loyalty |
| Karyawan Web | Kasir, dapur, supervisor, manager outlet | POS, kitchen, shift, payment, stock outlet, waste, receiving |
| Owner/Admin Web | Owner, admin, finance, purchasing, inventory, HR | ERP lengkap dan governance |

## 3. Module Map per Portal

| Modul | Customer | Karyawan | Owner/Admin | Keterangan |
|---|:---:|:---:|:---:|---|
| Auth & identity | ✓ | ✓ | ✓ | Login customer/staff/admin |
| Tenant/business |  |  | ✓ | Multi-tenant/multi-brand readiness |
| Outlet management | View | Outlet assigned | ✓ | Multi-outlet core |
| Menu catalog | ✓ | ✓ | Manage | Menu, category, availability |
| Variant/add-on/bundle | ✓ | ✓ | Manage | Size, topping, paket |
| Cart/checkout | ✓ | POS cart | Monitor | Customer cart/POS cart |
| Order management | ✓ | ✓ | ✓ | Status dan history |
| POS/payment | Limited | ✓ | Monitor | Kasir dan metode bayar |
| Kitchen board | Tracking | ✓ | Monitor | Realtime kitchen status |
| Shift/closing |  | ✓ | ✓ | Kasir reconciliation |
| Recipe/BOM |  | Read effect | ✓ | Pengurangan stok & food cost |
| Unit conversion |  |  | ✓ | kg-gr, liter-ml, pack-pcs |
| Inventory |  | Limited | ✓ | Stock ledger, batch, expiry |
| Stock opname |  | ✓ | ✓ | Opname dan variance |
| Waste/spoilage |  | ✓ | ✓ | Kerugian bahan/menu |
| Purchasing |  | Receiving/request | ✓ | PR/PO/GRN/invoice |
| Supplier |  | Limited | ✓ | Vendor management |
| Stock transfer |  | Receive/request | ✓ | Antar outlet/gudang |
| Production/central kitchen |  | Receive output | ✓ | Semi-finished/finished goods |
| QC/food safety |  | Input checks | ✓ | Batch, expiry, reject, recall |
| CRM/customer | ✓ | Lookup | ✓ | Customer profile/history |
| Loyalty/voucher/promo | ✓ | Apply/check | ✓ | Marketing rules |
| Finance/accounting |  | Shift cash | ✓ | P&L, COGS, AP/AR readiness |
| HR/staff scheduling |  | View shift | ✓ | Data staff, schedule, payroll readiness |
| Asset/maintenance |  | Report issue | ✓ | Mesin, chiller, freezer, maintenance |
| Reporting/BI | Limited | Shift/outlet | ✓ | Dashboard enterprise |
| Audit log |  | Logged | ✓ | Governance |
| Approval workflow |  | Request | ✓ | Void, refund, adjustment, PO |
| Notification | ✓ | ✓ | ✓ | Realtime, alerts |
| Integration/API | ✓ | ✓ | ✓ | Payment, printer, marketplace, BI |

## 4. Customer Web Modules

### 4.1 Menu Digital

- Kategori menu.
- Foto menu.
- Harga.
- Deskripsi.
- Label best seller/new/spicy/promo.
- Availability per outlet.
- Search dan filter.

### 4.2 Outlet/QR Ordering

- Pilih outlet.
- Scan QR outlet/meja.
- Auto-detect outlet, table, order type dine-in.
- Status outlet buka/tutup.
- Menu mengikuti outlet.

### 4.3 Product Detail, Cart, Checkout

- Variant: size, hot/ice, regular/large.
- Add-on: topping, extra shot, sauce.
- Special note: less sugar, no ice.
- Cart total, discount, tax, service charge.
- Checkout: dine-in, takeaway, pickup, delivery internal.

### 4.4 Payment dan Tracking

- Bayar di kasir.
- QRIS manual.
- Payment gateway readiness.
- Order tracking: diterima, diproses, siap, selesai, batal.

### 4.5 Customer Account, Loyalty, Feedback

- Guest checkout.
- Login nomor HP/OTP.
- Riwayat order.
- Loyalty point.
- Voucher.
- Rating/feedback/complaint.

## 5. Karyawan Web Modules

Karyawan Web adalah gabungan POS + kitchen + outlet operations. Untuk cafe/UMKM, kasir dan dapur dapat menjadi satu role, tetapi sistem tetap mendukung role terpisah.

### 5.1 POS/Kasir

- Login staff/PIN.
- Open shift.
- Menu grid.
- Cart POS.
- Variant/add-on/note.
- Discount, tax, service charge.
- Payment cash/QRIS/debit/e-wallet.
- Receipt/reprint.
- Void/refund dengan reason dan approval.

### 5.2 Kitchen

- Order realtime dari POS/customer.
- Status: baru, diproses, siap, selesai, batal.
- Detail modifier/note.
- Filter status.
- Service time tracking.
- Station routing untuk skala lebih besar.

### 5.3 Shift and Outlet Operations

- Open/close shift.
- Closing cash count.
- Payment breakdown.
- Cash variance.
- Stock opname outlet.
- Waste input.
- Receiving barang.
- Request restock/transfer.

## 6. Owner/Admin Web Modules

### 6.1 Master Data dan Governance

- Tenant/brand/outlet.
- User/role/permission.
- Device/printer.
- Approval workflow.
- Audit log.
- System settings.

### 6.2 Menu, Pricing, Promo

- Menu category.
- Menu item.
- Variant/add-on/bundle.
- Pricebook.
- Harga per outlet/channel.
- Promo/voucher/campaign.

### 6.3 Recipe/BOM dan Food Cost

- Recipe per menu/variant/add-on.
- Unit conversion.
- Yield.
- Waste percentage.
- Food cost.
- Margin.
- Recipe versioning dan approval.

### 6.4 Inventory dan Supply Chain

- Item master.
- Stock balance per outlet/gudang.
- Inventory movement ledger.
- Batch/expiry.
- FIFO/FEFO.
- Stock opname.
- Adjustment.
- Waste.
- Transfer.
- Purchasing dan supplier.

### 6.5 Production dan QC

- Production order.
- Central kitchen.
- Semi-finished/finished goods.
- Yield, waste produksi, costing.
- Quality inspection.
- Temperature log.
- Reject supplier.
- Batch traceability.
- Product recall readiness.

### 6.6 Finance, Reporting, CRM, HR, Asset

- Sales reconciliation.
- Payment report.
- Expense.
- COGS/food cost.
- P&L per outlet.
- Customer data dan loyalty.
- Staff schedule/payroll readiness.
- Asset and maintenance.
- Executive dashboard dan BI.
