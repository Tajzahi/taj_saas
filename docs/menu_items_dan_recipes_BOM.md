# DATA MENU & RESEP / BOM

Berisi dua tabel relasional:
1. **`menu_items`** — daftar menu yang dijual (harga jual).
2. **`recipes`** (Bill of Materials) — bahan baku + takaran per 1 porsi menu, untuk **pemotongan stok otomatis** & perhitungan **Food Cost (HPP)**.

> Relasi: `recipes.menu_code` → `menu_items.menu_code` ; `recipes.bahan` → daftar **Bahan Baku** (lihat `Daftar_Bahan_Baku_Martabak_dan_Terang_Bulan.md`).
> Takaran memakai **asumsi standar industri** — silakan kalibrasi sesuai resep asli Anda.

---

## TABEL 1 — `menu_items`

| menu_code | nama_menu | kategori | varian/topping | tier | harga_jual (Rp) |
|-----------|-----------|----------|----------------|------|-----------------|
| MTA-01 | Martabak Telur Ayam 1 Butir | Martabak Telur | Ayam 1 butir | Biasa | 20.000 |
| MTA-02 | Martabak Telur Ayam 2 Butir | Martabak Telur | Ayam 2 butir | Biasa | 25.000 |
| MTA-03 | Martabak Telur Ayam 2 Butir Spesial | Martabak Telur | Ayam 2 butir | Spesial | 30.000 |
| MTA-04 | Martabak Telur Ayam 3 Butir | Martabak Telur | Ayam 3 butir | Biasa | 35.000 |
| MTA-05 | Martabak Telur Ayam 3 Butir Spesial | Martabak Telur | Ayam 3 butir | Spesial | 40.000 |
| MTA-06 | Martabak Telur Ayam 4 Butir | Martabak Telur | Ayam 4 butir | Biasa | 45.000 |
| MTA-07 | Martabak Telur Ayam 4 Butir Spesial | Martabak Telur | Ayam 4 butir | Spesial | 50.000 |
| MTA-08 | Martabak Telur Ayam 5 Butir | Martabak Telur | Ayam 5 butir | Biasa | 55.000 |
| MTA-09 | Martabak Telur Ayam 5 Butir Spesial | Martabak Telur | Ayam 5 butir | Spesial | 60.000 |
| MTA-10 | Martabak Telur Ayam 6 Butir | Martabak Telur | Ayam 6 butir | Biasa | 65.000 |
| MTA-11 | Martabak Telur Ayam 6 Butir Spesial | Martabak Telur | Ayam 6 butir | Spesial | 70.000 |
| MTA-12 | Martabak Telur Ayam 7 Butir | Martabak Telur | Ayam 7 butir | Spesial | 75.000 |
| MTB-01 | Martabak Telur Bebek 1 Butir | Martabak Telur | Bebek 1 butir | Biasa | 20.000 |
| MTB-02 | Martabak Telur Bebek 2 Butir | Martabak Telur | Bebek 2 butir | Biasa | 40.000 |
| MTB-03 | Martabak Telur Bebek 3 Butir | Martabak Telur | Bebek 3 butir | Biasa | 50.000 |
| MTB-04 | Martabak Telur Bebek 4 Butir | Martabak Telur | Bebek 4 butir | Biasa | 60.000 |
| MTB-05 | Martabak Telur Bebek 5 Butir | Martabak Telur | Bebek 5 butir | Biasa | 70.000 |
| MTB-06 | Martabak Telur Bebek 6 Butir | Martabak Telur | Bebek 6 butir | Biasa | 80.000 |
| TB-01 | Terang Bulan 2 Variant Topping | Terang Bulan | 2 topping | — | 20.000 |
| TB-02 | Terang Bulan Milo + 1 Topping | Terang Bulan | Milo + 1 topping | — | 25.000 |
| TB-03 | Terang Bulan Oreo + 1 Topping | Terang Bulan | Oreo + 1 topping | — | 25.000 |
| TB-04 | Terang Bulan Nutella + 1 Topping | Terang Bulan | Nutella + 1 topping | — | 30.000 |
| TB-05 | Terang Bulan SilverQueen + 1 Topping | Terang Bulan | SilverQueen + 1 topping | — | 50.000 |
| ADD-TOP | Tambahan Topping (add-on) | Add-on | per 1 topping ekstra | — | 5.000 |

---

## TABEL 2 — `recipes` / BOM

