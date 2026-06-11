# Full Project Blueprint: Multi-Tenant Enterprise F&B SaaS (Built from Scratch)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Tujuan Dokumen:**  
Dokumen ini adalah **panduan lengkap dan final** untuk membangun proyek dari nol dengan pendekatan multi-tenant sejak hari pertama.  
A6 Nyuss hanya digunakan sebagai **kaca pembanding / referensi data**, bukan sebagai pilot tenant utama.  
Semua sistem dirancang agar bisa langsung digunakan untuk distribusi ke UMKM lain.

**Komitmen Waktu:** 20 jam/hari efektif (full day kecuali 4 jam istirahat/tidur).

---

## 1. Project Approach & Philosophy

### Keputusan Utama (Sesuai Permintaanmu)
- **Multi-tenant dari hari pertama** (bukan single tenant dulu).
- A6 Nyuss hanya sebagai **referensi** untuk desain UI, data contoh, dan testing.
- Bangun 3 aplikasi terpisah dalam satu monorepo:
  1. **Customer App** (untuk pelanggan)
  2. **Admin/Karyawan App** (gabungan Kasir + Dapur)
  3. **Owner Dashboard** (untuk pemilik bisnis)
- Tujuan: Sekali dibangun, bisa langsung didistribusikan ke banyak UMKM.

### Prinsip Desain
- Enterprise professional (fitur lengkap, approval, audit, forecasting, dll).
- Gaptek-friendly & Mobile-first.
- Self-service onboarding dengan preview.
- Harga berdasarkan jumlah cabang (Startup = 1 cabang full fitur, Professional = max 3 cabang, Enterprise = unlimited).

---

## 2. Tech Stack Final (Dari Awal)

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 16 (App Router) + TypeScript + React 19
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Database**: Neon Postgres atau PlanetScale + Drizzle ORM
- **Auth**: Better Auth (atau Clerk)
- **Realtime**: Ably (bisa mulai pakai Supabase Realtime dulu dengan abstraction)
- **Hosting**:
  - Frontend: Vercel
  - Backend/Jobs: Railway atau Render
- **Domain Automation**: Cloudflare Registrar + API
- **Storage**: Cloudflare R2
- **Payments**: Xendit / Midtrans
- **AI**: Google Gemini
- **Monitoring**: Sentry + PostHog

**Alasan Stack Ini**:
- Mudah dimigrasi nanti (hanya ganti infra, bukan logic bisnis).
- Cocok untuk solo dev + AI coding partner.
- Cost predictable di awal.

---

## 3. High-Level Architecture

- **1 Database** (Postgres) dengan kolom `tenant_id` di hampir semua tabel.
- Setiap UMKM = 1 **Tenant**.
- 3 aplikasi (Customer, Admin, Owner) mengakses data yang sama dengan filtering `tenant_id`.
- Domain routing:
  - `namabisnis.com` → Customer App
  - `admin.namabisnis.com` → Admin App
  - `owner.namabisnis.com` → Owner Dashboard
- Self-service: User bayar → isi form → Preview → Sistem otomatis buat tenant + domain + seed data.

---

## 4. Detailed App Specifications (UI/UX + Fitur per Halaman)

### 4.1 Customer App (untuk Pelanggan)

**Tujuan**: Pelanggan bisa dengan mudah melihat menu, memilih varian, order, dan tracking. Mobile-first.

#### Halaman & Detail Fitur

**1. Home / Landing (`/`)**
- Hero section dengan branding tenant (logo, warna, nama bisnis).
- Menu terlaris (3-6 kartu).
- Keunggulan bisnis (4 poin: Halal, Fresh, Cepat, Tanpa Ojol).
- Cara Order (3 langkah visual).
- Testimonial (bisa statis atau dinamis).
- Lokasi + Jam Operasional + Peta (Leaflet).
- Floating Action Buttons: Chat WA + Keranjang.

**2. Menu (`/menu`)**
- Tab / Filter kategori (Martabak Telur Ayam, Martabak Telur Bebek, Terang Bulan, Paket Bundling, Minuman).
- Search bar + Sort (Terlaris, Harga Rendah-Tinggi, Rekomendasi).
- Grid kartu menu:
  - Foto
  - Nama + Harga
  - Badge (🔥 Terlaris, ✨ Baru, Habis)
  - Klik kartu membuka modal atau halaman detail.

**3. Menu Detail (`/menu/[slug]`)**
- Foto besar.
- Deskripsi lengkap.
- Pilihan Varian:
  - Untuk Martabak: Jumlah Telur (1-7), Isian (Ayam / Sapi).
  - Untuk Terang Bulan: Pilihan Topping utama + Extra Topping (checkbox).
- Quantity selector.
- Catatan khusus (textarea).
- Harga real-time.
- Tombol "Tambah ke Keranjang" (dengan validasi).

