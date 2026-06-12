import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema';
import { tenants, categories, menuItems, toppings, branches, inventory, recipes, recipeIngredients } from '../schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Robust manual .env parser to load the root .env
try {
  const envPath = path.resolve(__dirname, '../../../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        // Remove quotes if present
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn('Failed to load root .env file:', e);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

// Toppings option list for jsonb field
const toppingOptions = [
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

const extraToppingOptions = [
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

export async function seedTemplate(tenantId: string) {
  console.log('Seeding F&B template for tenant:', tenantId);

  // 1. Clean existing data for this tenant
  await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeIngredients.recipeId)); // simple delete all
  await db.delete(recipes).where(eq(recipes.tenantId, tenantId));
  await db.delete(inventory).where(eq(inventory.tenantId, tenantId));
  await db.delete(branches).where(eq(branches.tenantId, tenantId));
  await db.delete(toppings).where(eq(toppings.tenantId, tenantId));
  await db.delete(menuItems).where(eq(menuItems.tenantId, tenantId));
  await db.delete(categories).where(eq(categories.tenantId, tenantId));

  // 2. Insert Branches
  const bBSD = await db.insert(branches).values({
    tenantId,
    name: 'BSD',
    city: 'Tangerang',
    address: 'Ruko BSD Blok A No. 12',
    phone: '628111222333',
    picName: 'Andi BSD',
    status: 'active',
  }).returning();

  const bKemang = await db.insert(branches).values({
    tenantId,
    name: 'Kemang',
    city: 'Jakarta Selatan',
    address: 'Jl. Kemang Raya No. 45',
    phone: '628111222444',
    picName: 'Budi Kemang',
    status: 'active',
  }).returning();

  const bDepok = await db.insert(branches).values({
    tenantId,
    name: 'Depok',
    city: 'Depok',
    address: 'Jl. Margonda Raya No. 101',
    phone: '628111222555',
    picName: 'Chandra Depok',
    status: 'active',
  }).returning();

  console.log('Branches inserted.');

  // 3. Insert Categories
  const catMartabakAyam = await db.insert(categories).values({
    tenantId,
    name: 'Martabak Telur Ayam',
    slug: 'martabak-telur-ayam',
    sortOrder: 1,
  }).returning();

  const catMartabakBebek = await db.insert(categories).values({
    tenantId,
    name: 'Martabak Telur Bebek',
    slug: 'martabak-telur-bebek',
    sortOrder: 2,
  }).returning();

  const catTerangBulan = await db.insert(categories).values({
    tenantId,
    name: 'Terang Bulan',
    slug: 'terang-bulan',
    sortOrder: 3,
  }).returning();

  const catMinuman = await db.insert(categories).values({
    tenantId,
    name: 'Minuman',
    slug: 'minuman',
    sortOrder: 4,
  }).returning();

  console.log('Categories inserted.');

  // 4. Insert Toppings
  await db.insert(toppings).values([
    { tenantId, code: 'kacang', name: 'Kacang', isAvailable: true },
    { tenantId, code: 'keju', name: 'Keju', isAvailable: true },
    { tenantId, code: 'meses', name: 'Meses', isAvailable: true },
    { tenantId, code: 'pisang', name: 'Pisang', isAvailable: true },
    { tenantId, code: 'susu', name: 'Susu Kental Manis', isAvailable: true },
    { tenantId, code: 'wijen', name: 'Wijen', isAvailable: true },
    { tenantId, code: 'kismis', name: 'Kismis', isAvailable: true },
    { tenantId, code: 'oreo', name: 'Oreo', isAvailable: true },
  ]);
  console.log('Toppings inserted.');

  // 5. Insert Inventory items
  const invAdonan = await db.insert(inventory).values({
    tenantId,
    branchId: bBSD[0].id,
    name: 'Adonan Martabak',
    category: 'Bahan Baku',
    stock: '50.00',
    minStock: '10.00',
    unit: 'kg',
    cost: '12000',
    supplier: 'Supplier Terigu Utama',
  }).returning();

  const invTelur = await db.insert(inventory).values({
    tenantId,
    branchId: bBSD[0].id,
    name: 'Telur Ayam',
    category: 'Bahan Baku',
    stock: '300.00',
    minStock: '50.00',
    unit: 'butir',
    cost: '2200',
    supplier: 'Toko Telur Sejahtera',
  }).returning();

  console.log('Inventory inserted.');

  // 6. Insert Menu Items (including Terang Bulan variants matching customer app exactly)
  const items = await db.insert(menuItems).values([
    // Martabak Telur Ayam
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - 1 Telur',
      slug: 'martabak-telur-ayam-1-telur-20k',
      description: 'Martabak gurih dengan isian daging ayam cincang dan 1 butir telur ayam.',
      price: '20000',
      isBestSeller: false,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    },
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - 2 Telur',
      slug: 'martabak-telur-ayam-2-telur-25k',
      description: 'Martabak telur ayam dengan isian daging ayam lebih tebal and 2 butir telur.',
      price: '25000',
      isBestSeller: true,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    },
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - Spesial 3 Telur',
      slug: 'martabak-telur-ayam-2-telur-30k',
      description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 3 butir telur.',
      price: '30000',
      isBestSeller: false,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    },
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - Istimewa 3 Telur',
      slug: 'martabak-telur-ayam-3-telur-35k',
      description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 3 butir telur.',
      price: '35000',
      isBestSeller: false,
      isNew: true,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    },

    // Martabak Telur Bebek
    {
      tenantId,
      categoryId: catMartabakBebek[0].id,
      name: 'Martabak Telur Bebek - 1 Telur',
      slug: 'martabak-telur-bebek-1-telur-20k',
      description: 'Martabak telur bebek gurih dengan isian 1 butir telur bebek berkualitas.',
      price: '20000',
      isBestSeller: false,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    },
    {
      tenantId,
      categoryId: catMartabakBebek[0].id,
      name: 'Martabak Telur Bebek - 2 Telur',
      slug: 'martabak-telur-bebek-2-telur-40k',
      description: 'Martabak telur bebek dengan porsi 2 butir telur bebek berkualitas.',
      price: '40000',
      isBestSeller: false,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    },
    {
      tenantId,
      categoryId: catMartabakBebek[0].id,
      name: 'Martabak Telur Bebek - 3 Telur',
      slug: 'martabak-telur-bebek-3-telur-50k',
      description: 'Martabak telur bebek dengan porsi 3 butir telur bebek berkualitas.',
      price: '50000',
      isBestSeller: true,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    },

    // Terang Bulan (With Variants)
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan 2 Variant Topping',
      slug: 'terang-bulan-2-variant-topping',
      description: 'Terang bulan lembut khas A6 Nyuss dengan bebas kombinasi 2 pilihan topping.',
      price: '20000',
      isBestSeller: true,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
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
    },
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Milo + 1 Topping',
      slug: 'terang-bulan-milo-1-topping',
      description: 'Taburan bubuk cokelat Milo melimpah ditambah bebas memilih 1 topping pelengkap.',
      price: '25000',
      isBestSeller: false,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
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
    },
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Oreo + 1 Topping',
      slug: 'terang-bulan-oreo-1-topping',
      description: 'Taburan remahan biskuit Oreo renyah melimpah ditambah bebas memilih 1 topping pilihan.',
      price: '25000',
      isBestSeller: false,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
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
    },
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Nutella + 1 Topping',
      slug: 'terang-bulan-nutella-1-topping',
      description: 'Olesan selai cokelat hazelnut Nutella premium ditambah 1 topping pelengkap pilihan.',
      price: '30000',
      isBestSeller: true,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
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
    },
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan SilverQueen + 1 Topping',
      slug: 'terang-bulan-silverqueen-1-topping',
      description: 'Potongan mewah cokelat SilverQueen premium melimpah ditambah 1 topping pilihan bebas.',
      price: '50000',
      isBestSeller: false,
      isNew: true,
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
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
    },

    // Minuman
    {
      tenantId,
      categoryId: catMinuman[0].id,
      name: 'Es Teh Manis',
      slug: 'es-teh-manis',
      description: 'Air mineral es teh manis segar penutup dahaga.',
      price: '5000',
      isBestSeller: false,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    },
    {
      tenantId,
      categoryId: catMinuman[0].id,
      name: 'Es Jeruk Peras',
      slug: 'es-jeruk-peras',
      description: 'Perasan jeruk segar asli.',
      price: '7000',
      isBestSeller: false,
      isNew: false,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    },
  ]).returning();

  console.log('Menu items inserted.');

  // 7. Seed Recipes & Ingredients
  const mta2Telur = items.find(i => i.slug === 'martabak-telur-ayam-2-telur-25k');
  if (mta2Telur) {
    const recMta = await db.insert(recipes).values({
      tenantId,
      menuItemId: mta2Telur.id,
      name: 'Resep Martabak Ayam 2 Telur',
    }).returning();

    await db.insert(recipeIngredients).values([
      {
        recipeId: recMta[0].id,
        ingredientName: 'Adonan Martabak',
        quantity: '0.15',
        unit: 'kg',
        costPerUnit: '12000',
      },
      {
        recipeId: recMta[0].id,
        ingredientName: 'Telur Ayam',
        quantity: '2.00',
        unit: 'butir',
        costPerUnit: '2200',
      },
    ]);
  }

  console.log('Recipes seeded.');
  console.log('Seed template completed successfully!');
}

