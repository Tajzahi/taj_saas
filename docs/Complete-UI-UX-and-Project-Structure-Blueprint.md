# Complete UI/UX & Project Structure Blueprint
## Multi-Tenant Enterprise F&B SaaS (Built from Scratch)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Tujuan:**  
Dokumen ini adalah **panduan utama dan paling detail** untuk memulai proyek dari nol.  
A6 Nyuss hanya digunakan sebagai **kaca pembanding** (referensi desain, data contoh, dan validasi fitur).  
Semua sistem dibangun sebagai **Multi-Tenant SaaS** dari hari pertama agar langsung siap didistribusikan ke UMKM lain.

**Komitmen Waktu Kamu:** ~20 jam/hari efektif (full day kecuali 4 jam istirahat/tidur).

---

## 1. Project Philosophy & Approach

### Keputusan Final (Sesuai Klarifikasi Terakhirmu)
- **Multi-tenant dari hari pertama** (bukan single-tenant dulu).
- A6 Nyuss = **hanya referensi/kaca pembanding**, bukan tenant utama.
- Bangun **3 aplikasi terpisah** dalam satu monorepo:
  1. Customer App (untuk pelanggan)
  2. Admin/Karyawan App (gabungan Kasir + Dapur)
  3. Owner Dashboard (untuk pemilik bisnis)
- Tujuan: Sekali dibangun dengan kualitas enterprise, bisa langsung digunakan oleh banyak UMKM.

### Prinsip Desain
- **Enterprise Professional**: Fitur lengkap (BOM, Inventory, Forecasting, Approval, Audit, AI Insight, Multi-cabang, dll).
- **Gaptek-Friendly & Mobile-First**: UI sederhana, besar, jelas, banyak panduan visual.
- **Self-Service**: Onboarding dengan preview real-time.
- **Harga berdasarkan cabang** (Startup = 1 cabang full fitur Enterprise, Professional = max 3 cabang, Enterprise = unlimited).

---

## 2. Tech Stack (Final dari Awal)

- **Monorepo**: Turborepo + pnpm
- **Framework**: Next.js 16 (App Router) + TypeScript + React 19
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Database**: Neon Postgres atau PlanetScale + **Drizzle ORM**
- **Auth**: Better Auth (tenant-aware)
- **Realtime**: Ably (atau mulai dengan Supabase Realtime + abstraction layer)
- **Hosting**:
  - Frontend: Vercel
  - Backend / Jobs: Railway atau Render
- **Domain & Automation**: Cloudflare (Registrar + API + Workers)
- **Storage**: Cloudflare R2
- **Payments**: Xendit / Midtrans (QRIS)
- **AI**: Google Gemini
- **Monitoring**: Sentry + PostHog

**Alasan Stack Ini**:
- Mudah dimigrasi nanti (hanya ganti infra).
- Cocok untuk solo dev + AI coding partner.
- Cost lebih predictable dibanding pure Supabase + Vercel di skala menengah.

---

## 3. High-Level Architecture

- 1 Database (Postgres) dengan `tenant_id` di hampir semua tabel.
- Setiap UMKM = 1 **Tenant**.
- 3 aplikasi mengakses data yang sama dengan filter `tenant_id`.
- Domain routing:
  - `namabisnis.com` → Customer App
  - `admin.namabisnis.com` → Admin/Karyawan App
  - `owner.namabisnis.com` → Owner Dashboard
- Onboarding: User bayar → Isi form → Preview real-time (tampilkan domain + subdomain) → Sistem otomatis buat tenant, beli domain, setup Vercel, seed data template.

---

## 4. Detailed UI/UX & Features per Application

### 4.1 Customer App (Pelanggan)

**Tujuan**: Pelanggan bisa dengan mudah melihat menu, memilih varian/topping, order, dan tracking. Sangat mobile-first.

#### Halaman Lengkap + Detail Fitur

**1. Home / Landing (`/`)**
- Hero besar dengan branding tenant (logo, warna utama, nama bisnis, tagline).
- Section "Menu Favorit" (6 kartu menu terlaris).
- Section "Kenapa Memilih Kami" (4 kartu keunggulan).
- Section "Cara Order" (3 langkah visual dengan nomor besar).
- Section Testimonial (slider atau grid).
- Section Lokasi (alamat lengkap + Google Maps embed + jam operasional + status Buka/Tutup).
- Floating buttons (kanan bawah): 
  - Tombol Chat WhatsApp (dengan template pesan).
  - Tombol Keranjang (dengan badge jumlah item).

**2. Menu (`/menu`)**
- Header dengan search bar + filter kategori (horizontal scroll atau tab).
- Kategori: Martabak Telur Ayam, Martabak Telur Bebek, Terang Bulan, Paket Bundling, Minuman.
- Sorting: Terlaris | Harga Terendah | Harga Tertinggi | Rekomendasi.
- Grid responsif kartu menu:
  - Foto (aspect ratio 1:1)
  - Nama menu
  - Harga
  - Badge (🔥 Terlaris, ✨ Baru, Habis)
  - Klik kartu → buka modal atau navigasi ke detail.