**4. Cart (`/cart`)**
- Daftar item dengan varian/topping.
- Edit quantity, hapus, atau ubah varian.
- Ringkasan: Subtotal, Ongkir (berdasarkan zona), Diskon/Promo.
- Input kode promo + validasi.
- Estimasi waktu pengiriman/pickup.
- Tombol "Lanjut ke Checkout".

**5. Checkout (`/checkout`)**
- Form data pelanggan: Nama, Nomor HP.
- Pilihan Tipe Order: Pickup / Delivery.
- Jika Delivery:
  - Input alamat.
  - Peta interaktif (Leaflet + Nominatim) untuk pilih lokasi.
  - Hitung ongkir otomatis berdasarkan zona.
- Metode Pembayaran: COD / QRIS / Transfer Bank.
- Upload bukti pembayaran (jika QRIS/Transfer).
- Ringkasan pesanan + Total.
- Tombol "Buat Pesanan" (validasi server-side harga).

**6. Order Tracking (`/tracking` atau `/tracking/[code]`)**
- Input kode order (jika tidak dari session).
- Timeline status real-time:
  - Received → Processing (sedang dibuat) → Ready → Completed / Cancelled.
- Detail pesanan.
- Estimasi waktu.
- Tombol "Chat via WhatsApp" (dengan template pesan).

**7. Halaman Pendukung**
- About, Contact, FAQ, Gallery, Promo, Catering, Privacy, Terms.

**Koneksi ke App Lain**:
- Order dibuat → Langsung muncul di Admin via Realtime.
- Status diupdate Admin → Update otomatis di halaman Tracking.

---

### 4.2 Admin / Karyawan App (Kasir + Dapur Gabungan)

**Tujuan**: Satu aplikasi untuk 1-2 orang per outlet. Kasir handle order & pembayaran. Dapur handle produksi.

#### Halaman & Detail Fitur

**1. Login + Buka Shift**
- Form login (email/password tenant-aware).
- Input "Uang Modal Awal Laci".
- Tombol "Buka Shift" (otomatis buat record shift).

**2. Dashboard Utama (Real-time)**
- Header: Nama operator, Status Toko (Buka/Tutup), Jam real-time, Koneksi.
- **Panel Kiri**: Order Queue
  - Daftar order dengan status.
  - Filter: Semua / Received / Processing / Ready.
  - Alarm suara + notifikasi saat order baru masuk.
  - Kartu ringkas: Kode order, Nama pelanggan, Total, Tipe (Pickup/Delivery).
- **Panel Kanan**: Order Detail (saat dipilih)
  - Daftar item lengkap + varian + topping + catatan.
  - Bukti pembayaran (jika ada).
  - Tombol aksi:
    - Ubah status (Received → Processing → Ready → Completed)
    - Konfirmasi Pembayaran (untuk QRIS/Transfer)
    - Batalkan dengan alasan
    - Cetak Struk
- Quick actions: Buka/Tutup Toko.

**3. Dapur / Production**
- Daftar menu yang harus diproduksi hari ini (berdasarkan order).
- Checklist per item/batch.
- Input bahan yang digunakan.
- Tombol "Selesai Produksi".
- Catat Waste / Spoilage (pilih alasan: Over production, Expired, dll).

**4. Shift & Kas Management**
- Rekap Harian (otomatis):
  - Total Omset
  - Breakdown COD vs Non-Cash
  - Kas Diharapkan (Modal Awal + Omset COD)
  - Input Kas Aktual
  - Hitung Drift (Selisih)
- Tombol: Tutup Shift + Export CSV + Print Thermal Z-Report.
- Kirim laporan otomatis ke WA Owner.

**5. Menu Management**
- Daftar menu dengan toggle "Tersedia / Habis".
- Toggle topping (khusus Terang Bulan).
- Lihat HPP dasar (jika diizinkan).

**6. Riwayat & Laporan**
- Riwayat order per shift/hari.
- Riwayat shift.
- Log aksi (audit sederhana).

**Koneksi**:
- Realtime dari Customer.
- Update status → Update di Customer Tracking.
- Data shift & rekap → Muncul di Owner Dashboard.

---

### 4.3 Owner Dashboard (Executive Level)

**Tujuan**: High-level visibility, pengambilan keputusan, kontrol, dan perencanaan. Bukan untuk operasional harian.

#### Halaman & Detail Fitur

**1. Executive Cockpit (Halaman Utama)**
- KPI Cards (real-time):
  - Revenue Hari Ini / MTD / YTD + Growth %
  - Gross Profit & Margin %
  - Food Cost %
  - Labor Cost %
  - Waste %
  - Jumlah Order + Average Order Value
  - Active Cabang + Karyawan
- Charts:
  - Revenue Trend (7/30/90 hari, bisa per cabang)
  - Top 10 Menu by Revenue & Margin
  - Revenue by Cabang (bar)
  - Hourly Sales Heatmap
