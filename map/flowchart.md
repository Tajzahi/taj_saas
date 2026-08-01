# 🗺️ Dokumentasi Flowchart Complete - Taj SaaS Platform

Dokumen ini berisi diagram alur (flowchart) lengkap dan terstruktur untuk sistem **Taj SaaS (Enterprise Multi-Tenant F&B SaaS Platform)**. Seluruh diagram dibuat menggunakan standar **Mermaid** untuk mempermudah visualisasi arsitektur, navigasi routing, otentikasi, transaksi pelanggan, notifikasi real-time, operasional kasir (POS), dan modul eksekutif (Owner Cockpit).

---

## 📑 Daftar Isi Flowchart
1. [Arsitektur Global & Routing Multi-Tenant](#1-arsitektur-global--routing-multi-tenant)
2. [Alur Otentikasi & Autorisasi Pengguna (Better Auth & RBAC)](#2-alur-otentikasi--autorisasi-pengguna-better-auth--rbac)
3. [Alur Pelanggan: Dari Menu Hingga Pembayaran (Customer App Journey)](#3-alur-pelanggan-dari-menu-hingga-pembayaran-customer-app-journey)
4. [Alur Notifikasi Real-time Pesanan (Ably Pub/Sub)](#4-alur-notifikasi-real-time-pesanan-ably-pubsub)
5. [Alur Operasional POS Kasir & Shift (Admin App)](#5-alur-operasional-pos-kasir--shift-admin-app)
6. [Alur Executive Cockpit & Manajemen Bisnis (Owner App)](#6-alur-executive-cockpit--manajemen-bisnis-owner-app)
7. [Alur Manajemen Inventori, Resep BOM, & Produksi](#7-alur-manajemen-inventori-resep-bom--produksi)
8. [Diagram Relasi Data & Entitas Utama (Database Flow ERD)](#8-diagram-relasi-data--entitas-utama-database-flow-erd)
9. [Grafik Dependensi Monorepo & Package Dependencies](#9-grafik-dependensi-monorepo--package-dependencies)

---

## 1. Arsitektur Global & Routing Multi-Tenant

Diagram ini menjelaskan bagaimana `Next.js Middleware` menangkap request HTTP, melakukan ekstraksi tenant slug dari hostname/port, dan meneruskannya ke aplikasi yang sesuai dengan menyertakan header `x-tenant-id` & `x-tenant-slug`.

```mermaid
flowchart TD
    A[🌐 Request Masuk dari User / Browser] --> B{Parse Hostname & Port via Middleware}
    
    B -->|Port 3000 / Main Domain| C[🛒 Customer App]
    B -->|Port 3001 / admin.domain| D[📟 Admin POS App]
    B -->|Port 3002 / owner.domain| E[👑 Owner Cockpit App]
    
    C --> F[Ekstraksi Tenant Slug dari Subdomain / Param]
    D --> F
    E --> F
    
    F --> G{Query Database Neon Postgres}
    G -->|Tenant Found & Active| H[Injeksi Headers: x-tenant-id & x-tenant-slug]
    G -->|Tenant Not Found| I[❌ Return HTTP 404: Tenant Not Found]
    G -->|Tenant Inactive| J[⛔ Return HTTP 403: Tenant Inactive]
    
    H --> K[Session Cookie Subdomain check .localhost]
    K --> L[Render Halaman / API Endpoint]
```

---

## 2. Alur Otentikasi & Autorisasi Pengguna (Better Auth & RBAC)

Diagram ini menggambarkan alur Pendaftaran/Login pengguna, eksekusi **Database Hook** untuk membuat profil tenant secara otomatis, dan pemeriksaan Role-Based Access Control (RBAC).

```mermaid
flowchart TD
    A[🔑 User Akses Halaman Login / Register] --> B{Sudah Memiliki Akun?}
    
    B -->|Belum| C[Form Pendaftaran: Email & Password]
    C --> D[Submit Form Ke Better Auth Engine]
    D --> E[Membuat Row di Tabel user & account]
    E --> F[🔥 Trigger Database Hook: after user create]
    F --> G[Cari Tenant Aktif via NEXT_PUBLIC_TENANT_SLUG]
    G --> H{Apakah ada Profile di Tenant ini?}
    H -->|Belum Ada User Lain| I[Set Role: 'owner']
    H -->|Sudah Ada Owner| J[Set Role Default: 'kasir']
    I --> K[Buat Row di Tabel profiles & Link tenant_id]
    J --> K
    K --> L[Update Role pada Tabel user]
    L --> M[Session Terbentuk & Set Cookie .localhost]
    
    B -->|Sudah| N[Form Login: Email & Password]
    N --> O[Verifikasi Kredensial via Better Auth]
    O -->|Gagal| P[❌ Tampilkan Pesan Error Invalid Credentials]
    O -->|Sukses| M
    
    M --> Q{Cek Role Pengguna}
    Q -->|Owner / Manager| R[Buka Akses Owner App :3002]
    Q -->|Kasir| S[Buka Akses Admin POS App :3001]
    Q -->|Role Tidak Cocok| T[🚫 Redirect Ke /unauthorized]
```

---

## 3. Alur Pelanggan: Dari Menu Hingga Pembayaran (Customer App Journey)

Diagram ini mengalirkan seluruh perjalanan pelanggan dari melihat katalog menu, memilih varian & topping, memasukkan ke keranjang, checkout dengan promo, hingga mengunggah bukti bayar QRIS.

```mermaid
flowchart TD
    A[📱 Pelanggan Akses Web Customer :3000] --> B[Halaman Utama / Landing Page]
    B --> C[Lihat Katalog Menu /menu]
    C --> D[Pilih Kategori Produk]
    D --> E[Pilih Produk / Item Menu]
    
    E --> F{Ada Varian atau Topping?}
    F -->|Ya| G[Pilih Varian Modifikasi Harga & Topping Ekstra]
    F -->|Tidak| H[Harga Dasar Produk]
    G --> I[Tambahkan ke Keranjang /cart]
    H --> I
    
    I --> J[Tinjau Keranjang Belanja]
    J --> K{Lanjut ke Checkout?}
    K -->|Tidak| C
    K -->|Ya| L[Halaman Checkout /checkout]
    
    L --> M[Isi Data Pemesan: Nama & WhatsApp]
    M --> N{Pilih Metode Pengambilan}
    N -->|Delivery| O[Terapkan Tarif Ongkir Flat Tenant]
    N -->|Pickup| P[Bebas Ongkir / Rp 0]
    
    O --> Q[Input Kode Promo Voucher jika ada]
    P --> Q
    Q --> R[Hitung Subtotal + Ongkir - Diskon]
    
    R --> S{Pilih Metode Pembayaran}
    S -->|Cash on Delivery COD| T[Set Status Payment: 'pending']
    S -->|QRIS Transaksi Digital| U[Tampilkan Kode QRIS & Upload Bukti Transfer]
    U --> V[Simpan File Gambar Ke Tabel files]
    V --> W[Set Status Payment: 'pending']
    
    T --> X[Simpan Order ke Tabel orders & order_items]
    W --> X
    X --> Y[⚡ Trigger Event Real-time Notifikasi Ably]
    Y --> Z[Pengalihan ke Halaman Pelacakan Pesanan /tracking]
```

---

## 4. Alur Notifikasi Real-time Pesanan (Ably Pub/Sub)

Diagram ini menjelaskan komunikasi asinkron berkecepatan tinggi antara aplikasi Pelanggan dan Kasir POS menggunakan **Ably Channel**.

```mermaid
flowchart LR
    subgraph Pelanggan [Customer App - Port 3000]
        A1[Pelanggan Submit Order] --> A2[Server Action / API Route]
        A2 --> A3[Publish Event: 'order:created']
    end

    subgraph Ably PubSub Engine [Tenant Isolated Channels]
        A3 --> B1[Channel: tenant_slug:orders]
    end

    subgraph Kasir POS [Admin App - Port 3001]
        B1 --> C1[Ably Subscriber Client]
        C1 --> C2[Audio Alert Sound + Pop-up Toast Pesanan Baru]
        C2 --> C3[Perbarui UI Antrean Pesanan Tanpa Refresh Page]
    end
```

---

## 5. Alur Operasional POS Kasir & Shift (Admin App)

Diagram ini mencakup alur lengkap kerja kasir harian: Pembukaan Shift (Modal Awal), Pengelolaan Antrean Pesanan Masuk, Pencatatan Arus Kas, dan Penutupan Shift (Rekonsiliasi Cash Drift).

```mermaid
flowchart TD
    A[📟 Kasir Login ke Admin POS App :3001] --> B{Cek Status Shift Kasir}
    
    B -->|Belum Buka Shift| C[Popup Buka Shift: Input Modal Uang Tunai Awal startingCash]
    C --> D[Simpan Row Baru di Tabel shifts: status 'open']
    D --> E[Masuk ke Dashboard POS Kasir]
    
    B -->|Shift Sudah Buka| E
    
    E --> F[Menerima Pesanan Masuk Real-time via Ably]
    F --> G[Daftar Antrean Pesanan / Orders List]
    
    G --> H{Tindakan Kasir pada Pesanan}
    
    H -->|Verifikasi Pembayaran QRIS| I[Cek Gambar Bukti Bayar -> Set paymentStatus 'paid']
    H -->|Proses Dapur| J[Ubah status Order: 'processing']
    H -->|Pesanan Selesai Di racik| K[Ubah status Order: 'ready']
    H -->|Serahkan ke Pelanggan| L[Ubah status Order: 'completed']
    H -->|Batalkan Pesanan| M[Ubah status Order: 'cancelled']
    
    E --> N[Catat Arus Uang Keluar/Masuk Kasir]
    N --> O[Simpan Log Arus Kas di Tabel shift_logs cash_in / cash_out]
    
    E --> P[Proses Tutup Shift Kasir]
    P --> Q[Hitung Uang Tunai Fisik di Laci actualCash]
    Q --> R[Sistem Hitung Expected Cash: Modal Awal + Total Cash Sales + Cash In - Cash Out]
    R --> S[Kalkulasi Selisih Drift: actualCash - expectedCash]
    S --> T[Update Tabel shifts: status 'closed', set drift & endShiftAt]
    T --> U[Cetak Laporan Ringkasan Shift Kasir]
```

---

## 6. Alur Executive Cockpit & Manajemen Bisnis (Owner App)

Diagram ini menjelaskan kontrol manajemen tingkat tinggi oleh Pemilik Bisnis (Owner) untuk memantau performa 11 modul utama.

```mermaid
flowchart TD
    A[👑 Owner Login ke App :3002] --> B{Cek Role: 'owner' atau 'manager'}
    B -->|Kasir / Unauthorized| C[🚫 Redirect Ke /unauthorized]
    B -->|Valid| D[Masuk Dashboard Executive Cockpit]
    
    D --> E{Pilih Modul Navigasi NavMenu}
    
    E -->|Ikhtisar Utama| F[📊 Dashboard Overview: Ringkasan Penjualan & Chart Recharts]
    E -->|Analisis Penjualan| G[📈 Modul Penjualan: Laporan Per Kategori, Jam Sibuk, & Cabang]
    E -->|Stok & Resep| H[📦 Modul Persediaan: Inventori Bahan Baku, Supplier, & Resep BOM]
    E -->|Manajemen Produksi| I[🍳 Modul Produksi: Batch Production & Pengurangan Stok Otomatis]
    E -->|Laporan Keuangan| J[💰 Modul Keuangan: PnL / Rugi Laba, Cashflow, & Profit Margin]
    E -->|Persetujuan Pengeluaran| K[✅ Modul Persetujuan: Approval Request Refund & Expense Kasir]
    E -->|Manajemen SDM| L[👥 Modul SDM: Daftar Pengguna, Peran Staff, & Performa Kasir]
    E -->|Manajemen Cabang| M[🏢 Modul Cabang: Tambah/Edit Cabang Fisik & PIC Outlet]
    E -->|Pengaturan Toko| N[⚙️ Modul Pengaturan: Branding Tenant, Jam Buka, & Fee Delivery]
    E -->|Asisten AI Gemini| O[🤖 Modul AI: Analisis Insight Penjualan berbasis Google Gemini]
```

---

## 7. Alur Manajemen Inventori, Resep BOM, & Produksi

Diagram ini mendetailkan keterkaitan antara Resep Produk (**Bill of Materials**), pengurangan stok bahan baku saat pesanan dibuat, dan pemotongan stok otomatis saat produksi.

```mermaid
flowchart TD
    A[🍳 Pembuatan / Update Menu Produk] --> B[Buat Kartu Resep di Tabel recipes]
    B --> C[Tentukan Detail Bahan Baku & Takaran di recipe_ingredients]
    C --> D[Hubungkan dengan Tabel inventory]
    
    E[🛒 Pelanggan Beli Menu Produk X] --> F[Status Order Menjadi 'completed']
    F --> G[Sistem Tracing Resep BOM Menu Produk X]
    G --> H[Loop Setiap Bahan Baku di recipe_ingredients]
    H --> I[Kurangi Kolom stock pada Tabel inventory]
    I --> J[Catat Riwayat Keluar di inventory_transactions]
    
    K[⚠️ Stok Bahan Baku Memenuhi MinStock?] -->|Ya| L[Stok Aman]
    K -->|Tidak| M[🚨 Tampilkan Peringatan Stok Tipis di Dashboard Owner]
```

---

## 8. Diagram Relasi Data & Entitas Utama (Database Flow ERD)

Diagram ini memperlihatkan struktur ERD 23 tabel utama pada Neon Postgres yang terikat oleh arsitektur **Multi-Tenant Data Isolation**.

```mermaid
erDiagram
    tenants ||--o{ profiles : "memiliki"
    tenants ||--o{ branches : "memiliki"
    tenants ||--o{ categories : "memiliki"
    tenants ||--o{ orders : "memproses"
    tenants ||--o{ inventory : "menyimpan"

    user ||--o{ profiles : "terhubung"
    user ||--o{ session : "login"
    user ||--o{ account : "kredensial"

    categories ||--o{ menu_items : "mengkategorikan"
    menu_items ||--o{ menu_variants : "memiliki varian"
    menu_items ||--o{ recipes : "memiliki resep"

    recipes ||--o{ recipe_ingredients : "rincian bahan"
    inventory ||--o{ inventory_transactions : "mencatat log"

    orders ||--o{ order_items : "rincian produk"
    branches ||--o{ shifts : "operasional kasir"
    shifts ||--o{ shift_logs : "catatan arus kas"
```

---

## 9. Grafik Dependensi Monorepo & Package Dependencies

Diagram ini memperlihatkan struktur monorepo Turborepo + pnpm workspaces dan bagaimana paket-paket saling berbagi logic.

```mermaid
graph TD
    subgraph Monorepo Root [taj_saas Monorepo Workspace]
        subgraph Applications [apps/]
            APP_CUSTOMER[🛒 customer app - Port 3000]
            APP_ADMIN[📟 admin app - Port 3001]
            APP_OWNER[👑 owner app - Port 3002]
        end
        
        subgraph Packages [packages/]
            PKG_DB[🗄️ @taj-saas/db - Drizzle & Neon Postgres]
            PKG_SHARED[🔄 @taj-saas/shared - Tenant Context & Utilities]
            PKG_UI[🎨 @taj-saas/ui - Shared UI Components]
        end
    end

    APP_CUSTOMER --> PKG_DB
    APP_CUSTOMER --> PKG_SHARED
    APP_CUSTOMER --> PKG_UI

    APP_ADMIN --> PKG_DB
    APP_ADMIN --> PKG_SHARED
    APP_ADMIN --> PKG_UI

    APP_OWNER --> PKG_DB
    APP_OWNER --> PKG_SHARED
    APP_OWNER --> PKG_UI

    PKG_SHARED --> PKG_DB
```

---

*Dokumentasi flowchart ini dibuat secara otomatis dan komprehensif untuk proyek Taj SaaS Platform.*