### Asumsi takaran dasar (per komponen)
| Komponen | Biasa | Spesial |
|----------|-------|---------|
| Adonan kulit martabak telur (tepung) | 70 gr tepung/porsi dasar + 15 gr per butir telur | 90 gr tepung/porsi dasar + 20 gr per butir telur |
| Daging sapi giling | 30 gr per butir telur | 45 gr per butir telur |
| Daun bawang | 15 gr per butir telur | 20 gr per butir telur |
| Bawang bombay | 10 gr per butir telur | 12 gr per butir telur |
| Bumbu (garam+merica+penyedap) | 3 gr per butir telur | 4 gr per butir telur |
| Minyak goreng | 25 ml per porsi | 35 ml per porsi |
| Kemasan + acar | 1 set per porsi | 1 set per porsi |

Telur bebek diperlakukan setara **Spesial** (porsi lebih besar/premium).

---

### 2A. BOM MARTABAK TELUR AYAM

| menu_code | bahan | satuan_pakai | qty per porsi | kategori |
|-----------|-------|--------------|---------------|----------|
| **MTA-01 (1 btr, Biasa)** | Tepung Terigu Cakra Kembar | gr | 85 | Bahan Baku |
| | Telur Ayam | butir | 1 | Bahan Baku |
| | Daging Sapi Giling | gr | 30 | Bahan Baku |
| | Daun Bawang | gr | 15 | Bahan Baku |
| | Bawang Bombay | gr | 10 | Bahan Baku |
| | Bumbu campuran (garam/merica/penyedap) | gr | 3 | Bahan Baku |
| | Minyak Goreng | ml | 25 | Bahan Baku |
| | Kotak Kemasan + Plastik + Karet | set | 1 | Kemasan |
| | Acar (timun+cabai+cuka) | porsi | 1 | Topping |
| **MTA-02 (2 btr, Biasa)** | Tepung Terigu Cakra Kembar | gr | 100 | Bahan Baku |
| | Telur Ayam | butir | 2 | Bahan Baku |
| | Daging Sapi Giling | gr | 60 | Bahan Baku |
| | Daun Bawang | gr | 30 | Bahan Baku |
| | Bawang Bombay | gr | 20 | Bahan Baku |
| | Bumbu campuran | gr | 6 | Bahan Baku |
| | Minyak Goreng | ml | 25 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-03 (2 btr, Spesial)** | Tepung Terigu Cakra Kembar | gr | 130 | Bahan Baku |
| | Telur Ayam | butir | 2 | Bahan Baku |
| | Daging Sapi Giling | gr | 90 | Bahan Baku |
| | Daun Bawang | gr | 40 | Bahan Baku |
| | Bawang Bombay | gr | 24 | Bahan Baku |
| | Bumbu campuran | gr | 8 | Bahan Baku |
| | Minyak Goreng | ml | 35 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-04 (3 btr, Biasa)** | Tepung Terigu Cakra Kembar | gr | 115 | Bahan Baku |
| | Telur Ayam | butir | 3 | Bahan Baku |
| | Daging Sapi Giling | gr | 90 | Bahan Baku |
| | Daun Bawang | gr | 45 | Bahan Baku |
| | Bawang Bombay | gr | 30 | Bahan Baku |
| | Bumbu campuran | gr | 9 | Bahan Baku |
| | Minyak Goreng | ml | 25 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-05 (3 btr, Spesial)** | Tepung Terigu Cakra Kembar | gr | 150 | Bahan Baku |
| | Telur Ayam | butir | 3 | Bahan Baku |
| | Daging Sapi Giling | gr | 135 | Bahan Baku |
| | Daun Bawang | gr | 60 | Bahan Baku |
| | Bawang Bombay | gr | 36 | Bahan Baku |
| | Bumbu campuran | gr | 12 | Bahan Baku |
| | Minyak Goreng | ml | 35 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-06 (4 btr, Biasa)** | Tepung Terigu Cakra Kembar | gr | 130 | Bahan Baku |
| | Telur Ayam | butir | 4 | Bahan Baku |
| | Daging Sapi Giling | gr | 120 | Bahan Baku |
| | Daun Bawang | gr | 60 | Bahan Baku |
| | Bawang Bombay | gr | 40 | Bahan Baku |
| | Bumbu campuran | gr | 12 | Bahan Baku |
| | Minyak Goreng | ml | 30 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-07 (4 btr, Spesial)** | Tepung Terigu Cakra Kembar | gr | 170 | Bahan Baku |
| | Telur Ayam | butir | 4 | Bahan Baku |
| | Daging Sapi Giling | gr | 180 | Bahan Baku |
| | Daun Bawang | gr | 80 | Bahan Baku |
| | Bawang Bombay | gr | 48 | Bahan Baku |
| | Bumbu campuran | gr | 16 | Bahan Baku |
| | Minyak Goreng | ml | 40 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-08 (5 btr, Biasa)** | Tepung Terigu Cakra Kembar | gr | 145 | Bahan Baku |
| | Telur Ayam | butir | 5 | Bahan Baku |
| | Daging Sapi Giling | gr | 150 | Bahan Baku |
| | Daun Bawang | gr | 75 | Bahan Baku |
| | Bawang Bombay | gr | 50 | Bahan Baku |
| | Bumbu campuran | gr | 15 | Bahan Baku |
| | Minyak Goreng | ml | 30 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-09 (5 btr, Spesial)** | Tepung Terigu Cakra Kembar | gr | 190 | Bahan Baku |
| | Telur Ayam | butir | 5 | Bahan Baku |
| | Daging Sapi Giling | gr | 225 | Bahan Baku |
| | Daun Bawang | gr | 100 | Bahan Baku |
| | Bawang Bombay | gr | 60 | Bahan Baku |
| | Bumbu campuran | gr | 20 | Bahan Baku |
| | Minyak Goreng | ml | 40 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-10 (6 btr, Biasa)** | Tepung Terigu Cakra Kembar | gr | 160 | Bahan Baku |
| | Telur Ayam | butir | 6 | Bahan Baku |
| | Daging Sapi Giling | gr | 180 | Bahan Baku |
| | Daun Bawang | gr | 90 | Bahan Baku |
| | Bawang Bombay | gr | 60 | Bahan Baku |
| | Bumbu campuran | gr | 18 | Bahan Baku |
| | Minyak Goreng | ml | 35 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-11 (6 btr, Spesial)** | Tepung Terigu Cakra Kembar | gr | 210 | Bahan Baku |
| | Telur Ayam | butir | 6 | Bahan Baku |
| | Daging Sapi Giling | gr | 270 | Bahan Baku |
| | Daun Bawang | gr | 120 | Bahan Baku |
| | Bawang Bombay | gr | 72 | Bahan Baku |
| | Bumbu campuran | gr | 24 | Bahan Baku |
| | Minyak Goreng | ml | 45 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTA-12 (7 btr, Spesial)** | Tepung Terigu Cakra Kembar | gr | 230 | Bahan Baku |
| | Telur Ayam | butir | 7 | Bahan Baku |
| | Daging Sapi Giling | gr | 315 | Bahan Baku |
| | Daun Bawang | gr | 140 | Bahan Baku |
| | Bawang Bombay | gr | 84 | Bahan Baku |
| | Bumbu campuran | gr | 28 | Bahan Baku |
| | Minyak Goreng | ml | 50 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |

