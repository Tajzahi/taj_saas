# Complete Blueprint: Enterprise SaaS untuk UMKM F&B (Dibangun dari Nol)

**Versi:** 1.0 Final  
**Tanggal:** 9 Juni 2026  
**Tujuan:** Blueprint lengkap, actionable, dan future-proof untuk solo developer (dengan AI coding partner) yang ingin membangun sistem SaaS multi-tenant level enterprise professional.  
**Fokus:** Minimalkan perubahan kode saat migrasi infra jika kuota melonjak. Target pengguna: UMKM F&B Indonesia (awal Surabaya), harga ramah, self-service, gaptek-friendly, mobile-first.

**Prinsip Utama Blueprint Ini:**
- Tech stack dipilih agar **hanya infra yang diganti** saat scale (bukan rewrite aplikasi).
- Fitur enterprise professional tapi alur sederhana.
- Self-service penuh + preview.
- Harga berdasarkan jumlah cabang (Startup = 1 cabang full enterprise, Professional = max 3, Enterprise = unlimited).

---

## 1. Tech Stack Terbaik 100% dari Awal (Future-Proof dengan Minimal Migration Pain)

### Stack yang Direkomendasikan (Paling Cocok untuk Kasus Kamu)

**Frontend & Full-Stack Framework**
- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind CSS v4 + shadcn/ui (komponen enterprise-grade yang mudah di-custom)
- Turborepo (monorepo) — wajib dari hari pertama

**Monorepo Structure (Apps)**
- `apps/customer` → Customer Portal (public)
- `apps/admin` → Admin/Karyawan (kasir + dapur)
- `apps/owner` → Owner Dashboard (executive)
- `packages/shared` → Types, utils, API contracts
- `packages/ui` → Shared komponen

**Database & Data Layer**
- **Primary DB:** Neon Postgres (serverless Postgres) atau PlanetScale
  - Alasan: Postgres penuh (bisa pakai RLS, extensions, SQL native), branching untuk testing multi-tenant, sangat portable.
- **ORM:** Drizzle ORM (ringan, type-safe, mudah migrasi)
- **Migrations:** Drizzle Kit

**Auth**
- Better Auth atau Clerk (fleksibel, organization/tenant support, mudah swap ke Auth0/WorkOS nanti)

**Realtime (Order Queue, Tracking)**
- Ably atau Pusher (bisa mulai dengan Supabase Realtime dulu, lalu ganti tanpa ubah banyak kode karena pakai abstraction layer)

**Hosting & Infra (Pilih yang Mudah Diganti)**
- **Frontend (Customer + Admin + Owner):** Vercel (terbaik untuk Next.js)
- **Backend / API / Jobs:** Railway atau Render (container pricing predictable)
- **Edge / DNS / Domain Automation:** Cloudflare (API bagus, Registrar murah)
- **Storage (bukti QRIS, foto menu):** Cloudflare R2 atau Supabase Storage (mudah dipindah ke S3)

**Payments & Integrasi Lokal**
- Xendit atau Midtrans (QRIS dynamic + webhook)
- WhatsApp Business API (untuk notifikasi & laporan)

**Lainnya**
- Email: Resend
- Monitoring & Analytics: Sentry + PostHog (self-hosted friendly)
- Background Jobs: Trigger.dev atau Inngest
- AI: Google Gemini (via API, mudah diganti)

### Mengapa Stack Ini Terbaik dari Awal?
- **Next.js + Postgres** = portable. Bisa deploy ke Vercel hari ini, pindah ke AWS ECS besok tanpa ubah logic bisnis.
- **Container-based backend (Railway/Render)** = lebih predictable cost daripada pure serverless.
- **Drizzle + Postgres** = tidak vendor lock-in seperti Supabase Realtime penuh.
- **Monorepo dari hari pertama** = mudah scale tim nanti.
- **Abstraction untuk Realtime/Auth** = ganti provider tanpa rewrite halaman.

### Rencana Migrasi Minimal (Hanya Ganti Infra)
- **Fase 1 (Launch – 80 tenant):** Vercel + Neon + Railway + Cloudflare
- **Fase 2 (Growth – 200 tenant):** Tambah Cloudflare Workers untuk sebagian API. Pindah DB ke PlanetScale jika lebih murah.
- **Fase 3 (Hardcore – 300+ tenant atau tim ada):** 
  - Frontend tetap Vercel atau pindah Cloudflare Pages.
  - Backend ke AWS ECS/Fargate atau GCP Cloud Run.
  - DB ke Aurora Serverless atau self-hosted Postgres.
  - Auth ke WorkOS (jika butuh SSO Enterprise).
