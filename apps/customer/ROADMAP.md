# 🗺️ Roadmap Arsitektur & Catatan Masa Depan: Aplikasi Customer (`apps/customer`)

Dokumen ini adalah **panduan arsitektur resmi** untuk pengembangan aplikasi Customer (E-Menu & Toko Online Pelanggan) seiring bertumbuhnya Taj SaaS dari 1 toko (tahap awal) hingga menampung ratusan restoran di dalam mall digital multi-tenant.

---

## 📌 1. Evolusi Penanganan URL & Alamat Toko (*Tenant Resolution Evolution*)

### Fase 1: Tahap Awal / Toko Tunggal (Saat Ini)
* **URL Bersama Cloud Run:** `https://taj-customer-*.a.run.app/`
* **Mekanisme:**
  * **Preview Toko Spesifik:** Menggunakan query parameter `?preview=slug-toko` (misal: `?preview=martabak-terang-bulan-a6-nyusss`).
  * **Akses Polos Tanpa Parameter:** Sistem secara otomatis memuat tenant pertama yang aktif dari database (*Martabak & Terang Bulan A6 nyusss*).
* **Tujuan:** Pemilik toko dapat langsung melihat etalase online mereka, mencoba keranjang belanja, dan menguji checkout WhatsApp tanpa harus membeli domain di hari pertama.

### Fase 2: Subdomain Wildcard Platform (*Scale-Up Phase*)
* **Format URL:** `https://[slug-toko].tajsaas.id` *(misal: `https://martabak-a6.tajsaas.id`)*
* **Penerapan Teknis:**
  1. Menghubungkan domain platform utama (misal `tajsaas.id`) dengan DNS record CNAME Wildcard (`*.tajsaas.id` $\rightarrow$ Cloud Run Customer).
  2. Pada [packages/shared/index.ts](file:///d:/taj_saas/packages/shared/index.ts), fungsi `parseTenantFromHostname` akan mengekstrak subdomain pertama sebagai `slug`.
* **Kelebihan:** Setiap tenant baru otomatis langsung memiliki alamat web profesional instan tanpa biaya tambahan.

### Fase 3: Custom Domain Mandiri (*Enterprise / Custom Domain Phase*)
* **Format URL:** `https://martabaka6nyusss.com` (domain berbayar milik owner sendiri).
* **Penerapan Teknis:**
  1. Owner memasukkan nama domain pribadinya di menu **Dashboard Owner $\rightarrow$ Pengaturan**.
  2. Kolom `tenants.domain` terisi dengan nama domain tersebut.
  3. Owner menambahkan CNAME ke Cloud Run / Cloudflare Proxy.
  4. Middleware mengenali domain dan langsung menyajikan toko tersebut.

### Fase 4: Halaman Direktori Mall (*Mall Directory Landing Page*)
* **Kondisi:** Saat jumlah restoran di SaaS sudah mencapai 20+ tenant.
* **Mekanisme:**
  * Jika seseorang membuka domain utama `https://tajsaas.id/` atau link mentah Cloud Run tanpa parameter toko:
  * Sistem **tidak lagi** memuat toko tunggal secara otomatis, melainkan menampilkan **Landing Page Direktori Mall**:
    * Kolom pencarian kuliner: *"Cari martabak, kopi, atau restoran di kota Anda"*.
    * Daftar kartu tenant terpopuler dengan tombol *"Kunjungi Toko"*.
    * Tombol ajakan: *"Buka Restoran Anda Sendiri di Taj SaaS"*.

---

## 🍽️ 2. Fitur Dine-in QR Code Meja (*Table Ordering*)

Untuk pelanggan yang memesan langsung di tempat (*dine-in*):
* **Format Standar URL QR Code:**
  ```
  https://taj-customer-*.a.run.app/?preview=slug-toko&table=05
  ```
  *(atau jika sudah custom domain: `https://martabaka6.com/?table=05`)*
* **Penerapan di Aplikasi Customer:**
  * Middleware membaca parameter `table`.
  * Keranjang belanja secara otomatis mengunci `orderType = 'dine_in'` dan `tableNumber = '05'`.
  * Pembeli tidak perlu lagi mengetik nomor meja secara manual saat checkout.

---

## ⚡ 3. Strategi Performa & Caching Skala Besar (*Edge Delivery*)

Saat aplikasi Customer menerima ribuan pesanan serentak di jam makan siang/malam:
1. **In-Memory Cache (5 Menit):**
   * Data `getStoreSettings()`, `getMenuItems()`, dan `getCategories()` sudah diproteksi dengan in-memory cache 300 detik di [apps/customer/lib/db/menuService.ts](file:///d:/taj_saas/apps/customer/lib/db/menuService.ts) untuk menghemat transfer kuota database Neon.
2. **Cache Invalidation Real-Time:**
   * Saat Owner mengubah harga atau menyembunyikan menu di CMS, trigger server action akan memanggil `revalidateTag('menu-items')` atau `revalidatePath('/')` agar menu di sisi pembeli langsung terbarukan seketika.
3. **CDN Kompresi Gambar:**
   * Foto produk martabak dioptimalkan menggunakan komponen `next/image` dengan format WebP otomatis.
