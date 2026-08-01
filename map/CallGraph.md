# 📞 Dokumentasi Call Graph Complete - Taj SaaS Platform

Dokumen ini berisi **Call Graph (Grafik Panggilan Fungsi & Hierarki Eksekusi)** lengkap untuk sistem **Taj SaaS (Enterprise Multi-Tenant F&B SaaS Platform)**. 

Call Graph ini memetakan hubungan keterpanggilan (*caller-to-callee*) dari titik masuk (*entry point*) di lapisan UI (Client Component / Browser Event), ke lapisan Server Action & API Route Handler, helper internal, ORM Drizzle Postgres, hingga layanan eksternal (Ably Realtime, Better Auth, & Google Gemini AI).

---

## 📑 Daftar Isi Call Graph
1. [Hierarki Panggilan Arsitektur Monorepo Overview](#1-hierarki-panggilan-arsitektur-monorepo-overview)
2. [Call Graph 1: Resolusi Tenant & Middleware Interceptor](#2-call-graph-1-resolusi-tenant--middleware-interceptor)
3. [Call Graph 2: Otentikasi & Database Hook Pendaftaran User](#3-call-graph-2-otentikasi--database-hook-pendaftaran-user)
4. [Call Graph 3: Pembuatan Pesanan Pelanggan (Customer Checkout Flow)](#4-call-graph-3-pembuatan-pesanan-pelanggan-customer-checkout-flow)
5. [Call Graph 4: Notifikasi Broadcast Pesanan Real-time (Ably PubSub)](#5-call-graph-4-notifikasi-broadcast-pesanan-real-time-ably-pubsub)
6. [Call Graph 5: Operasional Kasir & Management Shift POS](#6-call-graph-5-operasional-kasir--management-shift-pos)
7. [Call Graph 6: Executive Cockpit & Server Actions Owner](#7-call-graph-6-executive-cockpit--server-actions-owner)
8. [Call Graph 7: Manajemen Inventori & Waste Logging (Resep BOM)](#8-call-graph-7-manajemen-inventori--waste-logging-resep-bom)
9. [Matriks Matriks Trace Panggilan Fungsi (Full Call Matrix Table)](#9-matriks-trace-panggilan-fungsi-full-call-matrix-table)

---

## 1. Hierarki Panggilan Arsitektur Monorepo Overview

Diagram berikut memperlihatkan peta hubungan panggilan fungsi umum dari UI Client Component hingga ke Database & External Services.

```mermaid
graph TD
    subgraph UI_Layer [Client Component UI / Browser Event]
        UI_CUST[Customer App Page / Checkout UI]
        UI_ADMIN[Admin POS Dashboard UI]
        UI_OWNER[Owner Cockpit UI]
    end

    subgraph Middleware_Layer [Next.js Middleware & Middleware Resolver]
        MW[resolveTenantMiddleware]
        PARSE[parseTenantFromHostname]
    end

    subgraph Handler_Layer [Server Actions & API Routes]
        API_ORDER[POST /api/orders]
        SA_ORDER[updateOrderStatusAction]
        SA_SHIFT[openShiftAction / closeShiftAction]
        SA_INV[createWasteLogAction]
        SA_AUTH[betterAuth Handler]
    end

    subgraph Helper_Layer [Internal Helpers & Utilities]
        TENANT_CTX[getTenantContext / getTenantId]
        CODE_GEN[generateOrderCode]
    end

    subgraph DB_Layer [Drizzle ORM & Neon Postgres]
        DB_QUERY[db.select / db.insert / db.update]
        DB_SCHEMA[packages/db/schema.ts]
    end

    subgraph External_Services [Layanan Eksternal]
        ABLY[Ably Realtime REST Engine]
        AUTH_ENGINE[Better Auth Engine]
        GEMINI[Google Gemini AI SDK]
    end

    UI_CUST --> MW
    UI_ADMIN --> MW
    UI_OWNER --> MW
    MW --> PARSE
    PARSE --> DB_QUERY

    UI_CUST --> API_ORDER
    API_ORDER --> CODE_GEN
    API_ORDER --> DB_QUERY
    API_ORDER --> ABLY

    UI_ADMIN --> SA_ORDER
    UI_ADMIN --> SA_SHIFT
    SA_ORDER --> TENANT_CTX
    SA_SHIFT --> TENANT_CTX
    SA_ORDER --> DB_QUERY
    SA_SHIFT --> DB_QUERY

    UI_OWNER --> SA_INV
    SA_INV --> TENANT_CTX
    SA_INV --> DB_QUERY

    SA_AUTH --> AUTH_ENGINE
    AUTH_ENGINE --> DB_QUERY
```

---

## 2. Call Graph 1: Resolusi Tenant & Middleware Interceptor

Memetakan eksekusi saat HTTP Request pertama kali menyentuh server Next.js.

```mermaid
flowchart TD
    A[Request HTTP Masuk] --> B[middleware.ts: resolveTenantMiddleware]
    B --> C[parseTenantFromHostname: parse hostname & port]
    C --> D{Apakah Localhost?}
    
    D -->|Ya| E{Cek Port Mismatch}
    E -->|Mismatch| F[NextResponse.redirect: Port Mismatch Target]
    E -->|Match| G[Ambil Tenant Slug]
    D -->|Tidak| G

    G --> H[db.select: Query schema.tenants by slug]
    H --> I{Hasil Query Tenant}
    I -->|Tenant Valid & Active| J[Injeksi Header: x-tenant-id & x-tenant-slug]
    J --> K[NextResponse.next]
    I -->|Not Found| L[NextResponse.json: HTTP 404]
    I -->|Inactive| M[NextResponse.json: HTTP 403]
```

---

## 3. Call Graph 2: Otentikasi & Database Hook Pendaftaran User

Memetakan panggilan fungsi saat pengguna mendaftar atau login melalui **Better Auth Engine**.

```mermaid
flowchart TD
    A[User Form Submit Signup/Login] --> B[authClient.signUp.email / signIn.email]
    B --> C[POST /api/auth/*]
    C --> D[lib/auth.ts: betterAuth Handler]
    D --> E[drizzleAdapter: query user & account table]
    
    E --> F{Event: User Created?}
    F -->|Ya| G[🔥 Trigger Hook: databaseHooks.user.create.after]
    G --> H[db.select: Query schema.tenants by slug]
    H --> I{Apakah Tenant Sudah Ada?}
    I -->|Belum| J[db.insert: Create default tenant 'taj-saas']
    I -->|Sudah| K[Get tenantId]
    J --> K
    
    K --> L[db.select: Check existing profiles for tenantId]
    L --> M{Jumlah Profile == 0?}
    M -->|Ya| N[Set role = 'owner']
    M -->|Tidak| O[Set role = 'kasir']
    
    N --> P[db.insert: Create schema.profiles]
    O --> P
    P --> Q[db.update: Update schema.user role column]
    Q --> R[Set Cross-Subdomain Session Cookie .localhost]
```

---

## 4. Call Graph 3: Pembuatan Pesanan Pelanggan (Customer Checkout Flow)

Memetakan urutan panggilan dari tombol submit pesanan di UI Pelanggan hingga insert data pesanan & broadcast event.

```mermaid
flowchart TD
    A[CheckoutUI: Submit Order Button Click] --> B[fetch /api/orders POST]
    B --> C[api/orders/route.ts: POST handler]
    
    C --> D[request.headers.get: 'x-tenant-slug']
    C --> E[db.select: Query schema.tenants by slug]
    C --> F[db.select: Query schema.menuItems by slugs]
    C --> G[db.select: Query schema.categories by tenantId]
    
    G --> H[Hitung Subtotal & Validasi Harga Menu + Varian]
    
    H --> I{Ada promoCode?}
    I -->|Ya| J[db.select: Query schema.promos by code]
    J --> K[Kalkulasi promoDiscount]
    I -->|Tidak| L[promoDiscount = 0]
    
    K --> M[generateOrderCode: Format A6-YYYYMMDD-xxxx]
    L --> M
    
    M --> N[db.insert: Create schema.orders status='received']
    N --> O[db.insert: Batch Create schema.orderItems]
    
    O --> P{ABLY_API_KEY Configured?}
    P -->|Ya| Q[Ably.Rest: new Ably.Rest]
    Q --> R[channel.publish: Event 'new-order' on orders:tenantSlug]
    P -->|Tidak| S[Skip Ably Broadcast]
    
    R --> T[NextResponse.json: Return HTTP 201 + orderCode]
    S --> T
```

---

## 5. Call Graph 4: Notifikasi Broadcast Pesanan Real-time (Ably PubSub)

Memetakan panggilan jaringan asinkron dari server pembawa event ke UI Kasir.

```mermaid
flowchart LR
    subgraph Server_Publisher [API Route / Server Action]
        A1[Ably.Rest.publish] --> A2[Ably PubSub Cloud]
    end

    subgraph Client_Subscriber [Admin POS Dashboard - Client Component]
        A2 --> B1[Ably.Realtime.subscribe]
        B1 --> B2[onMessageReceived Callback]
        B2 --> B3[playNotificationSound: Play Audio Beep]
        B2 --> B4[setOrdersState: Update Local State UI]
        B2 --> B5[toast.success: Display Popup Notification]
    end
```

---

## 6. Call Graph 5: Operasional Kasir & Management Shift POS

Memetakan panggilan Server Actions yang dieksekusi oleh kasir di aplikasi POS (`apps/admin`).

```mermaid
flowchart TD
    subgraph Shift_Management [Manajemen Shift Kasir]
        A1[POS UI: Tombol Buka Shift] --> A2[openShiftAction startingCash, operatorName]
        A2 --> A3[getTenantContext]
        A3 --> A4[db.select: Check open shifts]
        A4 --> A5[db.insert: schema.shifts status='open']
        A5 --> A6[db.insert: schema.shiftLogs action='open']
        A6 --> A7[revalidatePath /]

        B1[POS UI: Tombol Tutup Shift] --> B2[closeShiftAction shiftId, actualCash, expectedCash]
        B2 --> B3[getTenantContext]
        B3 --> B4[db.update: schema.shifts status='closed', drift]
        B4 --> B5[db.insert: schema.shiftLogs action='close']
        B5 --> B6[revalidatePath /]
    end

    subgraph Order_Operations [Operasional Pesanan POS]
        C1[POS UI: Ubah Status Order] --> C2[updateOrderStatusAction orderId, newStatus]
        C2 --> C3[getTenantContext]
        C3 --> C4[db.update: schema.orders status]
        C4 --> C5[db.insert: schema.auditLogs]
        C5 --> C6{COD & Status == 'completed'?}
        C6 -->|Ya| C7[db.insert: schema.shiftLogs action='cash_in']
        C6 -->|Tidak| C8[revalidatePath /]
        C7 --> C8
    end
```

---

## 7. Call Graph 6: Executive Cockpit & Server Actions Owner

Memetakan panggilan Server Actions untuk analitik dan pengelolaan bisnis pada `apps/owner`.

```mermaid
flowchart TD
    subgraph Owner_Actions [apps/owner/app/actions/*]
        A1[Owner UI: Tab Persediaan] --> A2[getInventoryAction]
        A2 --> A3[getTenantId]
        A3 --> A4[db.select: schema.inventory]

        B1[Owner UI: Tab Analitik] --> B2[getAnalyticsAction]
        B2 --> B3[getTenantId]
        B3 --> B4[db.select: schema.orders aggregated metrics]

        C1[Owner UI: Tab Keuangan] --> C2[getFinanceAction]
        C2 --> C3[getTenantId]
        C3 --> C4[db.select: schema.orders & schema.shiftLogs]

        D1[Owner UI: Tab Asisten AI] --> D2[POST /api/chat]
        D2 --> D3[GoogleGenAI.getGenerativeModel]
        D3 --> D4[model.generateContent prompt]
    end
```

---

## 8. Call Graph 7: Manajemen Inventori & Waste Logging (Resep BOM)

Memetakan pemanggilan saat laporan barang rusak/expired (*waste*) dibuat.

```mermaid
flowchart TD
    A[Owner UI: Form Input Waste Log] --> B[createWasteLogAction data]
    B --> C[getTenantId]
    C --> D[db.insert: schema.inventoryTransactions type='waste']
    D --> E[db.select: Query current stock from schema.inventory]
    E --> F[Kalkulasi newStock = currentStock - quantity]
    F --> G[db.update: schema.inventory set stock=newStock]
    G --> H[revalidatePath /persediaan]
    H --> I[Return { success: true, data: tx }]
```

---

## 9. Matriks Trace Panggilan Fungsi (Full Call Matrix Table)

Tabel berikut menyajikan rincian lengkap fungsi pemanggil (*caller*), fungsi yang dipanggil (*callee*), file sumber, dan dampaknya pada database/layanan eksternal.

| Entry Point (Caller UI / Event) | Intermediate Handler (Callee) | Location File Path | Sub-Calls & Helper Invoked | Target DB / External Service |
| :--- | :--- | :--- | :--- | :--- |
| **HTTP Request Arrival** | `resolveTenantMiddleware` | [tenant.ts](file:///d:/taj_saas/packages/shared/tenant.ts#L53) | `parseTenantFromHostname()` | Neon DB (`schema.tenants`) |
| **Sign Up Form Submit** | `authClient.signUp.email` | [auth-client.ts](file:///d:/taj_saas/lib/auth-client.ts#L1) | `databaseHooks.user.create.after` | Better Auth Engine & Neon DB (`user`, `profiles`) |
| **Customer Checkout Submit** | `POST /api/orders` | [route.ts](file:///d:/taj_saas/apps/customer/app/api/orders/route.ts#L37) | `generateOrderCode()`, `Ably.Rest.publish()` | Neon DB (`orders`, `orderItems`) & Ably Broker |
| **Cashier Open Shift** | `openShiftAction` | [actions.ts](file:///d:/taj_saas/apps/admin/app/actions.ts#L304) | `getTenantContext()`, `revalidatePath()` | Neon DB (`shifts`, `shiftLogs`) |
| **Cashier Close Shift** | `closeShiftAction` | [actions.ts](file:///d:/taj_saas/apps/admin/app/actions.ts#L362) | `getTenantContext()`, `revalidatePath()` | Neon DB (`shifts`, `shiftLogs`) |
| **Cashier Update Order Status** | `updateOrderStatusAction` | [actions.ts](file:///d:/taj_saas/apps/admin/app/actions.ts#L115) | `getTenantContext()`, `revalidatePath()` | Neon DB (`orders`, `auditLogs`, `shiftLogs`) |
| **Cashier Verify Payment** | `verifyPaymentStatusAction` | [actions.ts](file:///d:/taj_saas/apps/admin/app/actions.ts#L187) | `getTenantContext()`, `revalidatePath()` | Neon DB (`orders`, `auditLogs`, `shiftLogs`) |
| **POS Direct Offline Order** | `createOfflineOrderAction` | [actions.ts](file:///d:/taj_saas/apps/admin/app/actions.ts#L617) | `getTenantContext()`, `revalidatePath()` | Neon DB (`orders`, `orderItems`) |
| **Owner Waste Stock Input** | `createWasteLogAction` | [inventory.ts](file:///d:/taj_saas/apps/owner/app/actions/inventory.ts#L46) | `getTenantId()`, `revalidatePath()` | Neon DB (`inventory`, `inventoryTransactions`) |
| **Owner Fetch Inventory** | `getInventoryAction` | [inventory.ts](file:///d:/taj_saas/apps/owner/app/actions/inventory.ts#L15) | `getTenantId()` | Neon DB (`inventory`) |
| **Owner Fetch Financials** | `getFinanceAction` | [finance.ts](file:///d:/taj_saas/apps/owner/app/actions/finance.ts#L1) | `getTenantId()` | Neon DB (`orders`, `shiftLogs`) |
| **Owner AI Prompt Assistant** | `POST /api/chat` | [route.ts](file:///d:/taj_saas/apps/owner/app/api/chat/route.ts#L1) | `model.generateContent()` | Google Gemini AI API |

---

*Dokumentasi Call Graph ini dibuat secara otomatis dan komprehensif untuk platform Taj SaaS.*
