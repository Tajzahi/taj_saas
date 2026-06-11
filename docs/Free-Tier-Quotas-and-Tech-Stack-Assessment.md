# Free Tier Quotas Detail + Tech Stack Assessment (From Scratch Recommendation)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Konteks:** Solo developer membangun SaaS F&B untuk UMKM Indonesia (fokus Surabaya). Multi-tenant, 3 aplikasi (Customer, Admin gabungan Kasir+Dapur, Owner), self-service, enterprise fitur tapi mudah digunakan.

---

## 1. Vercel Free Tier (Hobby) – Detail Realistis

**Status Resmi (2026):**
- **TIDAK BOLEH** digunakan untuk proyek komersial (melanggar Terms of Service Vercel).
- Hanya untuk personal projects, portfolio, atau testing.

**Batas Kuota Hobby:**
- Bandwidth: **100 GB per bulan**
- Edge Function invocations: **100.000 per hari**
- Build time: **6 jam per bulan**
- Team members: **1 orang**
- Storage (Blob): **256 MB**
- Serverless Function execution: Terbatas (cold start sering, timeout rendah)

**Berapa yang Bisa Ditampung di Hobby? (Estimasi untuk Aplikasi Kamu)**

Untuk kasus F&B UMKM (order + realtime status + tracking):

- **Tenant (Owner UMKM):** Maksimal **3–5 tenant** kecil jika semua traffic ringan.
- **Order per hari total:** Maksimal **200–400 order/hari** (jika pakai banyak Edge Function untuk realtime).
- **Realtime connection:** Sering timeout setelah ~50–80 concurrent users (pelanggan + kasir).
- **Admin/Karyawan aktif:** Maksimal 10–15 orang total.

**Kesimpulan Praktis:**
Hobby **hampir tidak berguna** untuk launch komersial, bahkan untuk 1–2 tenant pertama. Kamu akan kena limit sangat cepat dan melanggar ToS.

**Rekomendasi:**
Langsung mulai dengan **Vercel Pro** ($20 per user/bulan) sejak hari pertama launch komersial.

---

## 2. Supabase Free Tier – Detail Realistis

**Batas Kuota Free (2026):**
- Database size: **500 MB**
- File storage: **1 GB**
- Bandwidth: **2 GB per bulan**
- Compute: Shared (pauses otomatis setelah ~1 jam tidak aktif)
- Realtime: ~**200 concurrent connections** (sangat terbatas)
- Auth users: Terbatas
- Edge Functions: Sangat terbatas

**Berapa yang Bisa Ditampung di Free Tier? (Estimasi untuk Aplikasi Kamu)**

Untuk aplikasi F&B multi-tenant (menu, order, shift, realtime status, inventory dasar):

- **Tenant (Owner UMKM):** **Maksimal 3–7 tenant** kecil (1 cabang masing-masing).
- **Order per hari total:** **Maksimal 150–300 order/hari**.
- **Active Admin/Karyawan:** **Maksimal 8–12 orang** total.
- **End customer concurrent:** **Maksimal 30–50 orang** (karena realtime connection limit).
- **Database growth:** Menu + order history 1–2 bulan sudah bisa mendekati 500 MB jika banyak varian dan foto.

**Masalah Besar di Free Tier:**
- Database sering pause → pengalaman buruk untuk kasir (loading lambat).
- Realtime (order masuk otomatis ke Admin) sering putus.
- Bandwidth 2 GB sangat cepat habis jika ada beberapa tenant dengan order + tracking.

**Kesimpulan Praktis:**
Free tier Supabase **hanya cocok untuk pure development/testing** (1 tenant dummy).

**Rekomendasi:**
Langsung pakai **Supabase Pro** sejak kamu mulai punya 1–2 tenant sungguhan yang bayar.

---

## 3. Kapan Harus Upgrade Tier (Realistis untuk Bisnismu)

### Vercel
- **Hari pertama launch komersial:** Langsung ke **Pro**.
- **Upgrade ke Enterprise:** Saat biaya Pro + overage > Rp 8–10 juta/bulan **atau** butuh SLA tinggi.

### Supabase
- **Saat launch:** Langsung **Pro** ($25+/bulan).
- **Naik ke Team:** Saat salah satu kondisi ini terpenuhi:
  - Database > 400–450 MB
  - Bandwidth mendekati 40–45 GB/bulan
  - Realtime connection sering error (biasanya di 40–60 tenant aktif)
  - Total order > 3.000–4.000 per hari

**Estimasi Biaya Awal (Realistis):**
- Vercel Pro + Supabase Pro: **Rp 700.000 – Rp 1.200.000 per bulan** untuk 10–20 tenant pertama.
- Ini masih sangat masuk akal dengan harga yang kamu tetapkan (Rp 200rb/bulan per tenant).

---

## 4. Penilaian Tech Stack Saat Ini (Next.js + Supabase + Vercel)