- **Tidak perlu rewrite** aplikasi karena semua logic bisnis di Next.js + Drizzle (hanya config infra yang berubah).

---

## 2. Halaman & Fitur Detail per Role (Enterprise Professional Level)

### A. Customer App (Role: Pelanggan / End User)
Tujuan: Mudah order, tracking, mobile-first. Self-service.

**Halaman & Fitur Detail:**

1. **Home / Landing** (`/`)
   - Hero dengan branding tenant (logo, warna, nama bisnis)
   - Menu terlaris + highlight
   - Keunggulan (halal, cepat, tanpa ojol, fresh daily)
   - Cara order (3 langkah visual)
   - Testimonial (bisa dinamis per tenant)
   - Lokasi + jam operasional + peta (Leaflet)
   - Floating buttons: Chat WA + Cart

2. **Menu** (`/menu`)
   - Filter kategori (Martabak Telur, Terang Bulan, Paket, Minuman, dll)
   - Search + sort (Terlaris, Harga, Rekomendasi)
   - Grid kartu dengan badge (Terlaris, Baru, Habis, Promo)
   - Klik kartu → buka modal detail

3. **Menu Detail** (`/menu/[slug]`)
   - Foto besar + deskripsi
   - Varian (jumlah telur, isian Ayam/Sapi)
   - Topping selector (untuk Terang Bulan) + extra topping
   - Quantity + catatan khusus
   - Harga real-time + tombol "Tambah ke Keranjang"
   - Estimasi waktu persiapan

4. **Cart** (`/cart`)
   - Daftar item + edit (quantity, varian, topping, catatan)
   - Subtotal, delivery fee (zona-based), promo code
   - Estimasi total & waktu

5. **Checkout** (`/checkout`)
   - Form: Nama, No HP, Tipe order (Pickup/Delivery)
   - Alamat + peta interaktif (Leaflet + geolocation)
   - Pilihan bayar (COD / QRIS/Transfer)
   - Validasi promo server-side
   - Ringkasan + tombol "Buat Pesanan"
   - Setelah sukses → redirect ke tracking + kode order

6. **Tracking** (`/tracking`)
   - Input kode order atau auto dari session
   - Status real-time: received → processing → ready → completed/cancelled
   - Detail item + estimasi waktu
   - Tombol chat WA otomatis

7. **Lainnya (Opsional tapi Enterprise):**
   - About, Contact, FAQ, Gallery, Promo, Catering
   - Order History (jika login sederhana)
   - AI Chatbot (Gemini) untuk rekomendasi menu

**Koneksi:**
- Order → langsung ke Admin via Realtime
- Status update dari Admin → update di halaman ini

---

### B. Admin / Karyawan App (Role: Kasir + Dapur – Gabungan)
Tujuan: 1 app untuk 1-2 orang per outlet. Kasir handle pembayaran & laporan. Dapur handle produksi & checklist.

**Halaman & Fitur Detail:**

1. **Login + Buka Shift**
   - Username/password (tenant-aware)
   - Input uang modal awal laci
   - Otomatis buat shift record + log

2. **Dashboard Utama (Real-time)**
   - Header: Status toko, nama operator, jam real-time, koneksi
   - Panel Kiri: **Order Queue** (semua order dengan filter status: received/processing/ready/completed)
   - Alarm suara saat order baru masuk
   - Panel Kanan: **Order Detail** (item lengkap + varian + topping + catatan + bukti bayar jika QRIS)
   - Action cepat: Update status, Konfirmasi bayar (manual QRIS), Cancel dengan alasan, Print struk

3. **Dapur / Production Checklist**
   - Daftar menu yang harus diproduksi hari ini (berdasarkan order masuk)
   - Checklist bahan yang digunakan (dari order_items)
   - Tombol "Selesai Produksi" per item/batch
   - Catat waste/spoilage (reason code)

4. **Shift & Kas Management**
   - Modal Rekap Harian (omset bersih, breakdown COD vs QRIS, kas diharapkan vs aktual, drift)
   - Tutup shift + export CSV + thermal print Z-Report
   - Kirim laporan otomatis ke WA Owner