---

### 2B. BOM MARTABAK TELUR BEBEK
(diperlakukan setara tier Spesial: adonan & daging lebih banyak)

| menu_code | bahan | satuan_pakai | qty per porsi | kategori |
|-----------|-------|--------------|---------------|----------|
| **MTB-01 (1 btr)** | Tepung Terigu Cakra Kembar | gr | 110 | Bahan Baku |
| | Telur Bebek | butir | 1 | Bahan Baku |
| | Daging Sapi Giling | gr | 45 | Bahan Baku |
| | Daun Bawang | gr | 20 | Bahan Baku |
| | Bawang Bombay | gr | 12 | Bahan Baku |
| | Bumbu campuran | gr | 4 | Bahan Baku |
| | Minyak Goreng | ml | 35 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTB-02 (2 btr)** | Tepung Terigu Cakra Kembar | gr | 130 | Bahan Baku |
| | Telur Bebek | butir | 2 | Bahan Baku |
| | Daging Sapi Giling | gr | 90 | Bahan Baku |
| | Daun Bawang | gr | 40 | Bahan Baku |
| | Bawang Bombay | gr | 24 | Bahan Baku |
| | Bumbu campuran | gr | 8 | Bahan Baku |
| | Minyak Goreng | ml | 35 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTB-03 (3 btr)** | Tepung Terigu Cakra Kembar | gr | 150 | Bahan Baku |
| | Telur Bebek | butir | 3 | Bahan Baku |
| | Daging Sapi Giling | gr | 135 | Bahan Baku |
| | Daun Bawang | gr | 60 | Bahan Baku |
| | Bawang Bombay | gr | 36 | Bahan Baku |
| | Bumbu campuran | gr | 12 | Bahan Baku |
| | Minyak Goreng | ml | 40 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTB-04 (4 btr)** | Tepung Terigu Cakra Kembar | gr | 170 | Bahan Baku |
| | Telur Bebek | butir | 4 | Bahan Baku |
| | Daging Sapi Giling | gr | 180 | Bahan Baku |
| | Daun Bawang | gr | 80 | Bahan Baku |
| | Bawang Bombay | gr | 48 | Bahan Baku |
| | Bumbu campuran | gr | 16 | Bahan Baku |
| | Minyak Goreng | ml | 40 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTB-05 (5 btr)** | Tepung Terigu Cakra Kembar | gr | 190 | Bahan Baku |
| | Telur Bebek | butir | 5 | Bahan Baku |
| | Daging Sapi Giling | gr | 225 | Bahan Baku |
| | Daun Bawang | gr | 100 | Bahan Baku |
| | Bawang Bombay | gr | 60 | Bahan Baku |
| | Bumbu campuran | gr | 20 | Bahan Baku |
| | Minyak Goreng | ml | 45 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |
| **MTB-06 (6 btr)** | Tepung Terigu Cakra Kembar | gr | 210 | Bahan Baku |
| | Telur Bebek | butir | 6 | Bahan Baku |
| | Daging Sapi Giling | gr | 270 | Bahan Baku |
| | Daun Bawang | gr | 120 | Bahan Baku |
| | Bawang Bombay | gr | 72 | Bahan Baku |
| | Bumbu campuran | gr | 24 | Bahan Baku |
| | Minyak Goreng | ml | 50 | Bahan Baku |
| | Kemasan + Acar | set | 1 | Kemasan/Topping |

