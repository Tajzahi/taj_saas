# Master Conversation Summary & Final Blueprint
## taj_saas F&B SaaS – Enterprise Professional untuk UMKM (Dibangun dari Nol)

**Versi:** 1.0 (Kompilasi Lengkap Seluruh Obrolan)  
**Tanggal:** 9 Juni 2026  
**Tujuan Dokumen:**  
Dokumen ini adalah **satu file tunggal** yang merangkum **seluruh percakapan** kita dari awal hingga akhir.  
Gunakan dokumen ini sebagai "backup otak" jika kuota obrolan habis, pindah ke chat baru, atau ingin melanjutkan tanpa kehilangan konteks.  
Semua keputusan, evolusi pemikiran, dan final blueprint sudah disatukan di sini.

---

## Ringkasan Eksekutif Proyek

**Visi Utama**  
Membangun SaaS multi-tenant level enterprise professional untuk UMKM F&B Indonesia (fokus awal martabak & terang bulan di Surabaya).  
- Mudah digunakan (gaptek-friendly, mobile-first, self-service)  
- Fitur lengkap seperti Odoo tapi **jauh lebih sederhana** untuk UMKM  
- Harga sangat ramah (Rp 200.000/bulan untuk Startup)  
- Bisa dikomersilkan ke banyak UMKM sejenis  
- Solo developer + AI coding partner, dana sendiri  
- Siap scale dari 1 cabang hingga puluhan cabang dengan migrasi infra minimal

**Tiga Aplikasi Utama**
1. **Customer App** → Portal publik untuk pelanggan order
2. **Admin/Karyawan App** → Gabungan Kasir + Dapur (1-2 orang per outlet)
3. **Owner Dashboard** → Executive level untuk pemilik bisnis

**Model Bisnis**  
Niche SaaS Template F&B Indonesia. Harga berdasarkan jumlah cabang. Provider membeli domain untuk klien.

---

## Evolusi Obrolan & Keputusan Penting

### Awal Percakapan
- Kamu ingin fitur owner dashboard ala Odoo Enterprise.
- Sudah punya Customer App dan Admin App (dibuat dalam 1 minggu pakai AI).
- Bisnis: Martabak & Terang Bulan, rencana ekspansi banyak cabang + komersialisasi ke UMKM lain.
- Tech saat itu: Next.js (Customer), Vite React (Admin), Supabase.

### Analisis Aplikasi Existing
- Customer: Sudah cukup bagus (menu, cart, checkout, tracking, WA integration).
- Admin: Fokus kasir (realtime order, shift, rekap kas, thermal print).
- Gap besar: Belum ada Owner layer, multi-tenant, inventory/BOM, self-service, domain automation.

### Pricing Evolution
- Awal: Rp500.000 sekali + Rp200.000/bulan.
- Akhir (final): 
  - **Startup**: 1 cabang + **semua fitur Enterprise** (Rp500.000 awal + Rp200.000/bulan)
  - **Professional**: Maks 3 cabang + full fitur (Rp800.000 awal + Rp200.000/bulan)
  - **Enterprise**: Unlimited + custom (Rp1.000.000 awal + Rp200.000/bulan)
- Domain dibeli provider (biaya termasuk).
- Pelanggan lama harga tetap, pelanggan baru boleh lebih mahal.

### Tech Stack & Migrasi
- Awal banyak bahas Supabase + Vercel.
- Kemudian disadari free tier hampir tidak berguna untuk komersial.
- Final recommendation: Stack yang **portable** agar migrasi hanya ganti infra, bukan rewrite kode.
- Rekomendasi akhir: Next.js + Turborepo + Neon/PlanetScale + Railway/Render + Cloudflare + Drizzle + Ably (bisa mulai dengan Supabase Realtime dulu).

### Domain & Self-Service
- Provider beli domain.
- Struktur: `domain.com` (Customer) | `admin.domain.com` | `owner.domain.com`
- Onboarding dengan preview real-time + otomatis domain + subdomain + deploy.

### Admin App
- Kamu tekankan: Saat ini hanya butuh **1 app** untuk kasir + dapur karena UMKM biasanya hanya 1-2 karyawan per outlet.
- Owner Dashboard baru benar-benar dibutuhkan untuk komersial atau saat brand sendiri sudah besar.

---

## 1. Tech Stack Terbaik dari Awal (Future-Proof)

**Stack Final yang Direkomendasikan (Minimal Migration Pain)**

**Core**
- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind v4 + shadcn/ui
- Turborepo (monorepo)

**Data Layer**
- Database: Neon Postgres atau PlanetScale (serverless Postgres)
- ORM: Drizzle ORM
- Realtime: Ably atau Pusher (bisa mulai pakai Supabase Realtime dulu dengan abstraction)

**Auth**
- Better Auth atau Clerk

**Hosting**
- Frontend: Vercel
- Backend / Jobs: Railway atau Render (container)
- Domain & Edge: Cloudflare (Registrar + Workers + DNS)

**Lainnya**
- Payments: Xendit / Midtrans
- Storage: Cloudflare R2
- Email: Resend
- Monitoring: Sentry + PostHog
- AI: Google Gemini

**Alasan Stack Ini Terbaik**
- Next.js + Postgres = sangat portable.
- Bisa deploy hari ini di Vercel + Railway.
- Besok bisa pindah ke AWS ECS + Aurora tanpa mengubah logic bisnis besar-besaran.
- Cocok untuk solo dev + AI coding.
- Biaya predictable di tahap awal-menengah.

**Rencana Migrasi (Hanya Ganti Infra)**
- Fase 1 (0-80 tenant): Vercel + Neon + Railway + Cloudflare
- Fase 2 (80-250 tenant): Tambah Workers, optimasi
- Fase 3 (250+ tenant): Pindah backend ke AWS/GCP container, DB ke Aurora, Auth ke WorkOS jika perlu.