- AI Insights (otomatis generate 3-5 insight).
- Critical Alerts (stok rendah, revenue drop, drift kas tinggi, dll).
- Quick Actions.

**2. Cabang (Branches)**
- Tabel daftar cabang + KPI utama.
- Tambah Cabang baru (wizard).
- Performance Comparison (revenue per m², food cost, dll).
- Inter-branch Stock Transfer (request & approval).

**3. Menu & Recipe**
- Master Menu list dengan HPP.
- Recipe / BOM Editor (drag & drop bahan baku + qty).
- Varian & Modifier management.
- Menu Engineering Matrix (visual: Star, Plowhorse, Puzzle, Dog).
- Deploy menu ke cabang tertentu + price override.
- Price history & approval jika perubahan besar.

**4. Inventory & Procurement**
- Stock Overview (per cabang + total).
- Low Stock & Expiring Alerts.
- Waste Log + Analytics.
- Supplier Management.
- Purchase Order + Goods Receipt + 3-way matching.
- Stock Count (mobile friendly).

**5. Finance**
- Consolidated P&L (per cabang & total).
- Cash Flow Forecast.
- Shift Reconciliation Summary.
- Tax Reports (PPN, e-Faktur Coretax ready).
- Budget vs Actual.

**6. Production & Operations**
- Daily Production Plan (AI recommended).
- Yield & Variance Report.
- Kitchen Capacity Overview.

**7. Sales & Analytics**
- Sales breakdown (channel, waktu, menu, cabang).
- Promotion Performance.
- Customer Insights (repeat rate, LTV, top customers).
- Cohort Analysis.

**8. HR & Workforce**
- Headcount & Labor Cost %.
- Shift Schedule Overview (semua cabang).
- Performance Leaderboard.
- Recruitment Pipeline.

**9. Approvals**
- Daftar pending approval (PO besar, discount tinggi, refund, transfer antar cabang).
- Detail + Approve / Reject + Catatan.
- History approval.

**10. AI Insights & Forecasting**
- Demand Forecasting per cabang.
- What-if Simulator.
- Anomaly Detection.
- Natural Language Query.
- Full AI Chat.

**11. Settings**
- Branding & Template per tenant.
- User Management (Owner, Manager, Kasir) + Permission.
- Tax & Payment Configuration.
- Integrations (WhatsApp, Delivery Platform, Accounting).
- Subscription & Billing (untuk SaaS).
- Full Audit Logs.

**Koneksi**:
- Semua data dari Admin + Customer.
- Realtime update.
- Approval → Effect langsung ke Admin.

---

## 5. Project Folder Structure (Monorepo)

```
fnb-saas/
├── apps/
│   ├── customer/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
│   ├── admin/
│   │   ├── app/
│   │   ├── components/
│   │   └── ...
│   └── owner/
│       ├── app/
│       ├── components/
│       └── ...
├── packages/
│   ├── db/                    # Drizzle schema, migrations, seed
│   ├── ui/                    # Shared shadcn components
│   ├── shared/                # Types, utils, constants, API contracts
│   └── config/                # Shared config
├── scripts/                   # seed, migration helper, domain automation
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 6. Struktur Lain yang Diperlukan

- **Database**: Semua tabel wajib punya `tenant_id`.
- **Environment Variables**: `TENANT_ID` (untuk development), Vercel/Cloudflare token, dll.
- **Middleware**: Tenant resolver berdasarkan hostname.
- **Preview Mode**: Untuk onboarding (bisa pakai subdomain preview atau static mock).

---

## 7. Rekomendasi Memulai Coding (Dengan Komitmen 20 Jam/Hari)

**Minggu 1-2**: Foundation
- Monorepo + 3 Next.js app kosong
- Drizzle + Neon/PlanetScale setup
- Tabel `tenants` + auth dasar
- Tenant resolver (middleware)

**Minggu 3-5**: Customer App + Admin Dasar
- Bangun halaman Customer lengkap
- Bangun Admin (Order Queue + Dapur Checklist)
- Realtime connection

**Minggu 6-8**: Owner Dashboard + Core Enterprise
- Executive Cockpit
- Menu + Recipe/BOM
- Inventory dasar
- Shift & Finance dasar

**Minggu 9-10**: Multi-cabang, AI, & Self-Service
- Cabang management
- AI Insights
- Onboarding + Domain automation (awal)

**Minggu 11+**: Polish + Beta

---

**File ini adalah panduan utama untuk mulai dari nol.**

Apakah kamu ingin saya pecah lagi menjadi file-file terpisah yang lebih actionable (contoh: `drizzle-schema.ts`, `folder-structure.md`, `step-by-step-setup.md`)? Atau langsung mulai dengan salah satu bagian (misalnya schema database lengkap)?

Silakan beri tahu langkah selanjutnya. Saya siap membantu sampai kamu benar-benar mulai coding.