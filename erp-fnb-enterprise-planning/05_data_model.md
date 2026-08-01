# 05 — Data Model and Data Dictionary

## 1. High-Level Model

```text
Tenant -> Brand -> Outlet -> Device
Tenant -> User -> Role -> Permission
Outlet -> Shift -> Order -> Payment
Order -> OrderItem -> MenuItem -> Recipe -> Ingredient
Ingredient/Item -> StockBalance -> InventoryMovement
Supplier -> PurchaseOrder -> GoodsReceipt -> InventoryMovement
Outlet/Warehouse -> StockTransfer -> TransferLine -> InventoryMovement
Customer -> LoyaltyAccount -> VoucherRedemption -> Order
```

## 2. Core Entities

### Tenant

Representasi perusahaan/brand group.

| Field | Type | Note |
|---|---|---|
| id | UUID | Primary key |
| name | string | Nama tenant |
| status | enum | active/suspended |
| created_at | timestamp |  |

### Outlet

| Field | Type | Note |
|---|---|---|
| id | UUID | Primary key |
| tenant_id | UUID | Tenant owner |
| name | string | Nama outlet |
| code | string | Unique per tenant |
| address | text | Alamat |
| timezone | string | Default Asia/Jakarta |
| tax_rate | decimal | Pajak default |
| service_charge_rate | decimal | Service charge default |
| status | enum | active/inactive |

### User

| Field | Type | Note |
|---|---|---|
| id | UUID |  |
| tenant_id | UUID | nullable untuk platform superadmin jika ada |
| name | string |  |
| email | string | unique scoped |
| phone | string |  |
| password_hash | string |  |
| pin_hash | string | staff PIN optional |
| status | enum | active/inactive |

### Role and Permission

| Entity | Description |
|---|---|
| role | Owner, Admin, Manager Outlet, Kasir, Dapur, Finance, Inventory |
| permission | Action granular seperti `order.void`, `inventory.adjust.approve` |
| user_role | Mapping user to role |
| user_outlet | Mapping user to allowed outlet |

## 3. Menu and Recipe

### MenuCategory

- `id`, `tenant_id`, `name`, `sort_order`, `status`.

### MenuItem

| Field | Type | Note |
|---|---|---|
| id | UUID |  |
| tenant_id | UUID |  |
| category_id | UUID |  |
| name | string |  |
| description | text |  |
| image_url | string |  |
| base_price | decimal |  |
| status | enum | active/inactive |
| availability_status | enum | available/sold_out |

### MenuVariant

- Size/temperature/etc.
- May affect price and recipe.

### AddOn

- Topping/additional shot/etc.
- May have own recipe deduction.

### Recipe

| Field | Type | Note |
|---|---|---|
| id | UUID |  |
| tenant_id | UUID |  |
| menu_item_id | UUID |  |
| variant_id | UUID | nullable |
| version | integer |  |
| status | enum | draft/active/archived |
| yield_qty | decimal | optional |
| effective_from | date |  |

### RecipeLine

| Field | Type | Note |
|---|---|---|
| recipe_id | UUID |  |
| item_id | UUID | Ingredient/packaging |
| quantity | decimal | Usage quantity |
| unit_id | UUID | Usage unit |
| waste_percentage | decimal | Optional |

## 4. Order and Payment

### Order

| Field | Type | Note |
|---|---|---|
| id | UUID |  |
| tenant_id | UUID |  |
| outlet_id | UUID |  |
| order_no | string | unique per outlet/day optional |
| source | enum | customer_web/pos/marketplace |
| order_type | enum | dine_in/takeaway/pickup/delivery |
| table_id | UUID | nullable |
| customer_id | UUID | nullable |
| status | enum | pending/accepted/processing/ready/completed/canceled |
| payment_status | enum | unpaid/partial/paid/refunded/failed |
| subtotal | decimal |  |
| discount_total | decimal |  |
| tax_total | decimal |  |
| service_charge_total | decimal |  |
| grand_total | decimal |  |
| created_by | UUID | staff/customer nullable |

### OrderItem

- `order_id`, `menu_item_id`, `variant_id`, `qty`, `unit_price`, `discount`, `note`, `status`.

