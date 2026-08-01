# 03 — Functional Requirements

Format ID: `[AREA]-[NUMBER]`. Prioritas P0/P1/P2 adalah urutan build, bukan pengurangan scope.

## 1. Auth, User, Role

| ID | Requirement | Priority |
|---|---|---|
| AUTH-001 | Sistem mendukung login customer, staff, owner/admin. | P0 |
| AUTH-002 | Staff dapat login dengan email/password dan PIN cepat. | P0 |
| AUTH-003 | Sistem mendukung role-based access control. | P0 |
| AUTH-004 | User staff dapat di-assign ke satu atau lebih outlet. | P0 |
| AUTH-005 | Session management harus aman dan bisa revoke session. | P1 |
| AUTH-006 | Aktivitas login/logout gagal/berhasil tercatat. | P1 |
| AUTH-007 | Customer dapat login dengan nomor HP/OTP untuk loyalty. | P1 |

## 2. Multi-Outlet and Tenant

| ID | Requirement | Priority |
|---|---|---|
| OUTLET-001 | Sistem mendukung multi-outlet dalam satu tenant. | P0 |
| OUTLET-002 | Setiap order, stock, shift, payment, dan report terkait outlet. | P0 |
| OUTLET-003 | Outlet memiliki jam operasional, alamat, tax, service charge. | P0 |
| OUTLET-004 | Menu dan harga dapat berbeda per outlet. | P1 |
| OUTLET-005 | Sistem siap untuk multi-tenant dengan isolasi data tenant. | P1 |

## 3. Customer Ordering

| ID | Requirement | Priority |
|---|---|---|
| CUST-001 | Customer dapat melihat outlet dan menu aktif. | P0 |
| CUST-002 | Customer dapat scan QR meja/outlet. | P0 |
| CUST-003 | Customer dapat memilih menu, variant, add-on, note. | P0 |
| CUST-004 | Customer dapat checkout dine-in/takeaway/pickup/delivery. | P0 |
| CUST-005 | Customer dapat memilih payment method. | P0 |
| CUST-006 | Customer dapat tracking status order. | P0 |
| CUST-007 | Customer dapat menggunakan voucher dan loyalty point. | P1 |
| CUST-008 | Customer dapat memberi feedback/rating. | P2 |

## 4. POS, Payment, Kitchen, Shift

| ID | Requirement | Priority |
|---|---|---|
| POS-001 | Kasir dapat membuka shift sebelum transaksi. | P0 |
| POS-002 | Kasir dapat input order cepat dari daftar menu. | P0 |
| POS-003 | POS mendukung variant, add-on, discount, tax, service charge. | P0 |
| POS-004 | POS mendukung dine-in/takeaway/pickup/delivery. | P0 |
| POS-005 | Kasir dapat menerima cash, QRIS, debit, e-wallet. | P0 |
| POS-006 | Sistem menghitung kembalian cash. | P0 |
| POS-007 | Kasir dapat cetak/reprint struk. | P0 |
| POS-008 | POS mendukung void/refund dengan reason dan approval. | P1 |
| POS-009 | POS mendukung split payment. | P1 |
| POS-010 | POS mendukung offline queue terbatas via IndexedDB. | P2 |
| KIT-001 | Order dari customer/POS muncul realtime di kitchen board. | P0 |
| KIT-002 | Staff dapat mengubah status order: baru, diproses, siap, selesai, batal. | P0 |
| KIT-003 | Kitchen menampilkan note dan modifier. | P0 |
| KIT-004 | Kitchen mendukung filter status dan waktu order. | P0 |
| KIT-005 | Kitchen mendukung station/category routing. | P1 |
| SHIFT-001 | Staff membuka shift dengan modal kas awal. | P0 |
| SHIFT-002 | Semua transaksi payment terhubung ke shift aktif. | P0 |
| SHIFT-003 | Closing menampilkan total sales dan payment breakdown. | P0 |
| SHIFT-004 | Kasir input kas fisik dan sistem menghitung variance. | P0 |
| SHIFT-005 | Closing shift dapat membutuhkan approval supervisor. | P1 |

## 5. Menu, Recipe/BOM, Food Cost

| ID | Requirement | Priority |
|---|---|---|
| MENU-001 | Admin dapat membuat kategori dan menu. | P0 |
| MENU-002 | Menu memiliki foto, deskripsi, harga, status aktif, availability. | P0 |
| MENU-003 | Menu dapat memiliki variant dan add-on. | P0 |
| MENU-004 | Menu dapat tersedia hanya di outlet tertentu. | P0 |
| MENU-005 | Harga dapat berbeda per outlet/channel. | P1 |
| MENU-006 | Admin dapat membuat bundle/package. | P1 |
| MENU-007 | Perubahan harga tercatat audit log. | P1 |
| BOM-001 | Admin dapat membuat recipe/BOM per menu. | P0 |
| BOM-002 | Recipe terdiri dari bahan, qty, unit, yield, waste percentage. | P0 |
| BOM-003 | Sistem mendukung konversi satuan pembelian, stok, dan pemakaian. | P0 |
| BOM-004 | Penjualan menu mengurangi stok bahan berdasarkan recipe. | P0 |
| BOM-005 | Sistem menghitung food cost dan margin per menu. | P0 |
| BOM-006 | Recipe memiliki versioning dan approval. | P1 |
| BOM-007 | Sistem membandingkan standard usage vs actual usage. | P1 |

