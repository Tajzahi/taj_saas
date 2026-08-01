# 🛡️ Taj SaaS - Zero-Miss Code Review & Quality Assurance Guide

Dokumen panduan standar kualitas kode dan tata cara pengecekan (*code review*) baris per baris secara mendalam untuk platform **Taj SaaS (Enterprise Multi-Tenant F&B SaaS Platform)**. 

Panduan ini dirancang menggunakan **Framework 5-Lapis (5-Layer Quality Assurance Framework)** untuk menjamin bahwa seluruh kode bebas dari kesalahan (*zero-miss*), aman dari kebocoran data multi-tenant, akurat dalam kalkulasi keuangan/F&B, dan bebas dari kendala performa.

---

## 📑 Daftar Isi
1. [Prinsip Utama Zero-Miss Engineering](#1-prinsip-utama-zero-miss-engineering)
2. [Lapis 1: Static Analysis & Strict Type Safety](#2-lapis-1-static-analysis--strict-type-safety)
3. [Lapis 2: Verifikasi Logika Bisnis & Kalkulasi Finansial F&B](#3-lapis-2-verifikasi-logika-bisnis--kalkulasi-finansial-fb)
4. [Lapis 3: Keamanan & Isolasi Data Multi-Tenant (RBAC)](#4-lapis-3-keamanan--isolasi-data-multi-tenant-rbac)
5. [Lapis 4: Optimasi Query Database & Penanganan Error](#5-lapis-4-optimasi-query-database--penanganan-error)
6. [Lapis 5: Pengujian Otomatis & Regresi (Unit & E2E Test)](#6-lapis-5-pengujian-otomatis--regresi-unit--e2e-test)
7. [Checklist Mandiri Sebelum Merge / Deploy](#7-checklist-mandiri-sebelum-merge--deploy)

---

## 1. Prinsip Utama Zero-Miss Engineering

1. **Never Guess, Always Inspect:** Jangan pernah berasumsi tentang tipe data, schema database, atau respons API tanpa mengecek file definisi resminya di `@taj-saas/db/schema.ts` atau `@taj-saas/shared`.
2. **Explicit Multi-Tenant Scoping:** Setiap transaksi data WAJIB terikat secara eksplisit ke `tenantId`.
3. **No Silent Error Swallowing:** Jangan pernah menangkap exception tanpa mencatat log atau mengembalikan pesan respons yang informatif.
4. **Separation of Concerns:** Kode antarmuka UI (`client components`) hanya menangani render tampilan, sedangkan kalkulasi sensitif dan query database dilakukan di `Server Actions` atau `API Routes`.

---

## 2. Lapis 1: Static Analysis & Strict Type Safety

Lapis pertama bertujuan memastikan tidak ada kesalahan sintaks, tipe data tak valid (`undefined`/`null` pointer crash), atau variabel tak terpakai.

### 📋 Checklist Pengecekan Baris per Baris:
- [ ] **Strict Mode Standard:** Pastikan `"strict": true` aktif di `tsconfig.json`.
- [ ] **Bebas dari `any`:** Dilarang keras menggunakan tipe `any`. Gunakan tipe eksplisit, Drizzle schema types (`typeof schema.orders.$inferSelect`), atau generik TypeScript.
- [ ] **Pengecekan Null Safe:** Selalu gunakan *optional chaining* (`?.`) dan *nullish coalescing operator* (`??`) saat mengakses properti opsional (misal: `order.deliveryAddress ?? '-'`).
- [ ] **Definisi Return Type Action:** Setiap Server Action wajib mendeklarasikan tipe kembalian yang konsisten:
  ```ts
  type ActionResponse<T> = 
    | { success: true; data: T }
    | { success: false; error: string; data?: null };
  ```
- [ ] **Kompilasi TypeScript Bebas Error:** Jalankan perintah kompilasi sebelum menyimpan kode:
  ```bash
  npx tsc --noEmit
  ```

---

## 3. Lapis 2: Verifikasi Logika Bisnis & Kalkulasi Finansial F&B

Lapis kedua memastikan seluruh kalkulasi keuangan, diskon, HPP (COGS), dan pemotongan stok inventori 100% akurat sesuai prinsip akuntansi F&B.

### 📋 Checklist Traceability & Kalkulasi:

#### A. Pelacakan Alur Data (Data Traceability)
Uji alur data secara linier dari 4 titik:
$$\text{Form Input UI} \longrightarrow \text{Server Action / API} \longrightarrow \text{Database Query} \longrightarrow \text{Kalkulasi Output UI}$$

#### B. Formula Matematika Akuntansi & F&B:
1. **Pendapatan Bersih (Net Revenue):**
   $$\text{Net Revenue} = \text{Subtotal Produk} + \text{Ongkos Kirim} - \text{Diskon Promo}$$
2. **HPP / COGS (Cost of Goods Sold):**
   $$\text{Total HPP} = \sum (\text{Qty Terjual} \times \text{Harga Modal Resep BOM})$$
3. **Laba Kotor (Gross Profit) & Margin (%):**
   $$\text{Gross Profit} = \text{Net Revenue} - \text{Total HPP}$$
   $$\text{Gross Profit Margin (\%)} = \left( \frac{\text{Gross Profit}}{\text{Net Revenue}} \right) \times 100$$
4. **Laba Bersih (Net Profit):**
   $$\text{Net Profit} = \text{Gross Profit} - \text{Biaya Operasional (OPEX)}$$

#### C. Matriks Pengujian Nilai Batas (Boundary Value Testing):
- [ ] **Pesanan Dibatalkan (`cancelled`):** Pastikan pesanan batal diabaikan dari perhitungan Omset, HPP, dan Laba Rugi PnL.
- [ ] **Batas Diskon:** Pastikan nilai diskon tidak boleh melebihi nilai subtotal (tidak boleh menghasilkan angka pembayaran negatif).
- [ ] **Pemotongan Stok BOM:** Saat pesanan selesai, pastikan stok bahan baku di tabel `inventory` berkurang secara proposional berdasarkan `quantity` di `recipe_ingredients`.
- [ ] **Pembulatan Uang:** Gunakan `Math.round()` atau `numeric(10, 2)` untuk menghindari angka desimal mengambang (*floating point precision issue* seperti `10000.000000000002`).

---

## 4. Lapis 3: Keamanan & Isolasi Data Multi-Tenant (RBAC)

Lapis ketiga menjamin bahwa data milik Tenant A tidak pernah bisa diakses atau diubah oleh Tenant B (*Cross-Tenant Isolation*), serta peran pengguna diverifikasi dengan ketat.

### 📋 Checklist Keamanan & Multi-Tenant:
- [ ] **Wajib Filter `tenantId` pada Setiap Query:**
  Setiap query `select()`, `update()`, dan `delete()` pada tabel bisnis WAJIB menyertakan `tenantId`:
  ```ts
  // ✅ BENAR (Scoped per Tenant)
  await db.select().from(schema.orders).where(
    and(
      eq(schema.orders.tenantId, tenantId),
      eq(schema.orders.id, orderId)
    )
  );

  // ❌ SALAH (Rentan Kebocoran Data Multi-Tenant)
  await db.select().from(schema.orders).where(eq(schema.orders.id, orderId));
  ```
- [ ] **Verifikasi Peran Pengguna (RBAC Middleware & Actions):**
  - Route `/owner` hanya boleh diakses pengguna dengan `role === 'owner'` atau `'superadmin'`.
  - Route `/admin` hanya boleh diakses pengguna dengan `role === 'kasir'`, `'manager'`, atau `'owner'`.
- [ ] **Otentikasi Server-Side:** Jangan mempercayai `tenantId` atau `userId` yang dikirim dari `body` client-side. Ambil `tenantId` selalu dari header terenkripsi middleware (`x-tenant-id`) atau sesi terverifikasi.

---

## 5. Lapis 4: Optimasi Query Database & Penanganan Error

Lapis keempat memastikan aplikasi memiliki respon yang cepat (bebas dari N+1 Query Problem) dan tangguh terhadap kegagalan jaringan/database.

### 📋 Checklist Performa & Robustness:
- [ ] **Eliminasi N+1 Query Problem:**
  Dilarang melakukan loop query di dalam `map` atau `forEach`. Gunakan `inArray` atau relational queries:
  ```ts
  // ✅ BENAR (Batch Query - 2 Roundtrips)
  const orderIds = orders.map(o => o.id);
  const items = await db.select().from(schema.orderItems).where(inArray(schema.orderItems.orderId, orderIds));

  // ❌ SALAH (N+1 Query Problem - 100+ Roundtrips)
  const ordersWithItems = await Promise.all(orders.map(async (o) => {
    const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, o.id));
    return { ...o, items };
  }));
  ```
- [ ] **Gunakan Indeks Database:** Pastikan tabel yang sering di-query menggunakan kolom ber-indeks (`tenantId_idx`, `branchId_idx`, `code_idx`).
- [ ] **Error Boundary & Graceful Degradation:**
  - Bungkus seluruh Server Action dengan blok `try-catch`.
  - Sediakan fallback yang aman jika service pihak ketiga (seperti Ably Realtime) sedang terputus, sehingga aplikasi utama tetap bisa berjalan.

---

## 6. Lapis 5: Pengujian Otomatis & Regresi (Unit & E2E Test)

Lapis kelima memastikan bahwa fitur yang sudah stabil tidak mengalami kerusakan saat ada penambahan fitur baru di masa mendatang.

### 📋 Strategi Pengujian Otomatis:
1. **Unit Testing (Fungsi Murni):**
   - Buat unit test untuk fungsi kalkulasi finansial (`getPnLAction`, `getRevenueOverviewAction`).
   - Buat unit test untuk validasi promo (`validatePromo`).
2. **End-to-End Testing (Playwright):**
   - Jalankan pengujian alur kritis pengguna secara otomatis:
     - **Flow 1:** Pelanggan checkout menu $\rightarrow$ Status order tersimpan `received`.
     - **Flow 2:** Kasir menerima notifikasi real-time $\rightarrow$ Update status ke `completed` $\rightarrow$ Kas masuk ke shift.
     - **Flow 3:** Owner membuka dashboard $\rightarrow$ Grafik omset & PnL bertambah secara real-time.

---

## 7. Checklist Mandiri Sebelum Merge / Deploy

Gunakan checklist ringkas ini sebelum melakukan commit atau membuat Pull Request (PR):

- [ ] **Lapis 1:** `npx tsc --noEmit` lulus dengan **0 Error**.
- [ ] **Lapis 2:** Seluruh kalkulasi matematika (Omset, Diskon, Ongkir, PnL) sudah diverifikasi dengan data riil.
- [ ] **Lapis 3:** Seluruh query database memiliki klausa `eq(table.tenantId, tenantId)`.
- [ ] **Lapis 4:** Bebas dari perulangan query N+1 dan semua Server Action memiliki penanganan `try-catch`.
- [ ] **Lapis 5:** Alur utama aplikasi telah diuji coba dan berfungsi dengan lancar.

---
*Dokumen ini merupakan standar resmi penjaminan kualitas kode Taj SaaS.*
