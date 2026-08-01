# 🔄 Dokumentasi Data Flow Diagram (DFD) Complete - Taj SaaS Platform

Dokumen ini berisi **Data Flow Diagram (DFD)** lengkap dan terstruktur untuk sistem **Taj SaaS (Enterprise Multi-Tenant F&B SaaS Platform)**. 

DFD ini menggambarkan aliran data (*data flows*), entitas luar (*external entities*), proses pengolahan data (*processes*), dan tempat penyimpanan data (*data stores*) dari tingkat konteks (Level 0), tingkat utama (Level 1), hingga rincian sub-proses spesifik (Level 2).

---

## 📑 Daftar Isi Data Flow Diagram
1. [Notasi & Simbol Diagram Aliran Data](#1-notasi--simbol-diagram-aliran-data)
2. [DFD Level 0: Diagram Konteks (Context Diagram)](#2-dfd-level-0-diagram-konteks-context-diagram)
3. [DFD Level 1: Decomposisi Sistem Utama (Overview Processes)](#3-dfd-level-1-decomposisi-sistem-utama-overview-processes)
4. [DFD Level 2: Rincian Sub-Proses Pemrosesan Pesanan (Proses 3.0)](#4-dfd-level-2-rincian-sub-proses-pemrosesan-pesanan-proses-30)
5. [DFD Level 2: Rincian Sub-Proses Shift & POS Kasir (Proses 4.0)](#5-dfd-level-2-rincian-sub-proses-shift--pos-kasir-proses-40)
6. [DFD Level 2: Rincian Sub-Proses Inventori & Waste Stok (Proses 5.0)](#6-dfd-level-2-rincian-sub-proses-inventori--waste-stok-proses-50)
7. **[Kamus Data Sistem (System Data Dictionary Table)](#7-kamus-data-sistem-system-data-dictionary-table)**

---

## 1. Notasi & Simbol Diagram Aliran Data

- **Entitas Luar (External Entities / Terminators):** Pengguna atau sistem eksternal yang memberikan masukan data atau menerima keluaran data dari sistem (`Pelanggan`, `Kasir POS`, `Pemilik Bisnis`, `Ably Broker`, `Gemini AI`).
- **Proses (Processes):** Fungsi transformasi data yang mengolah masukan menjadi keluaran.
- **Penyimpanan Data (Data Stores):** Tabel basis data Neon Postgres (`D1: Tenants`, `D2: Users`, `D3: Menus`, `D4: Inventory`, `D5: Orders`, `D6: Shifts`, `D7: Audits`).
- **Aliran Data (Data Flows):** Jalur pergerakan informasi antar elemen.

---

## 2. DFD Level 0: Diagram Konteks (Context Diagram)

Diagram Konteks menggambarkan sistem **Taj SaaS Platform (Proses 0.0)** secara keseluruhan dalam hubungannya dengan seluruh Entitas Luar.

```mermaid
graph TD
    subgraph External_Entities [Entitas Luar / Terminators]
        E1[🛒 Pelanggan / Customer]
        E2[📟 Operator Kasir POS]
        E3[👑 Pemilik Bisnis / Owner]
        E4[📡 Ably PubSub Cloud Broker]
        E5[🧠 Google Gemini AI Engine]
    end

    subgraph Central_System [Proses Utama Sistem]
        P0((0.0<br/>Taj SaaS Platform<br/>Multi-Tenant F&B Engine))
    end

    E1 -->|1. Data Pemesanan, Varian, Topping, & Bukti Bayar| P0
    P0 -->|2. Katalog Menu, Konfirmasi Order, & Status Tracking| E1

    E2 -->|3. Data Buka/Tutup Shift, Modal Laci, & Status Order POS| P0
    P0 -->|4. Antrean Pesanan Realtime, Ringkasan Shift, & Struk| E2

    E3 -->|5. Data Resep BOM, Stok Inventori, Cabang, & Prompt AI| P0
    P0 -->|6. Laporan Penjualan, Keuangan PnL, Audit, & AI Insight| E3

    P0 -->|7. Publish Message Event Pesanan Baru| E4
    E4 -->|8. Push WebSocket Alert Notifikasi Order| P0

    P0 -->|9. Formatted Business Prompt Context| E5
    E5 -->|10. Text Recommendation Response| P0
```

---

## 3. DFD Level 1: Decomposisi Sistem Utama (Overview Processes)

Diagram ini memecah **Proses 0.0** menjadi 6 proses subsystem utama dan hubungannya dengan **Data Stores (D1 - D7)**.

```mermaid
graph TD
    subgraph Entities [Entitas Luar]
        E_CUST[🛒 Pelanggan]
        E_POS[📟 Kasir POS]
        E_OWNER[👑 Owner]
        E_ABLY[📡 Ably Broker]
        E_AI[🧠 Gemini AI]
    end

    subgraph Processes [Proses Utama Sub-Sistem]
        P1((1.0<br/>Tenant Resolution & Auth))
        P2((2.0<br/>Katalog Menu & Resep))
        P3((3.0<br/>Pemrosesan Pesanan))
        P4((4.0<br/>POS & Shift Kasir))
        P5((5.0<br/>Stok & Waste Log))
        P6((6.0<br/>Analitik & Gemini AI))
    end

    subgraph Data_Stores [Penyimpanan Data - Neon DB]
        D1[(D1: Tenants & Profiles)]
        D2[(D2: Menu, Variants, Toppings)]
        D3[(D3: Orders & OrderItems)]
        D4[(D4: Shifts & ShiftLogs)]
        D5[(D5: Inventory & Recipes)]
        D6[(D6: AuditLogs & Approvals)]
        D7[(D7: Promos & Files)]
    end

    E_CUST -->|Credentials| P1
    P1 <-->|Verify Auth & Tenant| D1

    E_OWNER -->|Input Menu & BOM| P2
    P2 -->|Save Menu & Recipes| D2
    P2 -->|Save BOM| D5

    E_CUST -->|Checkout Order| P3
    P3 -->|Validate Prices| D2
    P3 -->|Validate Promo| D7
    P3 -->|Save Order Data| D3
    P3 -->|Publish Event| E_ABLY

    E_ABLY -->|WebSocket Push| P4
    E_POS -->|Update Order & Shift| P4
    P4 <-->|Manage Shift & Orders| D4
    P4 -->|Update Payment & COD| D3

    E_OWNER -->|Input Waste Log| P5
    P5 <-->|Deduct Stock| D5

    E_OWNER -->|Prompt Business Query| P6
    P6 <-->|Fetch Sales Metrics| D3
    P6 <-->|Fetch PnL Data| D4
    P6 <-->|Query Gemini API| E_AI
```

---

## 4. DFD Level 2: Rincian Sub-Proses Pemrosesan Pesanan (Proses 3.0)

Diagram ini mendetailkan aliran data internal saat pelanggan melakukan *checkout* pesanan.

```mermaid
graph TD
    E_CUST[🛒 Pelanggan] -->|Data Payload Pesanan| P3_1((3.1<br/>Validasi Input & Tenant))
    
    P3_1 -->|Query Slug| D1[(D1: Tenants)]
    D1 -->|Tenant Info| P3_1
    
    P3_1 -->|Valid Items Payload| P3_2((3.2<br/>Validasi Harga Menu & Promo))
    P3_2 <-->|Fetch Item Prices| D2[(D2: Menu Items)]
    P3_2 <-->|Validate Promo Code| D7[(D7: Promos)]
    
    P3_2 -->|Validated Total Price| P3_3((3.3<br/>Generate Kode & Simpan DB))
    P3_3 -->|Insert Order & Items| D3[(D3: Orders & OrderItems)]
    
    P3_3 -->|Order Created Event| P3_4((3.4<br/>Broadcast Event Ably))
    P3_4 -->|Publish 'new-order'| E_ABLY[📡 Ably Cloud Broker]
    
    P3_3 -->|Order Code & Confirmation| E_CUST
```

---

## 5. DFD Level 2: Rincian Sub-Proses Shift & POS Kasir (Proses 4.0)

Diagram ini mendetailkan aliran data saat kasir membuka shift, mengelola status pesanan, dan menutup shift.

```mermaid
graph TD
    E_POS[📟 Operator Kasir] -->|Input Modal Awal| P4_1((4.1<br/>Pembukaan Shift Kasir))
    P4_1 -->|Insert Active Shift| D4[(D4: Shifts & ShiftLogs)]
    
    E_ABLY[📡 Ably Broker] -->|WebSocket Event| P4_2((4.2<br/>Queue Notifikasi Pesanan))
    D3[(D3: Orders)] <-->|Fetch Active Orders| P4_2
    P4_2 -->|Render Realtime List| E_POS
    
    E_POS -->|Klik Status Order| P4_3((4.3<br/>Update Status & Log Kas))
    P4_3 -->|Update Order Status| D3
    P4_3 -->|Write Audit Log| D6[(D6: Audit Logs)]
    
    opt Order COD Completed
        P4_3 -->|Write Cash-In Log| D4
    end
    
    E_POS -->|Input Uang Fisik Laci| P4_4((4.4<br/>Tutup Shift & Rekonsiliasi))
    P4_4 <-->|Fetch Shift Cash Logs| D4
    P4_4 -->|Kalkulasi Drift & Close Shift| D4
    P4_4 -->|Struk Ringkasan Shift| E_POS
```

---

## 6. DFD Level 2: Rincian Sub-Proses Inventori & Waste Stok (Proses 5.0)

Diagram ini mendetailkan aliran data saat laporan barang rusak/expired (*waste*) dibuat.

```mermaid
graph TD
    E_OWNER[👑 Owner / Manager] -->|Data Barang Rusak/Expired| P5_1((5.1<br/>Pencatatan Waste Log))
    P5_1 -->|Insert Transaction 'waste'| D5_1[(D5: Inventory Transactions)]
    
    P5_1 -->|Trigger Reduction| P5_2((5.2<br/>Pemotongan Stok Bahan Baku))
    P5_2 <-->|Fetch Current Stock| D5_2[(D5: Inventory)]
    P5_2 -->|Update New Stock| D5_2
    
    P5_2 -->|Stok Refreshed Alert| E_OWNER
```

---

## 7. Kamus Data Sistem (System Data Dictionary Table)

Tabel berikut mendokumentasikan rincian paket aliran data (*data flow packages*), elemen data, asal data (*source*), dan tujuan data (*destination*).

| Nama Aliran Data (Data Flow) | Asal Data (Source) | Tujuan Data (Destination) | Struktur Elemen Data Utama |
| :--- | :--- | :--- | :--- |
| **Data Pemesanan Pelanggan** | Pelanggan (`Customer App`) | Proses `3.1 Validasi Input` | `items[]`, `customerName`, `customerPhone`, `orderType`, `deliveryAddress`, `promoCode`, `paymentMethod` |
| **Katalog Menu Response** | Proses `2.0 Katalog Menu` | Pelanggan (`Customer App`) | `categories[]`, `menuItems[]`, `variants[]`, `toppings[]`, `branding` |
| **Order Insert Record** | Proses `3.3 Simpan DB` | Data Store `D3 Orders` | `id`, `tenantId`, `orderCode`, `totalPrice`, `status='received'`, `paymentStatus='pending'` |
| **Realtime Broadcast Event** | Proses `3.4 Broadcast` | Ably Broker (`E4`) | `channel='orders:slug'`, `event='new-order'`, `orderPayload` |
| **Input Buka Shift** | Kasir POS (`E2`) | Proses `4.1 Buka Shift` | `startingCash`, `operatorName`, `openedAt` |
| **Input Tutup Shift** | Kasir POS (`E2`) | Proses `4.4 Tutup Shift` | `shiftId`, `actualCash`, `expectedCash`, `drift` |
| **Input Waste Log** | Owner (`E3`) | Proses `5.1 Waste Log` | `inventoryId`, `branchId`, `quantity`, `cost`, `reason`, `operatorName` |
| **Prompt Query AI** | Owner (`E3`) | Proses `6.0 Gemini AI` | `prompt`, `tenantSlug`, `formattedContext` |

---

*Dokumentasi Data Flow Diagram (DFD) ini dibuat secara otomatis dan komprehensif untuk Taj SaaS Platform.*
