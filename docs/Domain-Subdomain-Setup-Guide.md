# Panduan Domain & Subdomain untuk SaaS F&B

**Tujuan Dokumen:** Menjelaskan cara kerja domain dan subdomain agar UMKM paham, serta panduan teknis setup untuk developer.

---

## 1. Konsep Dasar Domain & Subdomain

### Domain Utama (Main Domain)
Contoh: `martabakpakde.com`

Ini adalah domain yang dibeli UMKM. Biasanya digunakan untuk **Customer Portal** (situs yang dilihat pelanggan untuk order).

### Subdomain
Contoh:
- `admin.martabakpakde.com`
- `owner.martabakpakde.com`
- `app.martabakpakde.com`

Subdomain adalah "cabang" dari domain utama. **Tidak perlu beli domain baru** untuk membuat subdomain.

**Kesimpulan penting:**
- Klien hanya perlu beli **1 domain utama**.
- Subdomain bisa dibuat sebanyak mungkin **gratis** (hanya butuh setup DNS).

---

## 2. Rekomendasi Struktur Domain (Berdasarkan Diskusi Kita)

| Tujuan                  | Domain yang Disarankan          | Siapa yang Akses                  | Alasan |
|-------------------------|----------------------------------|-----------------------------------|--------|
| **Customer Portal**     | `martabakpakde.com`             | Pelanggan                         | Branding utama, mudah diingat |
| **Admin / Kasir**       | `admin.martabakpakde.com`       | Kasir & staff operasional         | Terpisah dari customer |
| **Owner Dashboard**     | `owner.martabakpakde.com`       | Pemilik bisnis                    | Fokus pada laporan & strategi |

**Alternatif lain yang juga bagus:**
- `app.martabakpakde.com` (gabungan Admin + Owner)
- `kasir.martabakpakde.com`

Saya sarankan pakai `admin.` dan `owner.` karena lebih jelas perbedaan perannya.

---

## 3. Cara Mendapatkan Subdomain (Domainesia)

### Langkah-langkah (untuk Klien / Developer):

1. **Beli Domain Utama**
   - Beli di Domainesia, Hostinger, Namecheap, dll.
   - Contoh: `martabakpakde.com`

2. **Masuk ke Dashboard Domainesia**
   - Setelah domain aktif, masuk ke panel Domainesia.

3. **Buat Subdomain**
   - Cari menu **DNS Management** atau **Advanced DNS**.
   - Tambahkan record baru:
     - Type: **CNAME**
     - Host/Name: `admin` (atau `owner`)
     - Value/Target: `nama-proyek.vercel.app` (atau custom domain yang sudah di Vercel)
     - TTL: Default atau 3600

4. **Setup di Vercel**
   - Masuk ke project Vercel (Customer / Admin / Owner).
   - Pergi ke **Settings → Domains**.
   - Tambahkan domain:
     - `admin.martabakpakde.com`
   - Vercel akan memberikan instruksi DNS (biasanya 1 CNAME record).
   - Tunggu propagasi (bisa 5 menit – 48 jam, biasanya cepat).

**Catatan Penting:**
- Subdomain **tidak perlu dibeli lagi**. Cukup tambah record DNS di domain utama.
- Biaya subdomain = Rp0 (selama domain utama aktif).

---

## 4. Rekomendasi Teknis untuk Developer (Vercel + Supabase)

### Struktur Project yang Disarankan:

**Opsi 1 (Paling Direkomendasikan untuk Solo Dev):**
- **1 Monorepo** (menggunakan Turborepo atau Nx)
  - `apps/customer` → `martabakpakde.com`
  - `apps/admin` → `admin.martabakpakde.com`
  - `apps/owner` → `owner.martabakpakde.com`

**Opsi 2 (Sederhana, seperti sekarang):**
- 3 project terpisah di Vercel:
  - Customer Project → domain utama
  - Admin Project → subdomain admin
  - Owner Project → subdomain owner

### Multi-Tenant Handling:
Semua project tetap menggunakan **1 Supabase project** dengan RLS berbasis `tenant_id`.

---

## 5. Contoh Alur Setup untuk Klien Baru

1. Klien beli domain `namabisnis.com` di Domainesia.
2. Klien bayar paket (Basic/Professional/Enterprise).
3. Developer bantu setup:
   - Buat tenant baru di database.
   - Buat 3 project di Vercel (atau deploy ke monorepo).
   - Bantu klien tambahkan 2–3 record DNS di Domainesia.
   - Verifikasi domain.
4. Klien sudah bisa akses:
   - `namabisnis.com` (Customer)
   - `admin.namabisnis.com` (Kasir)
   - `owner.namabisnis.com` (Owner)

---

## 6. Pertanyaan Umum

**Q: Apakah subdomain berpengaruh ke SEO?**  
A: Subdomain sedikit berbeda dengan subfolder. Untuk Customer Portal, domain utama lebih baik untuk SEO. Subdomain admin/owner tidak masalah karena bukan untuk publik.

**Q: Berapa lama subdomain aktif setelah setup DNS?**  
A: Biasanya 5–30 menit. Kadang sampai 2 jam.

**Q: Bisa pakai domain gratis dulu (seperti .vercel.app)?**  
A: Bisa untuk testing, tapi untuk komersial sangat tidak disarankan. UMKM lebih percaya kalau pakai domain sendiri.

---

## Rekomendasi Akhir

- Gunakan struktur:
  - `domainutama.com` → Customer
  - `admin.domainutama.com` → Admin/Kasir
  - `owner.domainutama.com` → Owner Dashboard

- Bantu klien setup DNS di 1–2 kali pertama (bisa dijadikan value added).
- Buat dokumentasi singkat "Cara Menambahkan Subdomain" dalam bahasa Indonesia yang sangat sederhana.

Mau saya buatkan template dokumentasi untuk klien (bahasa Indonesia, sangat mudah dipahami)?