export type MenuCategory = 'martabak-telur-ayam' | 'martabak-telur-bebek' | 'terang-bulan' | 'paket-bundling' | 'minuman';

export interface MenuVariant {
  id: string;
  name: string;
  priceModifier: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: MenuCategory;
  categoryLabel: string;
  price: number;
  image: string;
  badge?: 'terlaris' | 'baru' | 'habis';
  description: string;
  variants?: {
    label: string;
    required: boolean;
    options: MenuVariant[];
  }[];
  relatedSlugs?: string[];
}

export const categories: { id: MenuCategory; label: string; icon: string }[] = [
  { id: 'martabak-telur-ayam', label: 'Martabak Telur Ayam', icon: '🥚' },
  { id: 'martabak-telur-bebek', label: 'Martabak Telur Bebek', icon: '🦆' },
  { id: 'terang-bulan', label: 'Terang Bulan', icon: '🌙' },
  // { id: 'paket-bundling', label: 'Paket Bundling', icon: '📦' },
  // { id: 'minuman', label: 'Minuman', icon: '🥤' },
];

export const toppingOptions: MenuVariant[] = [
  { id: 'kacang', name: 'Kacang', priceModifier: 0 },
  { id: 'meses', name: 'Meses', priceModifier: 0 },
  { id: 'keju', name: 'Keju', priceModifier: 0 },
  { id: 'pisang', name: 'Pisang', priceModifier: 0 },
  { id: 'melon', name: 'Melon', priceModifier: 0 },
  { id: 'strawberry', name: 'Strawberry', priceModifier: 0 },
  { id: 'selai-coklat', name: 'Selai Coklat', priceModifier: 0 },
  { id: 'nanas', name: 'Nanas', priceModifier: 0 },
  { id: 'vanilla', name: 'Vanilla', priceModifier: 0 },
  { id: 'blueberry', name: 'Blueberry', priceModifier: 0 },
  { id: 'tiramisu', name: 'Tiramisu', priceModifier: 0 },
  { id: 'green-tea', name: 'Green Tea', priceModifier: 0 },
  { id: 'kismis', name: 'Kismis', priceModifier: 0 },
];

