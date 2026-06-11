# Rencana Migrasi, Batas Kuota & Scaling Strategy (Vercel + Cloudflare + Supabase)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Target Pengguna:** Solo Developer (atau tim kecil nanti) yang membangun SaaS F&B untuk UMKM di Indonesia (fokus awal Surabaya).  
**Tujuan Dokumen:** Memberikan roadmap jelas kapan harus **upgrade tier** (murah & cepat) dan kapan harus **migrasi tech stack** ke level hardcore enterprise. Termasuk estimasi biaya, trigger berdasarkan metrik nyata, dan strategi penyesuaian harga untuk pelanggan lama vs baru.

---

## 1. Realita Target Pengguna (UMKM F&B Surabaya & Sekitarnya)

- **Skala UMKM tipikal:**
  - 1–3 cabang/outlet
  - 1–5 karyawan per outlet (kasir + dapur)
  - Order per hari: 30–150 (peak malam)
  - Revenue per bulan per cabang: Rp 15jt – Rp 80jt
  - Willingness to pay: Sangat sensitif harga (Rp 200rb/bulan sudah terasa)

- **Metrik yang akan meledak:**
  - Jumlah **Tenant/Owner UMKM** yang daftar (bukan end customer)
  - Jumlah **Admin/Karyawan** aktif per tenant
  - Traffic end-customer (order real-time + tracking)
  - Ukuran database (menu, order history, inventory)

- **Asumsi Pertumbuhan Realistis (dengan dana sendiri):**
  - Tahun 1: 10–30 tenant aktif
  - Tahun 2: 50–150 tenant
  - Tahun 3: 200–500 tenant (jika viral di komunitas F&B Surabaya/Jatim)

---

## 2. Batas Kuota Saat Ini & Kapan Harus Upgrade Tier

### Supabase (Paling Kritis untuk SaaS Kamu)

| Tier          | DB Size | Storage | Bandwidth | Realtime Connections | Compute | Estimasi Biaya | Batas Realistis untuk F&B SaaS |
|---------------|---------|---------|-----------|----------------------|---------|----------------|--------------------------------|
| **Free**      | 500 MB  | 1 GB    | 2 GB/mo   | ~200 concurrent      | Terbatas | $0             | Max 5–10 tenant kecil         |
| **Pro**       | 8 GB    | 100 GB  | 50 GB/mo  | ~500–1000            | 2 CPU   | Mulai ~$25/mo  | 50–150 tenant (rekomendasi awal) |
| **Team**      | 100 GB+ | 1 TB+   | Custom    | Custom               | Custom  | $599+/mo       | 300–800 tenant                |
| **Enterprise**| Custom  | Custom  | Custom    | Custom               | Custom  | Custom         | 1000+ tenant                  |

**Trigger Upgrade / Migrasi Supabase:**
- **Upgrade ke Pro:** Saat database > 400MB atau bandwidth > 1.5GB/bulan atau realtime connection sering timeout (biasanya terjadi di ~25–40 tenant aktif).
- **Pertimbangkan Migrasi:** Saat kamu punya > 150–200 tenant aktif **atau** > 5.000 order/hari total **atau** butuh data residency ketat (regulasi Indonesia).
- **Biaya yang Meledak:** Realtime + Edge Functions paling mahal di Supabase.

### Vercel

| Tier          | Bandwidth | Edge Functions | Builds | Team Members | Estimasi Biaya | Batas Realistis |
|---------------|-----------|----------------|--------|--------------|----------------|-----------------|
| **Hobby**     | 100 GB    | 100K/day       | 6 jam  | 1            | $0 (tidak untuk komersial) | Hanya testing |
| **Pro**       | 1 TB      | 1M/day         | Unlimited | Unlimited   | $20/user/mo + overage | 100–400 tenant (dengan traffic sedang) |
| **Enterprise**| Custom    | Custom         | Custom | Custom       | $3,500+/mo     | 500+ tenant atau butuh SLA |

**Trigger:**
- **Upgrade ke Pro:** Segera saat launch komersial (Hobby dilarang untuk bisnis).
- **Overage mulai terasa:** Bandwidth > 800GB/bulan atau banyak Edge Function invocation (bisa terjadi di 150+ tenant dengan order real-time).
- **Migrasi dari Vercel:** Saat total biaya Vercel > Rp 15–20jt/bulan **atau** butuh background jobs berat / WebSocket persistent / compliance tinggi.

### Cloudflare (Domain + DNS + Optional Workers)

