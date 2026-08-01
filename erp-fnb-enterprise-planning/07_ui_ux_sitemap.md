# 07 — UI/UX Sitemap

## 1. Design Principles

- Fast interaction untuk POS; minimal klik.
- Tablet-friendly untuk kasir/dapur.
- Mobile-first untuk customer.
- Dashboard owner ringkas tetapi bisa drill-down.
- Status order dan payment harus jelas secara visual.
- Semua action berisiko harus memiliki confirmation dan reason.
- Offline/sync state harus terlihat untuk POS.

## 2. Customer Web Sitemap

```text
/
├── pilih-outlet
├── outlet/{outletCode}
│   ├── menu
│   ├── menu/{menuSlug}
│   ├── cart
│   ├── checkout
│   ├── payment
│   └── order-tracking/{orderNo}
├── account
│   ├── profile
│   ├── order-history
│   ├── loyalty
│   └── vouchers
└── feedback/{orderNo}
```

### Customer Screen List

| Screen | Notes |
|---|---|
| Outlet selector | Pilih outlet/lokasi |
| QR landing | Auto-set outlet/table |
| Menu catalog | Category tabs, search, availability |
| Menu detail | Variant, add-on, note |
| Cart | Summary, promo, tax/service |
| Checkout | Order type, customer info |
| Payment | QRIS/payment gateway/bayar kasir |
| Tracking | Realtime status |
| Account/loyalty | History, point, voucher |

## 3. Karyawan Web Sitemap

```text
/staff
├── login
├── select-outlet
├── shift
│   ├── open
│   ├── current
│   └── close
├── pos
│   ├── menu-grid
│   ├── cart
│   ├── payment
│   └── receipt
├── kitchen
│   ├── new
│   ├── processing
│   ├── ready
│   └── completed
├── orders
│   ├── active
│   ├── history
│   └── detail/{orderId}
├── stock
│   ├── balances
│   ├── opname
│   ├── waste
│   └── receiving
└── requests
    └── restock-transfer
```

### POS Layout

```text
+------------------------------+---------------------+
| Category/Menu Grid           | Cart                |
|                              | Items               |
|                              | Discount/Tax/Total  |
|                              | [Pay] [Hold]        |
+------------------------------+---------------------+
```

### Kitchen Layout

```text
[New] [Processing] [Ready] [Completed]

Order Card:
- Order no
- Type/table
- Elapsed time
- Items/modifiers/notes
- Action buttons
```

## 4. Owner/Admin Web Sitemap

```text
/admin
├── dashboard
├── outlets
├── users-roles
├── menu
│   ├── categories
│   ├── items
│   ├── variants-addons
│   ├── bundles
│   └── availability
├── pricing-promo
│   ├── pricebooks
│   ├── vouchers
│   └── campaigns
├── recipe-bom
│   ├── recipes
│   ├── ingredients
│   ├── units
│   └── food-cost
├── inventory
│   ├── item-master
│   ├── stock-balances
│   ├── stock-card
│   ├── movements
│   ├── batch-expiry
│   ├── opname
│   ├── adjustment
│   └── waste
├── purchasing
│   ├── suppliers
│   ├── purchase-requests
│   ├── purchase-orders
│   ├── goods-receipts
│   └── returns
├── transfers
├── production
├── quality-food-safety
├── crm-loyalty
├── finance
│   ├── sales-reconciliation
│   ├── expenses
│   ├── cogs
│   ├── p-and-l
│   └── accounting-readiness
├── hr
├── asset-maintenance
├── reports
├── approvals
├── audit-logs
└── settings
```

## 5. Important UX States

- Loading state.
- Empty state.
- Error state.
- Offline/connection lost indicator.
- Sync pending indicator for POS.
- Payment pending/failed indicator.
- Low stock/sold out indicator.
- Approval required indicator.
- Audit-sensitive action confirmation.

## 6. Accessibility and Localization

- Bahasa Indonesia default.
- Currency IDR formatting.
- Timezone Asia/Jakarta default.
- Keyboard-friendly POS where possible.
- Color indicators must include labels, not color-only.