5. **Menu & Availability**
   - Toggle is_available untuk menu & topping
   - Lihat HPP dasar (jika diizinkan)

6. **Riwayat & Laporan**
   - Riwayat order per shift
   - Audit log aksi kasir
   - Shift history

**Koneksi:**
- Realtime dari Customer
- Update status → sync ke Customer Tracking
- Data shift/rekap → langsung ke Owner Dashboard

---

### C. Owner Dashboard (Role: Owner / Pemilik Bisnis – Executive)
Tujuan: High-level visibility, decision making, approval. Bukan operasional harian. Enterprise feel.

**Halaman & Fitur Detail:**

1. **Executive Cockpit** (Halaman Utama)
   - KPI Cards: Revenue (hari/MTD/YTD), Gross Margin, Food Cost %, Labor Cost %, Waste %, Avg Order Value, Active Orders
   - Charts: Revenue trend (multi-cabang), Top 10 menu by revenue/margin, Hourly sales heatmap, Cabang performance comparison
   - AI Insights otomatis (Gemini)
   - Critical Alerts (stok rendah, revenue drop, drift kas tinggi, order backlog)
   - Quick actions (Add Branch, View Today Report, AI Chat)

2. **Branches / Cabang Management**
   - Daftar cabang + KPI per cabang
   - Tambah/edit cabang + onboarding wizard
   - Performance benchmarking antar cabang
   - Inter-branch stock transfer request & approval

3. **Menu & Recipe (BOM)**
   - Master menu + varian
   - Recipe editor (tree bahan baku + qty + waste factor)
   - HPP otomatis + margin calculator
   - Menu Engineering matrix (Star/Plowhorse/Puzzle/Dog)
   - Deploy menu ke cabang tertentu + price override per cabang

4. **Inventory & Procurement**
   - Stock overview per cabang + total
   - Low stock + expiring alerts
   - Waste log + analytics (by reason, by item, by cabang)
   - Supplier management + Purchase Order + 3-way matching
   - Stock count (cycle/physical) dengan mobile support

5. **Finance & Cash**
   - Consolidated P&L (per cabang & total)
   - Cash flow forecast (7/30 hari)
   - Shift reconciliation summary (semua cabang)
   - Tax center (PPN, e-Faktur Coretax siap, QRIS)
   - Budget vs Actual

6. **Production & Operations**
   - Daily Production Plan (AI suggested berdasarkan forecast + order)
   - Yield & variance report
   - Kitchen capacity overview

7. **Sales & Customer Analytics**
   - Sales breakdown (channel, time, menu, cabang, salesperson)
   - Promotion & discount performance
   - Customer insights (repeat rate, LTV, favorite items)
   - Cohort analysis sederhana

8. **HR & Workforce**
   - Headcount & labor cost % per cabang
   - Shift schedule overview (visual)
   - Performance leaderboard kasir
   - Recruitment pipeline (untuk ekspansi)

9. **Approvals & Governance**
   - Pending queue (PO besar, discount > threshold, refund, inter-branch transfer)
   - Multi-level approval workflow (configurable)
   - Full audit logs (searchable, filter by user/cabang/action)

10. **AI Insights & Forecasting**
    - Demand forecast per cabang (7/30 hari)
    - What-if simulator (naikkan harga 10% → impact?)
    - Anomaly detection
    - Natural language query ("Berapa food cost cabang Demak bulan ini?")
    - AI Chat full-screen

11. **Settings & Configuration**
    - Company & branding (logo, warna, template)
    - User management (Owner, Manager, Kasir) + role & permission
    - Tax & payment config (QRIS keys, e-Faktur serial)
    - Integration (WA, delivery platform, accounting export)
    - Subscription & billing (untuk SaaS tenants)
    - Audit logs full

**Koneksi:**
- Semua data agregat dari Admin + Customer
- Realtime update
- Approval dari sini → effect langsung ke Admin

---

## 3. Estimasi Biaya yang Dibayarkan oleh User (UMKM Owner)

**Model:** Harga berdasarkan jumlah cabang. Domain dibeli provider (biaya termasuk).

### Harga Awal Launch (Tahun Pertama)