### Payment

| Field | Type | Note |
|---|---|---|
| id | UUID |  |
| order_id | UUID |  |
| shift_id | UUID | nullable for customer online |
| method | enum | cash/qris/debit/ewallet/payment_gateway |
| amount | decimal |  |
| status | enum | pending/paid/failed/refunded |
| external_ref | string | idempotency |

## 5. Shift

`Shift` menyimpan sesi kasir.

| Field | Note |
|---|---|
| outlet_id | Outlet shift |
| user_id | Kasir/staff |
| opened_at / closed_at | Waktu buka/tutup |
| opening_cash | Modal kas awal |
| closing_cash_system | Kas cash menurut sistem |
| closing_cash_actual | Kas fisik input kasir |
| cash_variance | Selisih |
| status | open/closed/approved |

## 6. Inventory

### Item Types

- Raw material: ayam, susu, kopi, gula.
- Packaging: cup, lid, paper bag.
- Semi-finished: saus, dough, frozen patty.
- Finished goods: bottled coffee, frozen food.
- Operational item: tissue, sabun, alat kebersihan.

### Item

| Field | Type | Note |
|---|---|---|
| id | UUID |  |
| tenant_id | UUID |  |
| sku | string | unique per tenant |
| name | string |  |
| item_type | enum | raw/packaging/semi_finished/finished/operational |
| base_unit_id | UUID | smallest/base unit |
| costing_method | enum | weighted_average/fifo |
| minimum_stock | decimal | optional by outlet setting |

### Unit and Conversion

- `unit`: gram, kg, ml, liter, pcs, pack, carton.
- `unit_conversion`: from_unit, to_unit, multiplier.

### StockBalance

Current stock snapshot per location:

- `tenant_id`, `location_id`, `item_id`, `quantity_base_unit`, `average_cost`.

### InventoryMovement

Append-only ledger.

| Field | Type | Note |
|---|---|---|
| id | UUID |  |
| tenant_id | UUID |  |
| location_id | UUID | outlet/gudang |
| item_id | UUID |  |
| movement_type | enum | purchase_receive/sale_deduction/waste/adjustment/transfer_in/transfer_out/production_in/production_out |
| quantity_delta | decimal | positive/negative base unit |
| unit_cost | decimal |  |
| total_cost | decimal |  |
| reference_type | string | order, GRN, transfer, stock_opname |
| reference_id | UUID |  |
| batch_id | UUID | nullable |
| created_at | timestamp |  |

## 7. Purchasing and Transfer

### Supplier

- `id`, `tenant_id`, `name`, `contact_person`, `phone`, `email`, `address`, `status`.

### PurchaseOrder

- `supplier_id`, `location_id`, `status`, `total`, `expected_date`.

### GoodsReceipt

- Penerimaan barang dari supplier/PO; membuat inventory movement.

### StockTransfer

- Source location, destination location, transfer status, lines, discrepancy.

## 8. Stock Opname and Waste

### StockOpname

- Header opname: outlet, date, status, submitted_by, approved_by.

### StockOpnameLine

- item, system_qty, physical_qty, variance_qty, note.

### WasteRecord

- item/menu, qty, reason, outlet, cost, photo_url, status.

## 9. Finance

Baseline operational finance:

- Sales summary.
- Payment settlement.
- Expense.
- COGS/food cost.
- P&L per outlet.

Accounting readiness:

- ChartOfAccount.
- JournalEntry.
- JournalLine.
- AccountPayable.
- AccountReceivable.

## 10. Audit and Approval

### AuditLog

- actor_user_id.
- action.
- entity_type.
- entity_id.
- before_json.
- after_json.
- ip_address.
- user_agent.
- created_at.

### ApprovalRequest

- action_type.
- entity_type.
- entity_id.
- requested_by.
- approver_role/user.
- status.
- reason.
- approved_at/rejected_at.

## 11. Database Rules

- Semua tabel utama memiliki UUID primary key.
- Semua transaksi memiliki tenant_id.
- Data outlet-specific memiliki outlet_id/location_id.
- Master data menggunakan soft delete.
- Inventory movement dan audit log append-only.
- Hindari delete transaksi; gunakan cancel/reversal.
