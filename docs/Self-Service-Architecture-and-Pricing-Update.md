# Self-Service Architecture, Updated Pricing & Technical Implementation

**Tanggal:** 9 Juni 2026  
**Tujuan:** Memberikan panduan teknis langsung untuk implementasi self-service SaaS F&B dengan domain otomatis, subdomain, Vercel deploy, dan Supabase.

---

## 1. Updated Pricing Scheme (Final Sesuai Permintaan)

### Startup (1 Cabang – Full Enterprise Features)
- **Biaya Awal:** Rp 500.000
- **Bulanan:** Rp 200.000
- **Tahunan:** Rp 2.000.000 (diskon)

**Karakteristik:**
- Hanya 1 cabang
- Semua fitur Enterprise lengkap (inventory, recipe/BOM, advanced owner dashboard, forecasting dasar, AI insight, full reporting, unlimited user internal, dll)
- Cocok untuk UMKM yang sudah berkembang tapi belum rencana buka cabang
- Self-service penuh

### Basic (1 Cabang – Fitur Terbatas)
- **Biaya Awal:** Rp 500.000
- **Bulanan:** Rp 200.000
- **Tahunan:** Rp 2.000.000

**Karakteristik:**
- 1 cabang
- Fitur standar (tanpa inventory penuh, tanpa advanced forecasting)

### Professional (Maks 3 Cabang)
- **Biaya Awal:** Rp 800.000
- **Bulanan:** Rp 200.000
- **Tahunan:** Rp 2.200.000

**Karakteristik:**
- Maksimal 3 cabang
- Semua fitur lengkap seperti Enterprise
- Hanya dibatasi jumlah cabang

### Enterprise
- **Biaya Awal:** Rp 1.000.000
- **Bulanan:** Rp 200.000
- **Tahunan:** Rp 2.400.000
- + Custom development (dihitung terpisah)

---

## 2. Catatan Domain (Penting)

- **Kita (provider) yang membeli domain** untuk klien.
- Biaya domain sudah termasuk dalam paket (Rp300.000/tahun dialokasikan di dalam harga).
- Klien tidak perlu beli domain sendiri.
- Domain akan didaftarkan atas nama klien (bisa pakai data mereka atau data kita sebagai perantara).
- Rekomendasi registrar yang punya API: **Cloudflare Registrar**, Namecheap, atau GoDaddy (Domainesia saat ini API-nya terbatas).

---

## 3. Penjelasan Arsitektur Saat Ini (Admin + Karyawan)

Saat ini Anda hanya menggunakan **1 aplikasi Admin/Karyawan** karena:
- Gabungan peran Kasir + Dapur dalam 1 app.
- Kasir: lihat pembayaran, laporan keuangan, shift.
- Dapur: checklist menu yang harus dibuat + bahan yang digunakan.
- Alasan: Mayoritas UMKM F&B hanya butuh 1-2 karyawan per outlet.
- Owner (Anda) belum butuh dashboard terpisah yang kompleks untuk brand sendiri.

**Kesimpulan:** Untuk single brand saat ini, pendekatan "1 app untuk operasional" sudah cukup. Owner Dashboard baru benar-benar diperlukan saat komersial atau saat brand Anda sendiri sudah punya banyak cabang.

---

## 4. Monorepo vs Domain Terpisah

- Anda ingin **1 monorepo**.
- Saat ini pakai domain terpisah karena brand Anda belum punya domain utama.
- **Rekomendasi jangka panjang:** Pindah ke monorepo (Turborepo) begitu brand utama punya domain.
- Untuk sementara (1 bulan ke depan): Lanjutkan dengan 3 project Vercel terpisah sambil siapkan monorepo.

---

## 5. Self-Service System Architecture (Teknis)

### 5.1 User Flow Self-Service

1. User daftar / login di halaman komersial.
2. Pilih paket (Startup / Basic / Professional / Enterprise).
3. Checkout & bayar (Midtrans / Xendit).
4. Redirect ke halaman **Onboarding Form**.
5. Isi data:
   - Nama bisnis
   - Logo + warna brand
   - Alamat, nomor WA, jam operasional
   - Pilihan template (Street Food / Warung Makan / dll)
6. **Preview / Overview** ditampilkan secara real-time (mirip preview template).
7. Di preview juga ditampilkan:
   - Domain yang akan digunakan: `namabisnis.com`
   - Subdomain: `admin.namabisnis.com` dan `owner.namabisnis.com`
8. User klik "Konfirmasi & Buat Sistem Saya".
9. Sistem otomatis:
   - Buat tenant baru di database
   - Daftarkan domain + subdomain
   - Deploy project ke Vercel
   - Buat project Supabase (atau row tenant)
   - Kirim email + WA berisi akses

### 5.2 Domain & Subdomain Otomatis