- **Registrar + DNS:** Sangat murah & generous (hampir tidak ada kuota keras untuk DNS biasa).
- **Workers / Pages:** Free tier sangat bagus (100.000 request/hari).
- **Batas Kritis:** Hampir tidak ada untuk SaaS seperti kamu di awal. Biaya baru naik signifikan jika kamu pakai Workers untuk logic berat atau proxy traffic sangat tinggi.

**Kesimpulan Cloudflare:** Jarang jadi bottleneck utama. Upgrade hanya jika kamu butuh WAF advanced atau banyak custom logic di edge.

---

## 3. Rencana Migrasi Bertahap (Solo Dev → Hardcore Enterprise)

### Fase 1: Launch – 50 Tenant (Bulan 1–8)
- **Stack:** Vercel Pro + Supabase Pro + Cloudflare (seperti desain utama)
- **Biaya Estimasi:** Rp 500rb – Rp 2jt / bulan (tergantung traffic)
- **Action:** Monitor via Supabase Dashboard + Vercel Analytics + PostHog / Sentry.
- **Trigger untuk Fase 2:** 
  - Database > 6GB, atau
  - Vercel biaya > Rp 3jt/bulan, atau
  - 80+ tenant aktif dengan order > 3.000/hari total.

### Fase 2: Growth – 150–300 Tenant (Bulan 9–18)
- **Upgrade Tier (Murah & Cepat):**
  - Supabase Team
  - Vercel tetap Pro atau naik ke Enterprise (jika butuh SLA)
- **Mulai Persiapan Migrasi:**
  - Pindah database layer ke **Neon** atau **PlanetScale** (serverless Postgres yang lebih scalable & murah di skala ini).
  - Pindah hosting frontend ke **Railway** atau **Render** (container pricing lebih predictable).
  - Gunakan **Cloudflare Workers** untuk sebagian logic (mengurangi Vercel function cost).
- **Trigger Migrasi Penuh:** 200+ tenant **atau** biaya bulanan > Rp 15jt **atau** butuh background job berat (contoh: auto laporan massal, auto reorder bahan).

### Fase 3: Hardcore Enterprise (300+ Tenant / Tim Sudah Ada)
**Opsi Migrasi Stack (Pilih salah satu atau hybrid):**

**Opsi A (Paling Direkomendasikan untuk Kamu): Hybrid Modern**
- Frontend: Tetap Vercel atau pindah ke Cloudflare Pages + Workers
- Database: Neon / PlanetScale / AWS Aurora Serverless
- Auth: Clerk atau Auth0 (jika butuh advanced SSO)
- Hosting Backend: Railway / Render / AWS ECS (Fargate)
- Orchestration: Kubernetes (hanya jika > 1000 tenant)
- Monitoring: Datadog atau New Relic

**Opsi B (Full Hardcore – Jika Tim Sudah Kuat)**
- Full AWS atau GCP:
  - Next.js di ECS / EKS atau Cloud Run
  - Postgres di Aurora / Cloud SQL
  - Auth: Cognito / WorkOS
  - Storage: S3 / Cloud Storage
  - Queue: SQS / Pub/Sub
  - IaC: Terraform + GitOps

**Opsi C (Self-Hosted untuk Hemat Biaya Jangka Panjang)**
- Appwrite self-hosted di VPS / Hetzner / DigitalOcean + Kubernetes
- Atau Supabase self-hosted (tapi maintenance berat)

---

## 4. Kapan Harus Menyesuaikan Harga Pelanggan

### Aturan Emas (Sangat Penting untuk Solo Dev)

- **Pelanggan Lama (yang daftar di tahun pertama):** 
  - **Jangan naikkan harga** selama minimal 2 tahun (grandfathering).
  - Ini membangun trust dan word-of-mouth di komunitas UMKM Surabaya.

- **Pelanggan Baru:**
  - Naikkan harga 20–40% dibanding pelanggan lama saat kamu sudah di Fase 2 (misal: Basic/Startup jadi Rp 250–300rb/bulan).
  - Enterprise selalu custom dan lebih mahal.

**Rekomendasi Penyesuaian Harga:**

| Fase          | Tenant Aktif | Harga Startup (Baru) | Harga Professional (Baru) | Catatan |
|---------------|--------------|----------------------|---------------------------|---------|
| Launch (0–6 bulan) | < 30        | Rp 200.000          | Rp 200.000               | Harga rendah untuk akuisisi |
| Growth (6–18 bulan) | 30–150     | Rp 250.000          | Rp 250.000               | Naikkan pelan-pelan |
| Scale (18+ bulan)   | 150+       | Rp 299.000–349.000  | Rp 349.000–399.000       | Sesuaikan dengan biaya infra baru |

