# ⏱️ Dokumentasi Sequence Diagram Complete - Taj SaaS Platform

Dokumen ini berisi **Sequence Diagram (Diagram Urutan Eksekusi)** lengkap untuk sistem **Taj SaaS (Enterprise Multi-Tenant F&B SaaS Platform)**. 

Sequence Diagram ini mengilustrasikan secara kronologis pertukaran pesan (*message exchange*), pemanggilan fungsi, interaksi komponen, dan aliran kontrol antar aktor/sistem dari waktu ke waktu untuk skenario operasional utama.

---

## 📑 Daftar Isi Sequence Diagram
1. [Skenario 1: Intersepsi Request HTTP & Injeksi Header Multi-Tenant](#1-skenario-1-intersepsi-request-http--injeksi-header-multi-tenant)
2. [Skenario 2: Pendaftaran User & Auto-Provisioning Profile (Better Auth)](#2-skenario-2-pendaftaran-user--auto-provisioning-profile-better-auth)
3. [Skenario 3: Transaksi Pesanan Pelanggan & Broadcast Real-time](#3-skenario-3-transaksi-pesanan-pelanggan--broadcast-real-time)
4. [Skenario 4: Pengelolaan Status Pesanan oleh Kasir POS](#4-skenario-4-pengelolaan-status-pesanan-oleh-kasir-pos)
5. [Skenario 5: Operasional Shift Kasir (Buka Shift & Tutup Shift Rekonsiliasi)](#5-skenario-5-operasional-shift-kasir-buka-shift--tutup-shift-rekonsiliasi)
6. [Skenario 6: Pencatatan Waste Stok & Pemotongan Inventori resmi](#6-skenario-6-pencatatan-waste-stok--pemotongan-inventori-resmi)
7. [Skenario 7: Asisten AI Business Insight (Google Gemini AI)](#7-skenario-7-asisten-ai-business-insight-google-gemini-ai)
8. **[Tabel Penelusuran Skenario Urutan Sistem (Sequence Scenario Trace Table)](#8-tabel-penelusuran-skenario-urutan-sistem-sequence-scenario-trace-table)**

---

## 1. Skenario 1: Intersepsi Request HTTP & Injeksi Header Multi-Tenant

Diagram ini menunjukkan urutan eksekusi `Next.js Middleware` ketika menangkap request masuk dari browser, memvalidasi slug tenant dari database, dan memasukkan header context.

```mermaid
sequenceDiagram
    autonumber
    actor User as 🌐 User Browser
    participant MW as ⚡ Middleware (resolveTenantMiddleware)
    participant Parser as 🔍 parseTenantFromHostname
    participant DB as 🗄️ Neon DB (schema.tenants)
    participant Page as 📄 Next.js Page Route

    User->>MW: Request GET http://a6-nyuss.localhost:3000/menu
    activate MW
    MW->>Parser: parseTenantFromHostname(hostname, port)
    activate Parser
    Parser-->>MW: Return { slug: 'a6-nyuss', appType: 'customer', isLocalhost: true }
    deactivate Parser

    MW->>DB: SELECT * FROM tenants WHERE slug = 'a6-nyuss' LIMIT 1
    activate DB
    DB-->>MW: Return tenant Object { id: 'uuid-123', isActive: true }
    deactivate DB

    alt Tenant Valid & Active
        MW->>MW: Inject Headers: x-tenant-id='uuid-123', x-tenant-slug='a6-nyuss'
        MW->>Page: Forward Request with Injected Headers
        activate Page
        Page-->>User: Render HTML Response 200 OK
        deactivate Page
    else Tenant Non-Aktif
        MW-->>User: Return HTTP 403 Forbidden (Tenant Inactive)
    else Tenant Tidak Ditemukan
        MW-->>User: Return HTTP 404 Not Found
    end
    deactivate MW
```

---

## 2. Skenario 2: Pendaftaran User & Auto-Provisioning Profile (Better Auth)

Diagram ini mengalirkan proses pendaftaran pengguna baru, eksekusi hook otomatis Better Auth, dan pembuatan profil bisnis tenant.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Pengguna Baru
    participant AuthClient as 📱 Better Auth Client
    participant AuthAPI as 🔒 POST /api/auth/sign-up/email
    participant BetterAuth as ⚙️ Better Auth Engine
    participant Hook as 🔥 Database Hook (user.create.after)
    participant DB as 🗄️ Neon DB (user, profiles, tenants)

    User->>AuthClient: Submit Email & Password
    activate AuthClient
    AuthClient->>AuthAPI: POST Kredensial Pengguna
    activate AuthAPI
    AuthAPI->>BetterAuth: Process Signup Request
    activate BetterAuth
    BetterAuth->>DB: INSERT INTO user & account
    activate DB
    DB-->>BetterAuth: Return Created user Object
    deactivate DB

    BetterAuth->>Hook: Execute databaseHooks.user.create.after(user)
    activate Hook
    Hook->>DB: SELECT * FROM tenants WHERE slug = 'taj-saas'
    activate DB
    DB-->>Hook: Return tenant Object
    deactivate DB

    Hook->>DB: SELECT * FROM profiles WHERE tenantId = tenant.id
    activate DB
    DB-->>Hook: Return existingProfiles Array
    deactivate DB

    alt existingProfiles is Empty
        Hook->>Hook: Determine Role = 'owner'
    else existingProfiles Has Owner
        Hook->>Hook: Determine Role = 'kasir'
    end

    Hook->>DB: INSERT INTO profiles (id, tenantId, email, role)
    Hook->>DB: UPDATE user SET role = role WHERE id = user.id
    Hook-->>BetterAuth: Profile Provisioning Complete
    deactivate Hook

    BetterAuth-->>AuthAPI: Issue Session Token & Set Cookie .localhost
    deactivate BetterAuth
    AuthAPI-->>AuthClient: Return HTTP 200 Success Response
    deactivate AuthAPI
    AuthClient-->>User: Redirect to Authorized Dashboard
    deactivate AuthClient
```

---

## 3. Skenario 3: Transaksi Pesanan Pelanggan & Broadcast Real-time

Diagram urutan paling krusial: Pelanggan melakukan submit checkout pesanan, server memvalidasi harga dari DB, menyimpan pesanan, dan menyiarkan notifikasi ke kasir via Ably PubSub.

```mermaid
sequenceDiagram
    autonumber
    actor Cust as 🛒 Pelanggan (Customer App)
    participant API as 🚀 POST /api/orders
    participant DB as 🗄️ Neon DB (tenants, menuItems, promos, orders)
    participant Ably as 📡 Ably Realtime Cloud
    actor Cashier as 📟 POS Kasir (Admin App)

    Cust->>API: Submit Order Payload (items, customerInfo, paymentMethod)
    activate API
    API->>API: Read Header x-tenant-slug

    API->>DB: SELECT * FROM tenants WHERE slug = tenantSlug
    activate DB
    DB-->>API: Return tenant Object
    deactivate DB

    API->>DB: SELECT * FROM menuItems WHERE slug IN (itemSlugs)
    activate DB
    DB-->>API: Return dbItems Array (Harga Asli DB)
    deactivate DB

    API->>API: Validasi Stok & Hitung Subtotal (Tolak Modifikasi Harga Client)

    opt Ada Promo Code
        API->>DB: SELECT * FROM promos WHERE code = promoCode AND isActive = true
        activate DB
        DB-->>API: Return promo Object
        deactivate DB
        API->>API: Kalkulasi Diskon Promo
    end

    API->>API: Generate Order Code (A6-YYYYMMDD-xxxx)

    API->>DB: INSERT INTO orders (tenantId, orderCode, totalPrice, status='received')
    API->>DB: INSERT INTO orderItems (orderId, menuItemId, quantity, unitPrice)
    activate DB
    DB-->>API: Return Created Order Object
    deactivate DB

    API->>Ably: Ably.Rest.publish('new-order', { order })
    activate Ably
    Ably-->>API: Publish Acknowledged
    deactivate Ably

    API-->>Cust: Return HTTP 201 Created { orderCode, total }
    deactivate API

    Ably->>Cashier: Push Event 'new-order' via WebSocket
    activate Cashier
    Cashier->>Cashier: Play Audio Alert Beep + Show Toast + Refresh Order List UI
    deactivate Cashier
```

---

## 4. Skenario 4: Pengelolaan Status Pesanan oleh Kasir POS

Diagram urutan saat kasir menerima notifikasi, memverifikasi pembayaran QRIS, dan memperbarui status tahapan dapur hingga selesai.

```mermaid
sequenceDiagram
    autonumber
    actor Cashier as 📟 Kasir POS
    participant POSUI as 💻 Admin POS Client UI
    participant Action as ⚡ updateOrderStatusAction
    participant DB as 🗄️ Neon DB (orders, auditLogs, shifts, shiftLogs)

    Cashier->>POSUI: Klik Tombol "Proses Dapur" / "Selesai"
    activate POSUI
    POSUI->>Action: updateOrderStatusAction(orderId, newStatus)
    activate Action

    Action->>Action: getTenantContext() -> { tenantId }

    Action->>DB: SELECT * FROM orders WHERE id = orderId AND tenantId = tenantId
    activate DB
    DB-->>Action: Return order Object
    deactivate DB

    alt Status == 'completed' & paymentMethod == 'cod'
        Action->>Action: Set paymentStatus = 'paid' & shouldAutoPay = true
    end

    Action->>DB: UPDATE orders SET status = newStatus, paymentStatus = paymentStatus
    Action->>DB: INSERT INTO auditLogs (action, entityId, details)

    opt shouldAutoPay == true
        Action->>DB: SELECT * FROM shifts WHERE tenantId = tenantId AND status = 'open'
        activate DB
        DB-->>Action: Return activeShift Object
        deactivate DB
        
        opt Shift Aktif Ditemukan
            Action->>DB: INSERT INTO shiftLogs (shiftId, action='cash_in', amount=totalPrice)
        end
    end

    Action->>POSUI: revalidatePath('/') -> Trigger Re-render
    Action-->>POSUI: Return { success: true }
    deactivate Action
    POSUI-->>Cashier: Update UI Status Order Badge & List
    deactivate POSUI
```

---

## 5. Skenario 5: Operasional Shift Kasir (Buka Shift & Tutup Shift Rekonsiliasi)

Diagram urutan pembukaan modal laci awal dan penghitungan selisih (*drift*) saat kasir menutup shift operasional.

```mermaid
sequenceDiagram
    autonumber
    actor Cashier as 📟 Operator Kasir
    participant POSUI as 💻 Admin Shift Modal UI
    participant OpenAct as ⚡ openShiftAction
    participant CloseAct as ⚡ closeShiftAction
    participant DB as 🗄️ Neon DB (shifts, shiftLogs)

    note over Cashier, DB: ☀️ Fase A: Pembukaan Shift Kasir (Pagi)
    Cashier->>POSUI: Input Modal Uang Awal (misal: Rp 500.000)
    activate POSUI
    POSUI->>OpenAct: openShiftAction(startingCash=500000, operatorName)
    activate OpenAct
    OpenAct->>DB: SELECT * FROM shifts WHERE status = 'open'
    activate DB
    DB-->>OpenAct: Return [] (Belum Ada Shift Aktif)
    deactivate DB

    OpenAct->>DB: INSERT INTO shifts (startingCash=500000, status='open')
    OpenAct->>DB: INSERT INTO shiftLogs (action='open', amount=500000)
    OpenAct-->>POSUI: Return { success: true, shift }
    deactivate OpenAct
    POSUI-->>Cashier: Shift Berhasil Dibuka, POS Siap Digunakan
    deactivate POSUI

    note over Cashier, DB: 🌙 Fase B: Penutupan Shift Kasir (Malam)
    Cashier->>POSUI: Hitung Uang Fisik Laci & Input (misal: Rp 1.850.000)
    activate POSUI
    POSUI->>CloseAct: closeShiftAction(shiftId, actualCash=1850000, expectedCash=1850000)
    activate CloseAct
    CloseAct->>CloseAct: Calculate drift = actualCash - expectedCash (Rp 0)
    CloseAct->>DB: UPDATE shifts SET status='closed', actualCash=1850000, drift=0
    CloseAct->>DB: INSERT INTO shiftLogs (action='close', amount=1850000)
    CloseAct-->>POSUI: Return { success: true }
    deactivate CloseAct
    POSUI-->>Cashier: Cetak Struk Ringkasan Shift & Kasir Ditutup
    deactivate POSUI
```

---

## 6. Skenario 6: Pencatatan Waste Stok & Pemotongan Inventori resmi

Diagram urutan ketika pemilik/manajer mencatat bahan baku rongsok/expired (*waste log*) yang secara otomatis memotong stok gudang.

```mermaid
sequenceDiagram
    autonumber
    actor Owner as 👑 Owner / Manager
    participant UI as 📦 Form Persediaan (/persediaan)
    participant Action as ⚡ createWasteLogAction
    participant DB as 🗄️ Neon DB (inventoryTransactions, inventory)

    Owner->>UI: Input Barang Rusak (misal: Keju Kraft 0.5 kg)
    activate UI
    UI->>Action: createWasteLogAction({ inventoryId, quantity: 0.5, reason: 'Expired' })
    activate Action

    Action->>Action: getTenantId()

    Action->>DB: INSERT INTO inventoryTransactions (type='waste', quantity='0.5', reason='Expired')
    activate DB
    DB-->>Action: Return Created Transaction Object
    deactivate DB

    Action->>DB: SELECT stock FROM inventory WHERE id = inventoryId
    activate DB
    DB-->>Action: Return invItem Object { stock: '5.0' }
    deactivate DB

    Action->>Action: Hitung newStock = 5.0 - 0.5 = 4.5

    Action->>DB: UPDATE inventory SET stock = '4.5' WHERE id = inventoryId
    Action->>UI: revalidatePath('/persediaan')
    Action-->>UI: Return { success: true, data: tx }
    deactivate Action
    UI-->>Owner: Tampilkan Alert "Stok Diperbarui Jadi 4.5 kg"
    deactivate UI
```

---

## 7. Skenario 7: Asisten AI Business Insight (Google Gemini AI)

Diagram urutan pengiriman prompt analitik dari dashboard Owner ke API Route dan eksekusi pada SDK Google Gemini AI.

```mermaid
sequenceDiagram
    autonumber
    actor Owner as 👑 Owner Bisnis
    participant AIUI as 🤖 Modul AI Chat UI (/ai)
    participant Route as 🚀 POST /api/chat
    participant GeminiSDK as 🧠 GoogleGenAI SDK
    participant GeminiAPI as ☁️ Google Gemini AI Engine

    Owner->>AIUI: Input Pertanyaan ("Berikan rekomendasi menu best seller minggu ini")
    activate AIUI
    AIUI->>Route: POST { prompt: "Berikan rekomendasi..." }
    activate Route

    Route->>Route: Format System Instruction & Injeksi Konteks Bisnis

    Route->>GeminiSDK: ai.getGenerativeModel({ model: 'gemini-1.5-flash' })
    activate GeminiSDK
    GeminiSDK->>GeminiAPI: model.generateContent(formattedPrompt)
    activate GeminiAPI
    GeminiAPI-->>GeminiSDK: Return AI Text Insight Response
    deactivate GeminiAPI
    GeminiSDK-->>Route: Return Generated Content
    deactivate GeminiSDK

    Route-->>AIUI: Return JSON { responseText }
    deactivate Route
    AIUI-->>Owner: Tampilkan Analisis Recommendations UI
    deactivate AIUI
```

---

## 8. Tabel Penelusuran Skenario Urutan Sistem (Sequence Scenario Trace Table)

Tabel berikut merangkum aktor awal, pemicu pesan, urutan komponen eksekusi, dan hasil akhir untuk setiap skenario dalam repositori Taj SaaS.

| No | Nama Skenario | Pemicu (Trigger Event) | Komponen Komunikasi Utama | Hasil Akhir (Final State) |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Intersepsi Multi-Tenant** | Request HTTP Browser | `Middleware` $\rightarrow$ `Parser` $\rightarrow$ `Neon DB` $\rightarrow$ `Headers` | Request diteruskan dengan header `x-tenant-id` |
| **2** | **Auto-Provision Profile** | Submit Signup Email | `Better Auth` $\rightarrow$ `Database Hook` $\rightarrow$ `Neon DB` | Account dibuat, profile ter-seed, cookie set |
| **3** | **Checkout & Broadcast** | Click Submit Order | `POST /api/orders` $\rightarrow$ `DB Insert` $\rightarrow$ `Ably` $\rightarrow$ `POS` | Order tersimpan & POS menerima notifikasi suara |
| **4** | **Update Status Order POS** | Click Update Status UI | `Admin Action` $\rightarrow$ `DB Update` $\rightarrow$ `AuditLog` $\rightarrow$ `ShiftLog` | Status order terbarui & log kas masuk tercatat |
| **5** | **Rekonsiliasi Shift POS** | Input Fisik Uang Laci | `closeShiftAction` $\rightarrow$ `Drift Math` $\rightarrow$ `DB Update` | Shift ditutup & selisih laci kasir tercatat |
| **6** | **Waste Stock Log** | Form Input Barang Rusak | `createWasteLogAction` $\rightarrow$ `DB Tx` $\rightarrow$ `Stock Deduction` | Transaksi waste tercatat & stok gudang terpotong |
| **7** | **Gemini AI Insight** | Prompt Query Owner | `AI Chat UI` $\rightarrow$ `POST /api/chat` $\rightarrow$ `Gemini AI Engine` | Insight rekomendasi bisnis ditampilkan di UI |

---

*Dokumentasi Sequence Diagram ini dibuat secara otomatis dan komprehensif untuk platform Taj SaaS.*