async function run() {
  const defaultSlug = 'a6-nyuss';
  
  let tenant = await db.select().from(tenants).where(eq(tenants.slug, defaultSlug)).limit(1);
  let tenantId: string;
  
  if (tenant.length === 0) {
    console.log('Default tenant not found, creating one...');
    const inserted = await db.insert(tenants).values({
      name: 'Martabak Terbul A6 Nyuss',
      slug: defaultSlug,
      domain: 'a6nyuss.com',
      adminSubdomain: 'admin.a6nyuss.com',
      ownerSubdomain: 'owner.a6nyuss.com',
      branding: {
        primaryColor: '#8E0E0E',
        secondaryColor: '#E05009',
        businessName: 'Martabak Terbul A6 Nyuss',
        whatsappNumber: '6287811123482',
        flatDeliveryFee: 10000,
        minimumOrderAmount: 0,
        storeAddress: 'Jl. Demak No.253, Dupak, Krembangan, Surabaya',
        googleMapsUrl: '',
        openingHours: 'Setiap Hari: 17:00 – 01:00'
      },
      packageType: 'startup',
      isActive: true,
    }).returning();
    tenantId = inserted[0].id;
    console.log('Default tenant created:', tenantId);
  } else {
    tenantId = tenant[0].id;
    console.log('Default tenant already exists:', tenantId);
  }

  await seedTemplate(tenantId);
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