**3. Menu Detail (`/menu/[slug]`)**
- Layout: Foto besar di atas (atau kiri di desktop).
- Nama menu + Harga besar.
- Deskripsi.
- **Varian Section**:
  - Martabak: Radio button "Jumlah Telur" (1-7) + "Isian" (Ayam / Sapi).
  - Terang Bulan: Pilihan Topping Utama + Checkbox "Extra Topping".
- Quantity selector (+ / -).
- Textarea "Catatan untuk Dapur".
- Harga total yang berubah real-time.
- Tombol besar "Tambah ke Keranjang" (sticky di mobile).

**4. Cart (`/cart`)**
- Daftar item dengan foto kecil.
- Untuk setiap item: Nama + Varian/Topping + Harga satuan + Quantity editor.
- Ringkasan di bawah:
  - Subtotal
  - Ongkir (otomatis berdasarkan zona)
  - Diskon (jika ada promo)
  - Total
- Input "Kode Promo" + tombol Apply.
- Tombol besar "Lanjut ke Pembayaran".

**5. Checkout (`/checkout`)**
- Form 2 kolom (mobile: stacked):
  - Data Pelanggan: Nama Lengkap, Nomor HP.
  - Tipe Order: Radio (Ambil Sendiri / Diantar).
  - Jika Diantar:
    - Input alamat lengkap.
    - Peta interaktif (Leaflet) + tombol "Gunakan Lokasi Saya".
    - Ongkir otomatis dihitung.
- Metode Pembayaran:
  - COD (Bayar di Tempat)
  - QRIS / Transfer (tampilkan QR statis + upload bukti).
- Ringkasan pesanan (sticky di desktop).
- Tombol "Buat Pesanan Sekarang".

**6. Tracking (`/tracking` atau `/tracking/[orderCode]`)**
- Jika belum punya kode: Form input kode order.
- Timeline visual status:
  - Received (hijau) → Processing → Ready → Completed (atau Cancelled merah).
- Detail pesanan lengkap.
- Estimasi waktu.
- Tombol "Chat WhatsApp" (auto isi pesan dengan kode order).

---

### 4.2 Admin / Karyawan App (Kasir + Dapur)

**Tujuan**: Satu aplikasi untuk operasional harian. Dirancang untuk 1-2 orang per outlet.

#### Halaman Lengkap + Detail Fitur

**1. Login + Buka Shift**
- Logo + nama bisnis tenant.
- Form: Username / Email + Password.
- Input "Uang Modal Awal Laci" (default Rp 200.000).
- Tombol besar "Buka Shift & Masuk".

**2. Dashboard Utama (Halaman Utama)**
- Top bar: Nama operator, Jam real-time, Tombol "Tutup Toko", Status Koneksi.
- **Kiri (40%)**: Order Queue
  - Tabs: Semua | Baru | Sedang Dibuat | Siap Diambil
  - Daftar kartu order (klik untuk detail).
  - Setiap kartu menampilkan: Kode Order, Nama Pelanggan, Total, Tipe, Waktu.
  - Alarm suara + visual flash saat order baru.
- **Kanan (60%)**: Order Detail
  - Header: Kode Order + Status (dengan warna).
  - Daftar item lengkap + varian + topping + catatan.
  - Bukti pembayaran (jika QRIS/Transfer) dengan tombol "Lihat Foto".
  - Action Buttons (besar):
    - "Mulai Proses" / "Selesai Dibuat" / "Siap Diambil" / "Selesai"
    - "Konfirmasi Pembayaran"
    - "Batalkan Pesanan" (dengan alasan)
    - "Cetak Struk"

**3. Dapur / Produksi**
- Daftar "Menu yang Harus Diproduksi Hari Ini".
- Setiap item punya checklist + tombol "Selesai".
- Section "Catat Bahan yang Digunakan".
- Form "Catat Waste / Rusak" (pilih alasan + qty).

**4. Kas & Shift**
- Ringkasan otomatis: Omset, COD vs Non-Cash, Kas Diharapkan.
- Input "Kas Aktual di Laci".
- Tampilkan Drift (lebih/kurang).
- Tombol: "Tutup Shift" → Otomatis export CSV + Print Thermal + Kirim WA ke Owner.

**5. Menu & Stok**
- Daftar semua menu dengan toggle "Tersedia" / "Habis".
- Toggle Topping (khusus Terang Bulan).
- Lihat HPP (jika role diizinkan).

**6. Riwayat**
- Riwayat Order (filter tanggal).
- Riwayat Shift.
- Log Aktivitas Kasir.

---

### 4.3 Owner Dashboard (Executive)

**Tujuan**: Memberikan gambaran besar bisnis. Fokus pada keputusan, kontrol, dan pertumbuhan.

#### Halaman Lengkap + Detail Fitur