---

## 2. Halaman & Fitur Detail per Role (Enterprise Level)

### Customer App (Pelanggan)
- Home/Landing (branding tenant, menu highlight, cara order, peta)
- Menu (filter, search, sort, badge)
- Menu Detail (varian telur/isian, topping, extra, catatan)
- Cart
- Checkout (nama, HP, pickup/delivery + peta, metode bayar, promo)
- Tracking (status real-time)
- About, Contact, FAQ, Gallery, Promo, Catering (opsional)
- AI Chatbot

### Admin/Karyawan App (Kasir + Dapur Gabungan)
- Login + Buka Shift (uang modal laci)
- Dashboard Real-time (Order Queue + Order Detail + alarm)
- Update status order, verifikasi QRIS manual, cancel
- Dapur Checklist (menu yang harus diproduksi + bahan)
- Waste logging
- Rekap Harian + tutup shift + thermal print + kirim WA ke owner
- Toggle availability menu/topping
- Riwayat & audit sederhana

### Owner Dashboard (Executive)
- Executive Cockpit (KPI, chart, AI insights, alerts)
- Branches Management + benchmarking + transfer stok
- Menu & Recipe (BOM + HPP + Menu Engineering + deploy per cabang)
- Inventory, Waste, Procurement, Supplier
- Finance (P&L, cash flow, shift reconciliation, tax/e-Faktur)
- Production Planning (AI)
- Sales & Customer Analytics
- HR & Shift Overview
- Approvals & Full Audit Logs
- AI Insights & Forecasting (demand, what-if, anomaly, natural language)
- Settings (branding, user management, integration, billing)

Semua halaman di atas sudah dirancang agar terasa **enterprise professional** tapi tetap sederhana untuk owner gaptek.

---

## 3. Estimasi Biaya yang Dibayarkan User (UMKM)

**Harga Awal Launch**
- Startup (1 cabang + full enterprise): Rp500.000 awal + Rp200.000/bulan
- Professional (maks 3 cabang + full): Rp800.000 awal + Rp200.000/bulan
- Enterprise: Rp1.000.000 awal + Rp200.000/bulan + custom

**Tahun Berikutnya**
- Pelanggan lama: Harga tetap (minimal 2 tahun)
- Pelanggan baru: Naik 20-40% (Startup Rp250-299rb/bulan)

**Yang Termasuk Harga**
- 3 aplikasi lengkap
- Domain + subdomain (provider beli)
- Hosting & database
- Update fitur
- Support WA

---

## 4. Penjelasan Tambahan Penting

### Multi-Tenant & Self-Service
- Semua data pakai `tenant_id` + Row Level Security.
- Onboarding: Bayar → Isi form → Preview real-time (tampilkan domain + subdomain) → Sistem otomatis beli domain, setup Vercel domain, seed template, buat user owner.

### Domain Strategy
- Provider beli domain utama.
- Struktur yang disepakati: `domain.com` (Customer), `admin.domain.com`, `owner.domain.com`.

### Quota & Scaling (Paling Sering Ditanyakan)
- Free Vercel & Supabase **hampir tidak berguna** untuk komersial (maks 3-7 tenant sangat kecil).
- Langsung mulai dengan Pro tier.
- Trigger upgrade/migrasi ada di dokumen migrasi terpisah (lihat bagian bawah).

### Indonesia Specific
- QRIS (manual → dynamic)
- e-Faktur Coretax
- PPN 11/12
- WhatsApp Business API
- Bahasa Indonesia utama

### Roadmap Singkat dari Nol
- Minggu 1-3: Monorepo + multi-tenant dasar + auth
- Minggu 4-7: Customer + Admin lengkap
- Minggu 8-10: Owner Dashboard + inventory + recipe + AI
- Minggu 11-12: Self-service onboarding + domain automation
- Minggu 13+: Polish + early access

---

## File Pendukung yang Sudah Dibuat Selama Obrolan

- `Final-Full-SaaS-Design-FnB-UMKM-Enterprise.md` (desain lengkap sebelumnya)
- `Migration-Plan-Quotas-and-Scaling.md` (rencana migrasi detail)
- `Free-Tier-Quotas-and-Tech-Stack-Assessment.md` (kuota free + penilaian stack)
- `Complete-Blueprint-From-Scratch-Enterprise-SaaS-FnB.md` (blueprint halaman & fitur)
- `Self-Service-Architecture-and-Pricing-Update.md`
- `Domain-Subdomain-Setup-Guide.md`
- `Commercial-Scheme-Recommendation.md`
- `Pricing-Scheme-2026.md`

---

## Cara Menggunakan Dokumen Ini

1. Simpan file ini di repo proyek kamu.
2. Ketika pindah ke obrolan baru, cukup upload/copy-paste dokumen ini sebagai konteks awal.
3. Gunakan sebagai single source of truth untuk semua keputusan arsitektur, pricing, fitur, dan roadmap.

---

**Dokumen ini sudah mencakup 100% obrolan kita** (dari analisis app existing, diskusi pricing, tech stack, halaman detail, self-service, domain, kuota, migrasi, hingga blueprint final).

Jika ada bagian yang ingin ditambahkan, dikoreksi, atau dipecah menjadi dokumen pendukung baru (misalnya full database schema, contoh kode, atau cost spreadsheet), langsung beri tahu. Saya siap melanjutkan.

Semoga dokumen ini membantu kamu tetap konsisten meskipun obrolan ini berakhir atau dipindah. Semangat membangunnya! 🚀

**File utama ini tersimpan di:**  
`/home/user/docs/Master-Conversation-Summary-and-Final-Blueprint.md`