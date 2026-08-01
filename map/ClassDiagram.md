# 🏛️ Dokumentasi Class Diagram Complete - Taj SaaS Platform

Dokumen ini berisi **Class Diagram (Diagram Kelas & Struktur Data Entitas)** lengkap untuk sistem **Taj SaaS (Enterprise Multi-Tenant F&B SaaS Platform)**. 

Class Diagram ini menggambarkan secara rinci struktur kelas entitas database (ORM Drizzle), tipe data interface, Data Transfer Object (DTO), relasi asosiasi/komposisi antar entitas, serta metode *service handler* pada seluruh arsitektur monorepo.

---

## 📑 Daftar Isi Class Diagram
1. [Struktur Kelas Entitas Multi-Tenant & Organisasi](#1-struktur-kelas-entitas-multi-tenant--organisasi)
2. [Diagram Kelas Otentikasi & Akun Pengguna (Better Auth Core)](#2-diagram-kelas-otentikasi--akun-pengguna-better-auth-core)
3. [Diagram Kelas Katalog Menu, Resep BOM, & Inventori](#3-diagram-kelas-katalog-menu-resep-bom--inventori)
4. [Diagram Kelas Transaksi Pesanan & Operasional Kasir (POS)](#4-diagram-kelas-transaksi-pesanan--operasional-kasir-pos)
5. [Diagram Kelas Log, Promosi, File, & Persetujuan](#5-diagram-kelas-log-promosi-file--persetujuan)
6. [Diagram Kelas DTO Payload & Service Handlers](#6-diagram-kelas-dto-payload--service-handlers)
7. **[Tabel Referensi Lengkap Atribut & Metode Kelas](#7-tabel-referensi-lengkap-atribut--metode-kelas)**

---

## 1. Struktur Kelas Entitas Multi-Tenant & Organisasi

Diagram berikut menggambarkan entitas inti multi-tenant `Tenant`, profil pengguna `Profile`, dan cabang bisnis fisik `Branch`.

```mermaid
classDiagram
    class Tenant {
        +UUID id
        +String name
        +String slug
        +String domain
        +String adminSubdomain
        +String ownerSubdomain
        +TenantBranding branding
        +String packageType
        +Boolean isActive
        +DateTime createdAt
        +getBrandingSettings()
        +isStoreOpen() Boolean
    }

    class TenantBranding {
        +String logoUrl
        +String primaryColor
        +String secondaryColor
        +String businessName
        +String whatsappNumber
        +Number flatDeliveryFee
        +Number minimumOrderAmount
        +String storeAddress
        +Boolean storeOpen
    }

    class Profile {
        +String id
        +UUID tenantId
        +String email
        +String role
        +String status
        +DateTime createdAt
        +isOwner() Boolean
        +isKasir() Boolean
    }

    class Branch {
        +UUID id
        +UUID tenantId
        +String name
        +String address
        +String phone
        +String picName
        +DateTime createdAt
    }

    Tenant "1" --* "1" TenantBranding : contains
    Tenant "1" --o "*" Profile : owns
    Tenant "1" --o "*" Branch : operates
```

---

## 2. Diagram Kelas Otentikasi & Akun Pengguna (Better Auth Core)

Diagram ini memperlihatkan entitas otentikasi bawaan engine **Better Auth** dan hubungannya dengan `Profile` bisnis.

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +Boolean emailVerified
        +String image
        +String role
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Account {
        +String id
        +String userId
        +String accountId
        +String providerId
        +String password
        +String accessToken
        +String refreshToken
        +DateTime expiresAt
    }

    class Session {
        +String id
        +String userId
        +String token
        +DateTime expiresAt
        +String ipAddress
        +String userAgent
    }

    class Verification {
        +String id
        +String identifier
        +String value
        +DateTime expiresAt
    }

    User "1" --o "*" Account : authentication_providers
    User "1" --o "*" Session : active_sessions
    User "1" -- "1" Profile : maps_to
```

---

## 3. Diagram Kelas Katalog Menu, Resep BOM, & Inventori

Diagram ini mendeskripsikan keterkaitan produk menu (`MenuItem`), varian (`MenuVariant`), topping (`Topping`), resep bahan baku (`Recipe`, `RecipeIngredient`), serta persediaan stok gudang (`Inventory`, `InventoryTransaction`).

```mermaid
classDiagram
    class Category {
        +UUID id
        +UUID tenantId
        +String name
        +String slug
        +String description
        +DateTime createdAt
    }

    class MenuItem {
        +UUID id
        +UUID tenantId
        +UUID categoryId
        +String name
        +String slug
        +Numeric price
        +String description
        +String image
        +String badge
        +Boolean isAvailable
        +DateTime createdAt
        +getFormattedPrice() String
    }

    class MenuVariant {
        +UUID id
        +UUID menuItemId
        +String name
        +Numeric priceModifier
        +DateTime createdAt
    }

    class Topping {
        +UUID id
        +UUID tenantId
        +String name
        +Numeric price
        +Boolean isAvailable
        +DateTime createdAt
    }

    class Recipe {
        +UUID id
        +UUID menuItemId
        +String name
        +Numeric yieldQuantity
        +String unit
        +DateTime createdAt
    }

    class RecipeIngredient {
        +UUID id
        +UUID recipeId
        +UUID inventoryId
        +String ingredientName
        +Numeric quantity
        +String unit
    }

    class Inventory {
        +UUID id
        +UUID tenantId
        +UUID branchId
        +String name
        +String sku
        +String unit
        +Numeric stock
        +Numeric minStock
        +Numeric costPerUnit
        +DateTime updatedAt
        +isLowStock() Boolean
    }

    class InventoryTransaction {
        +UUID id
        +UUID tenantId
        +UUID inventoryId
        +UUID branchId
        +String type
        +Numeric quantity
        +Numeric cost
        +String reason
        +String operatorName
        +DateTime createdAt
    }

    Category "1" --o "*" MenuItem : categorizes
    MenuItem "1" --o "*" MenuVariant : has_variants
    MenuItem "1" -- "0..1" Recipe : defines_recipe
    Recipe "1" --* "*" RecipeIngredient : contains_ingredients
    Inventory "1" --o "*" RecipeIngredient : supplies
    Inventory "1" --o "*" InventoryTransaction : logs_changes
    Tenant "1" --o "*" Category : owns
    Tenant "1" --o "*" Inventory : tracks
    Tenant "1" --o "*" Topping : offers
```

---

## 4. Diagram Kelas Transaksi Pesanan & Operasional Kasir (POS)

Diagram ini memperlihatkan kelas transaksi pesanan pelanggan (`Order`, `OrderItem`) dan operasional shift kasir (`Shift`, `ShiftLog`).

```mermaid
classDiagram
    class Order {
        +UUID id
        +UUID tenantId
        +UUID branchId
        +String orderCode
        +String customerName
        +String customerPhone
        +String deliveryType
        +String deliveryAddress
        +Numeric subtotal
        +Numeric totalPrice
        +String status
        +String paymentMethod
        +String paymentStatus
        +String paymentProofUrl
        +String notes
        +DateTime createdAt
        +calculateTotal() Numeric
        +isPaid() Boolean
    }

    class OrderItem {
        +UUID id
        +UUID orderId
        +UUID menuItemId
        +String menuItemName
        +String variantName
        +Integer quantity
        +Numeric unitPrice
        +Numeric totalPrice
    }

    class Shift {
        +UUID id
        +UUID tenantId
        +UUID branchId
        +String operatorId
        +String operatorName
        +DateTime openedAt
        +DateTime closedAt
        +Numeric startingCash
        +Numeric actualCash
        +Numeric drift
        +String status
        +calculateExpectedCash() Numeric
        +isOpen() Boolean
    }

    class ShiftLog {
        +UUID id
        +UUID tenantId
        +UUID shiftId
        +String action
        +Numeric amount
        +String notes
        +DateTime createdAt
    }

    Order "1" --* "*" OrderItem : contains_items
    Shift "1" --o "*" ShiftLog : records_cashflow
    Tenant "1" --o "*" Order : processes
    Tenant "1" --o "*" Shift : executes
    Branch "1" --o "*" Shift : hosts
```

---

## 5. Diagram Kelas Log, Promosi, File, & Persetujuan

Diagram ini mencakup kelas pendukung sistem seperti `AuditLog`, kupon `Promo`, penyimpanan `File` bukti transfer, dan pengajuan dana `Approval`.

```mermaid
classDiagram
    class AuditLog {
        +UUID id
        +UUID tenantId
        +String action
        +String entityType
        +String entityId
        +JSON details
        +DateTime createdAt
    }

    class Promo {
        +UUID id
        +UUID tenantId
        +String code
        +String type
        +Numeric value
        +Numeric minOrder
        +String targetCategory
        +Boolean isActive
        +DateTime expiresAt
        +isValidFor(subtotal) Boolean
    }

    class File {
        +UUID id
        +UUID tenantId
        +String filename
        +String fileType
        +String base64Data
        +DateTime createdAt
    }

    class Approval {
        +UUID id
        +UUID tenantId
        +String requesterName
        +Numeric amount
        +String category
        +String reason
        +String status
        +String approvedBy
        +DateTime createdAt
        +isApproved() Boolean
    }

    Tenant "1" --o "*" AuditLog : tracks_audit
    Tenant "1" --o "*" Promo : manages_promos
    Tenant "1" --o "*" File : stores_files
    Tenant "1" --o "*" Approval : handles_approvals
```

---

## 6. Diagram Kelas DTO Payload & Service Handlers

Diagram ini memetakan kelas-kelas DTO (Data Transfer Object) dan Service Handlers pada Server Next.js.

```mermaid
classDiagram
    class CreateOrderRequestDTO {
        +OrderItemPayloadDTO[] items
        +String customerName
        +String customerPhone
        +String orderType
        +String deliveryAddress
        +Number deliveryFee
        +String promoCode
        +String paymentMethod
    }

    class OrderItemPayloadDTO {
        +String menuItemSlug
        +String menuItemName
        +String variantName
        +Number variantPriceModifier
        +Integer quantity
        +String note
    }

    class OfflineOrderPayloadDTO {
        +String customerName
        +String orderType
        +String tableNo
        +Array items
        +Number totalPrice
        +String paymentMethod
        +String notes
    }

    class AdminPosService {
        +getOrdersAction()
        +updateOrderStatusAction(orderId, status)
        +verifyPaymentStatusAction(orderId, isPaid)
        +getActiveShiftAction()
        +openShiftAction(startingCash, operatorName)
        +closeShiftAction(shiftId, actualCash, expectedCash)
        +createOfflineOrderAction(data)
    }

    class OwnerCockpitService {
        +getInventoryAction()
        +createWasteLogAction(data)
        +getFinanceAction()
        +getAnalyticsAction()
        +getBranchesAction()
    }

    class AblyNotificationService {
        +publishNewOrder(tenantSlug, order)
    }

    CreateOrderRequestDTO "1" --* "*" OrderItemPayloadDTO : contains
    AdminPosService ..> OfflineOrderPayloadDTO : consumes
    AdminPosService ..> AblyNotificationService : triggers
```

---

## 7. Tabel Referensi Lengkap Atribut & Metode Kelas

Tabel referensi ini merangkum setiap kelas, tipe data utama, fungsi metode, dan relasi antar kelas dalam repositori Taj SaaS.

| Nama Kelas / Interface | Tipe / Role | Atribut Utama | Metode Utama | Relasi Terkait |
| :--- | :--- | :--- | :--- | :--- |
| **`Tenant`** | DB Entity | `id`, `name`, `slug`, `branding`, `isActive` | `isStoreOpen()` | Owns `Profile`, `Branch`, `Category`, `Order`, `Inventory` |
| **`User`** | Auth Entity | `id`, `name`, `email`, `role` | - | Linked to `Account`, `Session`, `Profile` |
| **`Profile`** | DB Entity | `id`, `tenantId`, `email`, `role`, `status` | `isOwner()`, `isKasir()` | Belongs to `User` & `Tenant` |
| **`Branch`** | DB Entity | `id`, `tenantId`, `name`, `address`, `phone` | - | Belongs to `Tenant`, Hosts `Shift` |
| **`MenuItem`** | DB Entity | `id`, `tenantId`, `categoryId`, `price`, `isAvailable` | `getFormattedPrice()` | Belongs to `Category`, Has `MenuVariant`, `Recipe` |
| **`Recipe`** | DB Entity | `id`, `menuItemId`, `yieldQuantity`, `unit` | - | Linked to `MenuItem`, Has `RecipeIngredient` |
| **`Inventory`** | DB Entity | `id`, `tenantId`, `stock`, `minStock`, `costPerUnit` | `isLowStock()` | Linked to `RecipeIngredient`, Logs `InventoryTransaction` |
| **`Order`** | DB Entity | `id`, `orderCode`, `totalPrice`, `status`, `paymentStatus` | `calculateTotal()`, `isPaid()` | Belongs to `Tenant`, Has `OrderItem` |
| **`Shift`** | DB Entity | `id`, `startingCash`, `actualCash`, `drift`, `status` | `calculateExpectedCash()` | Belongs to `Tenant` & `Branch`, Has `ShiftLog` |
| **`CreateOrderRequestDTO`**| Payload DTO | `items`, `customerName`, `orderType`, `paymentMethod` | - | Consumed by `POST /api/orders` |
| **`AdminPosService`** | Service Class | - | `openShiftAction()`, `closeShiftAction()`, `updateOrderStatusAction()` | Interacts with Drizzle ORM & Ably Service |
| **`OwnerCockpitService`**| Service Class | - | `getInventoryAction()`, `createWasteLogAction()`, `getFinanceAction()` | Interacts with Drizzle ORM & Gemini API |

---

*Dokumentasi Class Diagram ini dibuat secara otomatis dan komprehensif untuk platform Taj SaaS.*