- **Startup (1 cabang – Full Enterprise Features)**
  - Awal: Rp 500.000
  - Bulanan: Rp 200.000
  - Tahunan: Rp 2.000.000 (diskon)

- **Professional (Maks 3 cabang – Full Features)**
  - Awal: Rp 800.000
  - Bulanan: Rp 200.000
  - Tahunan: Rp 2.200.000 (diskon)

- **Enterprise (Unlimited cabang + Custom)**
  - Awal: Rp 1.000.000
  - Bulanan: Rp 200.000
  - Tahunan: Rp 2.400.000 (diskon)
  - + Custom development (dihitung terpisah)

### Estimasi di Tahun Berikutnya (Saat Scale)

- Naikkan harga pelanggan **baru** 20-40% (Startup jadi Rp 250-299rb/bulan).
- Pelanggan lama tetap harga lama (minimal 2 tahun).
- Enterprise selalu custom + usage-based (misal tambahan per cabang atau per 1.000 order).

**Yang Termasuk dalam Harga:**
- 3 aplikasi (Customer + Admin + Owner)
- Domain + subdomain setup
- Hosting & database
- Update fitur dasar
- Support WhatsApp (respon 24 jam)
- Template F&B default

---

## 4. Penjelasan Lebih Detail Lainnya

### Multi-Tenant & Self-Service
- 1 database (Postgres) dengan `tenant_id` di hampir semua tabel + RLS.
- Onboarding: User bayar → isi form (nama, logo, warna, alamat, WA, template) → Preview real-time (tampilkan domain + subdomain yang akan dipakai) → Sistem otomatis beli domain (via Cloudflare API), tambah custom domain ke Vercel, seed data template, buat user owner pertama.
- Preview sangat penting untuk gaptek-friendly.

### Domain & Subdomain
- Provider beli domain utama atas nama klien.
- Struktur: `namabisnis.com` (Customer) | `admin.namabisnis.com` (Admin) | `owner.namabisnis.com` (Owner)
- Otomatis via API saat onboarding.

### Data Model Inti (High-Level)
- tenants, profiles (user + role), categories, menu_items, menu_variants, toppings, recipes, recipe_ingredients, inventory, orders, order_items, shifts, shift_logs, audit_logs, suppliers, purchase_orders, promotions.

### Indonesia-Specific (Wajib)
- QRIS (manual di awal, dynamic di Enterprise)
- e-Faktur Coretax (siap di Owner)
- PPN calculation (11/12 DPP)
- WhatsApp Business API untuk notifikasi & laporan harian
- Bahasa Indonesia utama + English opsional

### Monitoring & Alert (Wajib dari Awal)
- Track: Jumlah tenant aktif, active users per tenant, order/hari, DB size, bandwidth, biaya infra.
- Alert otomatis (Telegram/Slack pribadi) saat mendekati 70% limit.

### Roadmap Build dari Nol (Realistis untuk Solo + AI)
- Minggu 1-3: Monorepo + auth + multi-tenant dasar + DB schema
- Minggu 4-7: Customer App lengkap + Admin (kasir + dapur)
- Minggu 8-10: Owner Dashboard + inventory + recipe + AI dasar
- Minggu 11-12: Self-service onboarding + domain automation + preview
- Minggu 13+: Polish, dokumentasi, early access 5-10 tenant

### Biaya Infra untuk Kamu (Developer)
- Awal (10-20 tenant): Rp 1-2 juta/bulan (Vercel Pro + Neon + Railway)
- Saat 100 tenant: Rp 8-15 juta/bulan (upgrade tier)
- Saat migrasi: Siapkan cadangan 30-40% revenue untuk infra.

**Catatan Penting:** Harga di atas dirancang ramah UMKM Surabaya. Jangan naikkan terlalu cepat untuk pelanggan lama.

---

Blueprint ini sudah siap digunakan sebagai panduan coding dari nol. Semua elemen (stack, halaman, fitur, biaya, migrasi minimal) sudah disatukan dan konsisten dengan diskusi kita sebelumnya.

Mau saya pecah menjadi file pendukung (contoh: full Drizzle schema, monorepo folder structure detail, contoh API route onboarding, atau cost calculator spreadsheet)? Atau langsung mulai dengan salah satu bagian (misalnya schema database lengkap)? 

Langsung beri tahu prioritasmu. Saya siap bantu sampai selesai.