## 6. Inventory, Stock, Waste

| ID | Requirement | Priority |
|---|---|---|
| INV-001 | Admin dapat mengelola item bahan, packaging, semi-finished, finished goods. | P0 |
| INV-002 | Sistem mencatat stok per outlet/gudang. | P0 |
| INV-003 | Semua perubahan stok menggunakan inventory movement ledger. | P0 |
| INV-004 | Sistem mendukung batch/lot dan expiry date. | P1 |
| INV-005 | Sistem mendukung FIFO/FEFO. | P1 |
| INV-006 | Sistem memberikan low stock alert. | P0 |
| INV-007 | Sistem mendukung stock card dan inventory valuation. | P1 |
| STOCK-001 | Staff dapat melakukan stock opname outlet. | P0 |
| STOCK-002 | Sistem membandingkan stok sistem vs stok fisik. | P0 |
| STOCK-003 | Adjustment stok harus memiliki reason dan audit. | P0 |
| STOCK-004 | Adjustment dapat membutuhkan approval. | P1 |
| WASTE-001 | Staff dapat mencatat waste bahan/menu. | P0 |
| WASTE-002 | Waste mengurangi stok dan menghitung nilai kerugian. | P0 |
| WASTE-003 | Waste report tersedia per outlet, item, reason, periode. | P0 |

## 7. Purchasing, Supplier, Transfer

| ID | Requirement | Priority |
|---|---|---|
| PUR-001 | Admin dapat mengelola supplier. | P0 |
| PUR-002 | Sistem mendukung purchase request. | P1 |
| PUR-003 | Sistem mendukung purchase order. | P1 |
| PUR-004 | Penerimaan barang menambah stok dan mencatat batch/expiry. | P0 |
| PUR-005 | Sistem mencatat invoice supplier dan payment status. | P1 |
| PUR-006 | Sistem mendukung retur pembelian. | P1 |
| PUR-007 | Sistem menyimpan riwayat harga supplier. | P1 |
| TRF-001 | Outlet/gudang dapat request transfer. | P1 |
| TRF-002 | Transfer memiliki approval, shipment, receiving. | P1 |
| TRF-003 | Stok outlet asal berkurang dan outlet tujuan bertambah sesuai status. | P1 |
| TRF-004 | Batch/expiry ikut ditransfer. | P1 |

## 8. Production, QC, CRM, Finance, Reporting

| ID | Requirement | Priority |
|---|---|---|
| PROD-001 | Sistem mendukung production order. | P2 |
| PROD-002 | Produksi mengurangi bahan dan menambah semi/finished goods. | P2 |
| PROD-003 | Sistem mencatat yield, waste, cost produksi. | P2 |
| QC-001 | Sistem mendukung quality inspection barang masuk/produk. | P2 |
| QC-002 | Sistem mendukung temperature log, reject, batch traceability. | P2 |
| CRM-001 | Sistem menyimpan profil customer dan order history. | P1 |
| CRM-002 | Sistem mendukung voucher dan promo rule. | P1 |
| CRM-003 | Sistem mendukung loyalty point dan membership. | P1 |
| FIN-001 | Sistem menampilkan sales summary per outlet/periode. | P0 |
| FIN-002 | Sistem menampilkan payment reconciliation. | P0 |
| FIN-003 | Sistem menghitung COGS/food cost berdasarkan recipe dan inventory costing. | P0 |
| FIN-004 | Sistem mendukung expense dan cash in/out. | P1 |
| FIN-005 | Sistem menampilkan P&L per outlet. | P1 |
| FIN-006 | Sistem siap untuk chart of accounts dan journal. | P2 |
| REP-001 | Dashboard owner real-time/daily tersedia. | P0 |
| REP-002 | Report sales/menu/payment/shift/waste/stock tersedia. | P0 |
| REP-003 | BI advanced: trends, cohort, profitability, forecast. | P2 |

## 9. Governance

| ID | Requirement | Priority |
|---|---|---|
| GOV-001 | Audit log untuk login, price change, recipe change, void, refund, adjustment. | P0 |
| GOV-002 | Approval workflow configurable per action dan threshold. | P1 |
| GOV-003 | System settings per tenant/outlet. | P1 |
| GOV-004 | Export data CSV/PDF dengan audit. | P1 |