**Stack yang sedang dibahas:**
- Frontend: Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui
- Monorepo: Turborepo
- Backend/DB: Supabase (Postgres + Auth + Realtime + Storage)
- Hosting: Vercel
- Domain: Cloudflare

**Penilaian Jujur:**

**Sangat Cocok untuk Tahap Awal (0 – 100 tenant):**
- Sangat produktif untuk solo dev + AI coding partner.
- DX (developer experience) terbaik di kelasnya.
- Realtime built-in sangat cocok untuk order queue kasir.
- RLS (Row Level Security) cocok untuk multi-tenant.
- Biaya rendah di awal.

**Kelemahan untuk Jangka Panjang (200+ tenant / Skala Besar):**
- Vercel bisa jadi mahal karena usage-based (bandwidth + function).
- Supabase realtime pricing bisa meledak.
- Vendor lock-in sedang (meski Postgres-nya portable).
- Sulit untuk background jobs berat, WebSocket persistent, atau compliance tinggi.

**Kesimpulan:**
Stack ini **bagus sebagai starting stack**, tapi **bukan yang paling future-proof** jika kamu benar-benar ingin scale ke ratusan tenant dengan biaya terkendali.

---

## 5. Rekomendasi Tech Stack dari Awal (Lebih Cocok & Future-Proof)

Karena kamu bilang **"saya siap membuat dari awal"**, ini adalah rekomendasi stack yang lebih baik:

### Stack yang Direkomendasikan (Dari Nol)

**Frontend (Tetap Kuat):**
- Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui
- Turborepo (monorepo) — wajib dari hari pertama

**Backend & Database (Lebih Fleksibel):**
- **Database:** Neon Postgres (serverless Postgres) atau PlanetScale
  - Alasan: Lebih murah & scalable dibanding Supabase di skala menengah, branching bagus untuk multi-tenant.
- **ORM:** Drizzle ORM (lebih ringan & type-safe dibanding Prisma)
- **Auth:** Better Auth atau Clerk (lebih fleksibel daripada Supabase Auth)
- **Realtime:** Ably atau Pusher (jika Supabase realtime terlalu mahal nanti)
- **Storage:** Cloudflare R2 atau Supabase Storage (bisa diganti mudah)

**Hosting & Infra:**
- **Frontend:** Vercel (tetap terbaik untuk Next.js)
- **Backend / API:** Railway atau Render (container pricing lebih predictable)
- **Edge / DNS:** Cloudflare (tetap terbaik)

**Lainnya:**
- Payments: Xendit / Midtrans (dengan webhook)
- Email: Resend
- Monitoring: Sentry + PostHog
- Background Jobs: Trigger.dev atau Inngest

### Mengapa Stack Ini Lebih Cocok?

- Mulai dengan **Vercel + Neon + Railway** = biaya lebih predictable daripada Supabase + Vercel combo.
- Lebih mudah migrasi nanti ke AWS/GCP jika sudah besar.
- Masih sangat mudah untuk solo dev + AI.
- Realtime bisa dipilih (bisa pakai Supabase Realtime dulu, lalu ganti ke Ably kalau mahal).

**Migration Path yang Sudah Dipikirkan dari Awal:**
- Phase 1 (0-80 tenant): Vercel + Neon + Railway
- Phase 2 (80-250 tenant): Tambah Cloudflare Workers untuk beberapa logic
- Phase 3 (250+ tenant): Pindah backend ke AWS ECS / Cloud Run + Aurora

---

## 6. Rekomendasi Praktis untuk Kamu

1. **Jangan pakai free tier** untuk launch komersial (kecuali pure testing 1 tenant dummy).
2. **Langsung pakai Pro tier** sejak hari pertama kamu punya pelanggan bayar.
3. **Pilih stack yang future-proof dari awal** (Neon + Railway lebih baik daripada Supabase + Vercel murni untuk jangka menengah).
4. **Mulai dengan monorepo** sekarang (jangan buat 3 project terpisah seperti sekarang).
5. **Siapkan monitoring** sejak awal (Supabase/Vercel dashboard + PostHog) agar tahu kapan mendekati limit.

---

**Kesimpulan Langsung:**

- Free tier Vercel & Supabase **hanya untuk eksperimen**. Untuk bisnis nyata, langsung Pro.
- Stack Next.js + Supabase + Vercel **cukup bagus** untuk awal, tapi **bisa lebih baik** jika kamu mau rebuild dari nol.
- Rekomendasi stack baru di atas lebih cocok untuk perjalanan dari solo dev hingga scale menengah dengan biaya lebih terkendali.

Mau saya buatkan:
- Perbandingan biaya detail antara "Supabase + Vercel" vs "Neon + Railway" untuk 50 tenant dan 150 tenant?
- Atau langsung buatkan struktur monorepo + database schema yang sudah disesuaikan dengan stack baru?

Langsung bilang apa yang kamu butuhkan selanjutnya. Saya siap bantu buat dari awal dengan rancangan yang lebih matang.