export const extraToppingOptions: MenuVariant[] = [
  { id: 'none', name: 'Tanpa Tambahan', priceModifier: 0 },
  { id: 'extra-kacang', name: 'Extra Kacang (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-meses', name: 'Extra Meses (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-keju', name: 'Extra Keju (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-pisang', name: 'Extra Pisang (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-melon', name: 'Extra Melon (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-strawberry', name: 'Extra Strawberry (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-selai-coklat', name: 'Extra Selai Coklat (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-nanas', name: 'Extra Nanas (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-vanilla', name: 'Extra Vanilla (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-blueberry', name: 'Extra Blueberry (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-tiramisu', name: 'Extra Tiramisu (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-green-tea', name: 'Extra Green Tea (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-kismis', name: 'Extra Kismis (+Rp 5.000)', priceModifier: 5000 },
];
export const menuItems: MenuItem[] = [
  // ===== MARTABAK TELUR AYAM =====
  {
    id: 'mta-2-20',
    slug: 'martabak-telur-ayam-1-telur-20k',
    name: 'Martabak Telur Ayam - 1 Telur (Rp 20.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 1 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-25k', 'martabak-telur-bebek-2-telur-20k'],
  },
  {
    id: 'mta-2-25',
    slug: 'martabak-telur-ayam-2-telur-25k',
    name: 'Martabak Telur Ayam - 2 Telur (Rp 25.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal and 2 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-1-telur-20k', 'martabak-telur-ayam-2-telur-30k'],
  },
  {
    id: 'mta-2-30',
    slug: 'martabak-telur-ayam-2-telur-30k',
    name: 'Martabak Telur Ayam - 2 Telur (Rp 30.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 2 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-25k', 'martabak-telur-ayam-3-telur-35k'],
  },
  {
    id: 'mta-2-35',
    slug: 'martabak-telur-ayam-3-telur-35k',
    name: 'Martabak Telur Ayam - 3 Telur (Rp 35.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    badge: 'baru',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 3 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-30k', 'martabak-telur-bebek-2-telur-50k'],
  },
  {
    id: 'mta-3-40',
    slug: 'martabak-telur-ayam-3-telur-40k',
    name: 'Martabak Telur Ayam - 3 Telur (Rp 40.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 3 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-45k', 'martabak-telur-bebek-3-telur-60k'],
  },
  {
    id: 'mta-3-45',
    slug: 'martabak-telur-ayam-4-telur-45k',
    name: 'Martabak Telur Ayam - 4 Telur (Rp 45.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal dan 4 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-3-telur-40k', 'martabak-telur-ayam-4-telur-50k'],
  },
  {
    id: 'mta-3-50',
    slug: 'martabak-telur-ayam-4-telur-50k',
    name: 'Martabak Telur Ayam - 4 Telur (Rp 50.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 4 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-45k', 'martabak-telur-ayam-5-telur-55k'],
  },
  {
    id: 'mta-3-55',
    slug: 'martabak-telur-ayam-5-telur-55k',
    name: 'Martabak Telur Ayam - 5 Telur (Rp 55.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 5 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-50k', 'martabak-telur-bebek-3-telur-90k'],
  },
  {
    id: 'mta-4-60',
    slug: 'martabak-telur-ayam-5-telur-60k',
    name: 'Martabak Telur Ayam - 5 Telur (Rp 60.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 5 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-65k', 'martabak-telur-bebek-3-telur-60k'],
  },
  {
    id: 'mta-4-65',
    slug: 'martabak-telur-ayam-6-telur-65k',
    name: 'Martabak Telur Ayam - 6 Telur (Rp 65.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal dan 6 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-5-telur-60k', 'martabak-telur-ayam-6-telur-70k'],
  },
  {
    id: 'mta-4-70',
    slug: 'martabak-telur-ayam-6-telur-70k',
    name: 'Martabak Telur Ayam - 6 Telur (Rp 70.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 6 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-65k', 'martabak-telur-ayam-7-telur-75k'],
  },
  {
    id: 'mta-4-75',
    slug: 'martabak-telur-ayam-7-telur-75k',
    name: 'Martabak Telur Ayam - 7 Telur (Rp 75.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 7 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-70k', 'martabak-telur-bebek-2-telur-40k'],
  },
  // ===== MARTABAK TELUR BEBEK =====
  {
    id: 'mtb-1-20',
    slug: 'martabak-telur-bebek-1-telur-20k',
    name: 'Martabak Telur Bebek - 1 Telur (Rp 20.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek gurih dengan isian 1 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-2-telur-40k', 'martabak-telur-ayam-1-telur-20k'],
  },
  {
    id: 'mtb-2-40',
    slug: 'martabak-telur-bebek-2-telur-40k',
    name: 'Martabak Telur Bebek - 2 Telur (Rp 40.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek dengan porsi 2 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-1-telur-20k', 'martabak-telur-bebek-3-telur-50k'],
  },
  {
    id: 'mtb-3-50',
    slug: 'martabak-telur-bebek-3-telur-50k',
    name: 'Martabak Telur Bebek - 3 Telur (Rp 50.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Martabak telur bebek dengan porsi 3 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-2-telur-40k', 'martabak-telur-bebek-4-telur-60k'],
  },
  {
    id: 'mtb-4-60',
    slug: 'martabak-telur-bebek-4-telur-60k',
    name: 'Martabak Telur Bebek - 4 Telur (Rp 60.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek gurih dengan isian 4 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-3-telur-50k', 'martabak-telur-bebek-5-telur-70k'],
  },
  {
    id: 'mtb-5-70',
    slug: 'martabak-telur-bebek-5-telur-70k',
    name: 'Martabak Telur Bebek - 5 Telur (Rp 70.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek dengan racikan bumbu khas dan 5 butir telur.',
    relatedSlugs: ['martabak-telur-bebek-4-telur-60k', 'martabak-telur-bebek-6-telur-80k'],
  },
  {
    id: 'mtb-6-80',
    slug: 'martabak-telur-bebek-6-telur-80k',
    name: 'Martabak Telur Bebek - 6 Telur (Rp 80.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek porsi puncak dengan 6 butir telur bebek premium.',
    relatedSlugs: ['martabak-telur-bebek-5-telur-70k', 'martabak-telur-ayam-6-telur-70k'],
  },

  // ===== MENU TERANG BULAN =====
  {
    id: 'tb-2-topping',
    slug: 'terang-bulan-2-variant-topping',
    name: 'Terang Bulan 2 Variant Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Terang bulan lembut khas A6 Nyuss dengan bebas kombinasi 2 pilihan topping.',
    variants: [
      {
        label: 'Pilihan Topping 1',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Pilihan Topping 2',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Topping Tambahan',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-milo-1-topping', 'terang-bulan-oreo-1-topping'],
  },
  {
    id: 'tb-milo',
    slug: 'terang-bulan-milo-1-topping',
    name: 'Terang Bulan Milo + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    description: 'Taburan bubuk cokelat Milo melimpah ditambah bebas memilih 1 topping pelengkap.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-2-variant-topping', 'terang-bulan-oreo-1-topping'],
  },
  {
    id: 'tb-oreo',
    slug: 'terang-bulan-oreo-1-topping',
    name: 'Terang Bulan Oreo + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
    description: 'Taburan remahan biskuit Oreo renyah melimpah ditambah bebas memilih 1 topping pilihan.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-2-variant-topping', 'terang-bulan-milo-1-topping'],
  },
  {
    id: 'tb-nutella',
    slug: 'terang-bulan-nutella-1-topping',
    name: 'Terang Bulan Nutella + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Olesan selai cokelat hazelnut Nutella premium ditambah 1 topping pelengkap pilihan.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-silverqueen-1-topping', 'terang-bulan-2-variant-topping'],
  },
  {
    id: 'tb-silverqueen',
    slug: 'terang-bulan-silverqueen-1-topping',
    name: 'Terang Bulan SilverQueen + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    badge: 'baru',
    description: 'Potongan mewah cokelat SilverQueen premium melimpah ditambah 1 topping pilihan bebas.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-nutella-1-topping', 'terang-bulan-2-variant-topping'],
  },

  /*
  // ===== PAKET BUNDLING =====
  {
    id: 'bundling-1',
    slug: 'paket-hemat-1',
    name: 'Paket Hemat 1 (Terbul + Telur)',
    category: 'paket-bundling',
    categoryLabel: 'Paket Bundling',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    badge: 'baru',
    description: '1 Box Terang Bulan pilihan + 1 Box Martabak Telur Ayam. Hemat 15% dari harga normal!',
    relatedSlugs: ['paket-hemat-2'],
  },
  {
    id: 'bundling-2',
    slug: 'paket-hemat-2',
    name: 'Paket Hemat 2 (Terbul Combo)',
    category: 'paket-bundling',
    categoryLabel: 'Paket Bundling',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
    description: '2 Box Terang Bulan dengan topping pilihan berbeda. Combo paling populer!',
    relatedSlugs: ['paket-hemat-1'],
  },

  // ===== MINUMAN =====
  {
    id: 'drink-teh',
    slug: 'es-teh-manis',
    name: 'Es Teh Manis',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Es teh manis segar pelepas dahaga yang sangat pas menemani martabak hangat.',
    relatedSlugs: ['es-jeruk', 'air-mineral'],
  },
  {
    id: 'drink-jeruk',
    slug: 'es-jeruk',
    name: 'Es Jeruk',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    description: 'Perasan jeruk asli segar, manis dan menyegarkan.',
    relatedSlugs: ['es-teh-manis', 'air-mineral'],
  },
  {
    id: 'drink-mineral',
    slug: 'air-mineral',
    name: 'Air Mineral',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop',
    description: 'Air mineral kemasan botol 600ml steril dan segar.',
    relatedSlugs: ['es-teh-manis', 'es-jeruk'],
  },
  */
];

export const popularMenuSlugs = ['terang-bulan-2-variant-topping', 'martabak-telur-ayam-2-telur-25k', 'martabak-telur-bebek-2-telur-40k', 'terang-bulan-silverqueen-1-topping'];

export function getMenuBySlug(slug: string): MenuItem | undefined {
  return menuItems.find((item) => item.slug === slug);
}

export function getMenuByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function getRelatedMenus(slugs: string[]): MenuItem[] {
  return slugs.map((slug) => menuItems.find((item) => item.slug === slug)).filter(Boolean) as MenuItem[];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}