---

### 2C. BOM TERANG BULAN

**Bahan dasar adonan (sama untuk semua varian, per 1 loyang/porsi):**

| bahan | satuan_pakai | qty per porsi |
|-------|--------------|---------------|
| Tepung Terigu Segitiga Biru | gr | 150 |
| Telur Ayam | butir | 1 |
| Gula Pasir | gr | 40 |
| Ragi Instan | gr | 3 |
| Baking Powder/Soda Kue | gr | 2 |
| Susu Bubuk Full Cream | gr | 15 |
| Garam | gr | 2 |
| Vanili Bubuk | gr | 1 |
| Mentega/Margarin (olesan) | gr | 30 |
| Susu Kaleng Kental Manis (olesan dalam) | gr | 30 |
| Kotak Kemasan + Plastik + Karet | set | 1 |

**Tambahan spesifik per varian (di atas bahan dasar):**

| menu_code | bahan_spesifik | satuan | qty per porsi | catatan |
|-----------|----------------|--------|---------------|---------|
| **TB-01** (2 Variant Topping) | Topping pilihan #1 | porsi | 1 | dari daftar topping |
| | Topping pilihan #2 | porsi | 1 | dari daftar topping |
| **TB-02** (Milo + 1 Topping) | Milo Bubuk | gr | 25 | |
| | Topping pilihan | porsi | 1 | |
| **TB-03** (Oreo + 1 Topping) | Oreo (remah) | gr | 30 | ± 3 keping |
| | Topping pilihan | porsi | 1 | |
| **TB-04** (Nutella + 1 Topping) | Nutella / Cokelat Spread | gr | 40 | |
| | Topping pilihan | porsi | 1 | |
| **TB-05** (SilverQueen + 1 Topping) | Cokelat Batang SilverQueen | gr | 60 | ± ½ batang besar |
| | Topping pilihan | porsi | 1 | |

**Standar takaran per 1 "porsi topping" (untuk pemotongan stok):**

| topping | satuan | qty per porsi |
|---------|--------|---------------|
| Kacang (tumbuk) | gr | 25 |
| Meses / Ceres | gr | 30 |
| Keju Cheddar (parut) | gr | 30 |
| Pisang | gr | 60 |
| Melon | gr | 50 |
| Strawberry (selai) | gr | 30 |
| Selai Coklat | gr | 30 |
| Nanas (selai) | gr | 30 |
| Vanilla (pasta/selai) | gr | 20 |
| Blueberry (selai) | gr | 30 |
| Tiramisu (selai/bubuk) | gr | 25 |
| Green Tea (bubuk) | gr | 20 |
| Kismis | gr | 25 |

**Add-on (ADD-TOP):** setiap topping tambahan = 1 "porsi topping" sesuai tabel di atas, harga jual +Rp 5.000.

---

## 📌 Cara Sistem Memakai BOM Ini
1. **Saat penjualan**: sistem ambil `menu_code` → kurangi stok tiap bahan di tabel `recipes` sesuai `qty per porsi` × jumlah terjual.
2. **Food Cost (HPP)** per menu = Σ ( qty bahan × harga beli satuan bahan ).
   - Harga beli bahan diambil dari `Daftar_Bahan_Baku_Martabak_dan_Terang_Bulan.md`.
3. **Margin / Food Cost %** = (HPP ÷ harga_jual) × 100%. Idealnya Food Cost martabak/terang bulan ≈ 30–40%.
4. **Topping pilihan** untuk Terang Bulan: pelanggan memilih, lalu sistem kurangi stok topping yang dipilih (bukan semua topping).