**1. Executive Cockpit (Dashboard Utama)**
- Grid KPI Cards (bisa di-custom):
  - Revenue (Hari Ini / Bulan Ini / Tahun Ini + persentase growth)
  - Gross Margin %
  - Food Cost %
  - Labor Cost %
  - Waste %
  - Jumlah Order + AOV
- Charts utama:
  - Line chart Revenue Trend (bisa switch per cabang)
  - Bar chart Top Menu by Revenue & Margin
  - Pie chart Revenue by Cabang
  - Heatmap Jam Sibuk
- AI Insights box (3-5 insight otomatis).
- Alerts panel (merah/oranye/kuning).
- Quick Action buttons.

**2. Cabang**
- Tabel semua cabang + KPI ringkas.
- Tombol "Tambah Cabang Baru".
- Perbandingan performa antar cabang.
- Request & Approval Transfer Stok antar cabang.

**3. Menu & Resep (BOM)**
- Daftar master menu.
- Editor Resep: Tree view bahan baku + qty + biaya.
- Hitung HPP otomatis.
- Menu Engineering Matrix (visual 2x2).
- Deploy menu ke cabang tertentu.
- Riwayat perubahan harga.

**4. Persediaan & Pembelian**
- Overview stok (per cabang + total).
- Low Stock & Kadaluarsa Alerts.
- Log Waste + Analisis.
- Supplier list + Performance.
- Buat Purchase Order.

**5. Keuangan**
- Laporan Laba Rugi (P&L) per cabang & konsolidasi.
- Cash Flow Forecast.
- Rekap Shift semua cabang.
- Laporan Pajak (PPN, siap e-Faktur Coretax).

**6. Produksi & Operasional**
- Rencana Produksi Harian (AI recommended).
- Laporan Yield & Variance.
- Kapasitas Dapur.

**7. Penjualan & Analitik**
- Breakdown penjualan lengkap.
- Performa Promo.
- Analisis Pelanggan (Repeat Rate, Top Customer).

**8. SDM & Shift**
- Jumlah Karyawan & Biaya Tenaga Kerja %.
- Overview Jadwal Shift semua cabang.
- Leaderboard Performa.

**9. Persetujuan (Approvals)**
- Daftar yang menunggu persetujuan.
- Detail + tombol Setuju / Tolak + Catatan.
- Riwayat Persetujuan.

**10. AI & Peramalan**
- Demand Forecasting per cabang.
- Simulator "What If".
- Deteksi Anomali.
- Chat AI (bisa tanya apa saja tentang bisnis).

**11. Pengaturan**
- Branding & Template.
- Manajemen User & Hak Akses.
- Konfigurasi Pajak & Pembayaran.
- Integrasi (WhatsApp, Delivery Platform).
- Log Audit Lengkap.

---

## 5. Project Folder Structure (Monorepo)

```
fnb-saas/
├── apps/
│   ├── customer/                 # Next.js Customer App
│   ├── admin/                    # Next.js Admin/Karyawan App
│   └── owner/                    # Next.js Owner Dashboard
├── packages/
│   ├── db/                       # Drizzle schema, migrations, seed
│   ├── ui/                       # Shared components (shadcn)
│   ├── shared/                   # Types, utils, constants, API types
│   └── config/                   # Shared config (tailwind, eslint)
├── scripts/
│   ├── seed-template.ts          # Seed data F&B
│   └── domain-automation.ts
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 6. Struktur Lain yang Diperlukan

- **Database Schema**: Semua tabel utama harus punya `tenant_id`.
- **Middleware**: Resolver tenant berdasarkan hostname.
- **Environment Variables**: `NEXT_PUBLIC_TENANT_SLUG` (untuk dev), Vercel token, Cloudflare token, dll.
- **Preview System**: Untuk halaman onboarding (bisa pakai subdomain preview atau komponen mock).
- **Role & Permission**: owner | manager | kasir (per tenant).

---

## 7. Rekomendasi Cara Memulai (Dengan 20 Jam/Hari)

**Minggu 1**: Foundation
- Setup monorepo + 3 Next.js app
- Setup database + Drizzle + tabel `tenants`
- Setup Auth tenant-aware
- Tenant resolver (middleware)

**Minggu 2-4**: Bangun Customer App lengkap
**Minggu 5-7**: Bangun Admin App (kasir + dapur)
**Minggu 8-10**: Bangun Owner Dashboard + fitur enterprise inti
**Minggu 11-12**: Multi-cabang, AI, Self-Service Onboarding
**Minggu 13+**: Polish, Testing, Beta

---

**Dokumen ini adalah blueprint paling detail yang kamu minta.**

Apakah kamu ingin saya pecah menjadi file-file terpisah yang lebih actionable sekarang? Contoh:
- File Drizzle schema lengkap
- Step-by-step setup proyek hari pertama
- Detail komponen UI yang sering dipakai

Atau langsung mulai dengan salah satu bagian? Beritahu saya langkah berikutnya. Saya siap membantu sampai kamu benar-benar mulai coding.