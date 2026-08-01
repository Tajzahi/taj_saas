# 06 — RBAC, Approval, and Business Workflows

## 1. Role Baseline

| Role | Deskripsi |
|---|---|
| Owner | Akses penuh tenant dan semua outlet |
| Super Admin | Pengaturan sistem dan master data tinggi |
| Admin Pusat | Menu, inventory, purchasing, user operasional |
| Finance | Payment, expense, P&L, reconciliation, accounting |
| Manager Outlet | Operasional dan laporan outlet yang ditugaskan |
| Supervisor Outlet | Approval operasional outlet tertentu |
| Kasir | POS, payment, shift, receipt |
| Staff Dapur | Kitchen board dan order status |
| Staff Inventory | Stock opname, receiving, transfer, waste |
| Customer | Customer web, order, loyalty, history |

## 2. Permission Naming Convention

```text
resource.action.scope
```

Contoh:

- `order.create.outlet`
- `order.void.approve`
- `inventory.adjust.request`
- `inventory.adjust.approve`
- `menu.update.all`
- `report.view.all_outlets`

## 3. Permission Matrix Ringkas

| Module/Action | Owner | Admin | Finance | Manager Outlet | Supervisor | Kasir | Dapur | Inventory |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| View all dashboard | ✓ | ✓ | ✓ |  |  |  |  |  |
| View outlet dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |  |  | ✓ |
| Manage outlet | ✓ | ✓ |  |  |  |  |  |  |
| Manage user/role | ✓ | ✓ |  |  |  |  |  |  |
| Manage menu | ✓ | ✓ |  |  |  |  |  |  |
| Manage recipe | ✓ | ✓ |  |  |  |  |  |  |
| Manage price/promo | ✓ | ✓ |  |  |  |  |  |  |
| Open/close shift | ✓ |  |  | ✓ | ✓ | ✓ |  |  |
| Create POS order | ✓ |  |  | ✓ | ✓ | ✓ |  |  |
| Process kitchen order | ✓ |  |  | ✓ | ✓ |  | ✓ |  |
| Void/refund request | ✓ |  |  | ✓ | ✓ | ✓ |  |  |
| Void/refund approve | ✓ |  | ✓ | ✓ | ✓ |  |  |  |
| Stock opname input | ✓ | ✓ |  | ✓ | ✓ |  |  | ✓ |
| Stock adjustment approve | ✓ | ✓ |  | ✓ |  |  |  |  |
| Waste input | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| Purchasing manage | ✓ | ✓ | ✓ |  |  |  |  | ✓ |
| Receiving goods | ✓ | ✓ |  | ✓ | ✓ |  |  | ✓ |
| Finance report | ✓ |  | ✓ | Limited |  |  |  |  |
| Audit log view | ✓ | ✓ | Limited | Limited |  |  |  |  |

## 4. Approval Workflow Baseline

| Action | Requester | Approver | Notes |
|---|---|---|---|
| Void order below threshold | Kasir | Supervisor/Manager | Threshold configurable |
| Void order above threshold | Kasir/Manager | Owner/Admin | High risk |
| Refund | Kasir/Manager | Finance/Owner | Payment reconciliation |
| Stock adjustment small | Inventory/Manager | Manager | Outlet scope |
| Stock adjustment large | Inventory/Manager | Owner/Admin | Threshold by value |
| Recipe change | Admin | Owner/Admin senior | Affects food cost |
| Price change | Admin | Owner/Admin senior | Affects sales |
| Purchase order | Inventory/Admin | Manager/Owner | Amount threshold |
| Promo creation | Admin | Owner | Affects margin |

## 5. Customer QR Order Workflow

```text
Customer scan QR meja/outlet
-> Sistem load outlet + meja + menu available
-> Customer pilih menu/variant/add-on/note
-> Customer checkout
-> Payment: bayar kasir/QRIS/payment gateway
-> Order created
-> Staff/kitchen menerima order realtime
-> Staff proses order
-> Status update ke customer
-> Order completed
-> Inventory deduction berdasarkan recipe
-> Sales, food cost, shift/report terupdate
```

## 6. POS Order Workflow

```text
Kasir login
-> Open shift
-> Customer datang ke kasir
-> Kasir input menu
-> Kasir pilih payment method
-> Payment paid
-> Receipt printed
-> Order masuk kitchen board
-> Order diproses
-> Order completed
-> Inventory deduction
-> Shift sales terupdate
```

## 7. Kitchen Workflow

```text
Order masuk
-> Status: New
-> Staff klik Process
-> Status: Processing
-> Staff selesai buat pesanan
-> Status: Ready
-> Pesanan diserahkan
-> Status: Completed
-> Service time recorded
```

## 8. Inventory Deduction Workflow

```text
Order completed/paid sesuai policy
-> Ambil active recipe setiap order item
-> Konversi qty recipe ke base unit
-> Validasi stok/batch/FEFO
-> Buat inventory movement sale_deduction
-> Update stock balance
-> Recalculate COGS/food cost
-> Jika stok di bawah minimum, trigger low stock alert
```

## 9. Shift Closing Workflow

```text
Kasir membuka halaman closing
-> Sistem hitung total sales by payment method
-> Sistem hitung expected cash
-> Kasir input cash fisik
-> Sistem hitung variance
-> Kasir input catatan
-> Submit closing
-> Jika variance > threshold, approval supervisor
-> Shift closed
-> Laporan shift tersedia untuk owner/finance
```

## 10. Purchasing Workflow Enterprise

```text
Stock low atau kebutuhan manual
-> Purchase Request dibuat
-> Approval sesuai threshold
-> Purchase Order dibuat ke supplier
-> Supplier mengirim barang
-> Goods Receiving dilakukan
-> Input qty, batch, expiry, damaged/reject
-> Stock movement purchase_receive dibuat
-> Supplier invoice dicatat
-> Payment supplier dicatat finance
-> Purchasing report terupdate
```

## 11. Stock Transfer Workflow

```text
Outlet tujuan request stock
-> Admin/manager approve
-> Outlet/gudang asal prepare shipment
-> Transfer out movement dibuat
-> Barang dikirim
-> Outlet tujuan receiving
-> Jika ada discrepancy, catat selisih
-> Transfer in movement dibuat
-> Stock balance kedua lokasi terupdate
```

## 12. Stock Opname Workflow

```text
Admin/manager membuat sesi opname
-> Staff input stok fisik per item
-> Sistem bandingkan dengan stok sistem
-> Variance dihitung
-> Staff submit
-> Approval jika variance melebihi threshold
-> Adjustment movement dibuat
-> Stock balance terupdate
-> Variance report tersedia
```

## 13. Waste Workflow

```text
Staff menemukan bahan/menu terbuang
-> Input item/menu, qty, reason, note/photo
-> Sistem hitung cost waste
-> Jika perlu, approval manager
-> Inventory movement waste dibuat
-> Stock berkurang
-> Waste report terupdate
```

## 14. Recipe Change Workflow

```text
Admin membuat/mengubah recipe draft
-> Sistem menghitung food cost baru
-> Request approval owner/admin senior
-> Approval granted
-> Recipe version baru aktif per tanggal efektif
-> Semua order setelah tanggal efektif memakai recipe version baru
-> Audit log tersimpan
```