- Selalu beri **diskon tahunan** yang lebih besar untuk pelanggan baru di fase scale.
- Komunikasikan kenaikan harga 60 hari sebelumnya ke pelanggan lama (meski tidak naikkan untuk mereka).

---

## 5. Metrik yang Harus Kamu Monitor (Dashboard Sederhana)

Buat 1 halaman internal atau pakai PostHog / Supabase + simple dashboard:

**Primary Metrics (Paling Penting):**
- Jumlah Tenant Aktif (Owner UMKM yang bayar)
- Jumlah Active Admin/Karyawan (users per tenant)
- Total Order per Hari (semua tenant)
- Database Size (MB)
- Vercel Bandwidth + Function Invocation
- Supabase Realtime Connection Peak
- Monthly Recurring Revenue (MRR)

**Warning Thresholds (Buat Alert):**

| Metrik                    | Warning (Upgrade Tier) | Critical (Mulai Migrasi) | Hardcore Migrasi |
|---------------------------|------------------------|---------------------------|------------------|
| Tenant Aktif              | 40–60                 | 120–150                   | 250+            |
| Active Karyawan Total     | 80                    | 250                       | 600+            |
| Order/Hari (total)        | 2.000                 | 6.000                     | 15.000+         |
| Supabase DB Size          | 5 GB                  | 12 GB                     | 50 GB+          |
| Vercel Bandwidth/Bulan    | 600 GB                | 1.2 TB                    | 4 TB+           |
| Biaya Infra / Bulan       | Rp 3jt                | Rp 10jt                   | Rp 25jt+        |

---

## 6. Strategi Dana & Pricing untuk Pelanggan Lama vs Baru

- **Fase Launch (dana sendiri terbatas):** Harga rendah + banyak early adopter. Gunakan uang dari pelanggan untuk bayar infra.
- **Fase Growth:** Naikkan harga pelanggan **baru** lebih agresif. Gunakan selisih untuk bayar upgrade tier.
- **Fase Migrasi:** 
  - Pelanggan lama tetap bayar harga lama (ini investasi jangka panjang).
  - Pelanggan baru bayar harga yang sudah disesuaikan dengan biaya infra baru (bisa 1.5x – 2x lebih mahal).
  - Pertimbangkan model **usage-based** tambahan di Enterprise (contoh: bayar per cabang tambahan atau per 1.000 order).

---

## 7. Rekomendasi Praktis untuk Solo Dev di Surabaya

1. **Mulai dengan monitoring ketat** sejak hari pertama (buat alert di Slack/Telegram pribadi).
2. **Jangan migrasi terlalu cepat.** Kebanyakan SaaS Indonesia gagal karena over-engineer terlalu awal.
3. **Fokus dulu dapat 50–70 tenant aktif** dengan kualitas bagus sebelum pikirkan migrasi.
4. **Dana:** Sisihkan 30–40% dari revenue untuk infra + migrasi cadangan.
5. **Tim:** Saat kamu punya 100+ tenant dan revenue stabil, baru pertimbangkan hire 1 orang part-time untuk support & maintenance.
6. **Regulasi Indonesia:** Saat sudah besar, pertimbangkan data residency (data pelanggan Indonesia sebaiknya di region Asia). Ini salah satu alasan kuat untuk migrasi ke AWS Singapore atau self-hosted.

---

**Ringkasan Keputusan Cepat**

- **< 50 tenant + revenue < Rp 15jt/bulan** → Stick dengan Vercel Pro + Supabase Pro. Jangan mikir migrasi.
- **50–150 tenant** → Upgrade tier dulu (Supabase Team + Vercel Pro). Mulai eksperimen alternatif (Neon + Railway).
- **> 200 tenant atau biaya infra > Rp 12–15jt/bulan** → Mulai proyek migrasi serius ke stack yang lebih predictable cost (Railway/Render + Neon/PlanetScale) atau full AWS jika sudah ada tim.

Dokumen ini dirancang agar kamu punya **visibility** dan **rencana cadangan** sejak awal, tanpa harus panik ketika kuota meledak.

Mau saya buatkan versi yang lebih detail (contoh: estimasi biaya detail per fase, contoh alert query Supabase, atau template monitoring dashboard)? Atau mau saya update dokumen desain utama dengan bagian migrasi ini?