**Rekomendasi:**
- Gunakan **Cloudflare Registrar** atau Namecheap API (bukan Domainesia untuk automation).
- Flow:
  1. Saat user checkout + isi form, sistem generate slug bisnis (contoh: `martabakpakde`).
  2. Beli domain baru via API registrar (contoh: `martabakpakde.com`).
  3. Langsung tambahkan 3 custom domain di Vercel via **Vercel API**.
  4. Setup DNS otomatis (CNAME ke Vercel) via Cloudflare API.
  5. Subdomain otomatis ikut terdaftar.

**Catatan penting:**
- Domainesia saat ini **tidak direkomendasikan** untuk automation karena API terbatas.
- Lebih baik pindah ke Cloudflare Registrar (lebih murah + API bagus).

### 5.3 Vercel Auto Deploy untuk Tenant Baru

**Opsi Terbaik (Rekomendasi):**

**Gunakan 1 aplikasi monorepo + dynamic tenant routing** (bukan buat project Vercel baru setiap klien).

**Cara:**
- 1 Next.js app (monorepo).
- Setiap tenant punya config di database (`tenant_id`, `domain`, `branding`, `menu_template`).
- Routing berdasarkan hostname:
  - `namabisnis.com` → Customer app
  - `admin.namabisnis.com` → Admin/Kasir
  - `owner.namabisnis.com` → Owner Dashboard
- Custom domain ditambahkan otomatis via **Vercel API** saat onboarding.

**Vercel API yang dibutuhkan:**
- `POST /v9/projects/{projectId}/domains` → tambah custom domain
- Gunakan Vercel Access Token (simpan di environment).

**Alternatif (lebih sederhana untuk 1 bulan pertama):**
- Buat 3 project Vercel template (Customer, Admin, Owner).
- Saat onboarding, clone project via Vercel API atau pakai GitHub template + trigger deploy manual dulu.
- Nanti otomatisasi penuh setelah monorepo selesai.

### 5.4 Supabase Strategy

- **Gunakan 1 Supabase project** (business account Anda).
- Semua tenant dalam 1 database.
- Wajib pakai **Row Level Security (RLS)** + `tenant_id` di hampir semua tabel.
- Saat free tier limit hampir habis → langsung upgrade ke Pro plan.
- Jangan buat project Supabase baru per tenant (mahal dan susah maintenance).

**Struktur tabel minimal yang dibutuhkan:**
- `tenants` (id, name, domain, subdomain, branding_json, package_type, created_at)
- `tenant_users`
- Semua tabel lain (orders, menu_items, dll) harus punya kolom `tenant_id`.

### 5.5 Preview / Overview Fitur

- Buat halaman `/onboarding/preview` yang menggunakan data dari form secara real-time.
- Gunakan iframe atau komponen terpisah yang meniru tampilan Customer, Admin, dan Owner.
- Tampilkan contoh:
  - Customer: `https://preview.namabisnis.com`
  - Admin: `https://admin-preview.namabisnis.com`
  - Owner: `https://owner-preview.namabisnis.com`

Bisa pakai Vercel Preview Deployments atau subdomain statis untuk preview.

### 5.6 GitHub + Vercel Automation Saat Ini vs Masa Depan

**Saat ini (yang Anda pakai):**
- Push ke GitHub → Vercel auto deploy (sudah bagus untuk development).

**Untuk Self-Service (otomatis untuk klien baru):**
- Tidak cukup hanya GitHub push.
- Perlu:
  1. Vercel API untuk menambah custom domain ke project yang sudah ada.
  2. Atau trigger GitHub Action yang membuat branch baru + environment variable tenant_id.
  3. Atau (paling bersih) pakai **monorepo + single deployment** dengan hostname-based routing.

**Rekomendasi implementasi bertahap:**
- Minggu 1-2: Manual + semi-otomatis (Anda yang setup domain + Vercel setelah user bayar).
- Minggu 3+: Otomatisasi penuh menggunakan Vercel API + Cloudflare API.

---

## 6. Rekomendasi Teknis Langsung

1. **Pindah ke Cloudflare Registrar** untuk domain automation.
2. **Mulai bangun monorepo** sekarang (meski masih pakai 3 project Vercel sementara).
3. **Gunakan 1 Supabase project** + RLS + `tenant_id`.
4. **Jangan buat project Vercel baru per tenant** jika memungkinkan (pakai custom domain di 1 project besar).
5. Buat tabel `tenants` + `tenant_settings` sejak awal.
6. Buat halaman preview yang bagus di onboarding (ini jadi selling point besar).

---

## 7. File Penting yang Harus Dibuat

- `tenants` table di Supabase
- Onboarding form + preview component
- API route `/api/onboarding/create-tenant`
- Service untuk beli domain + setup Vercel domain (menggunakan API)
- Vercel project environment variables per tenant (jika pakai multiple projects)

---

**Dokumen ini sudah langsung dalam format implementasi.**  
Kalau butuh contoh kode (API route, Supabase migration, Vercel API call), beri tahu bagian mana yang ingin saya buatkan selanjutnya.