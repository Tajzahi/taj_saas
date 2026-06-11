import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema';
import { tenants, categories, menuItems, toppings } from '../schema';
import { eq } from 'drizzle-orm';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

export async function seedTemplate(tenantId: string) {
  console.log('Seeding F&B template for tenant:', tenantId);

  // 1. Clean existing data for this tenant
  await db.delete(toppings).where(eq(toppings.tenantId, tenantId));
  await db.delete(menuItems).where(eq(menuItems.tenantId, tenantId));
  await db.delete(categories).where(eq(categories.tenantId, tenantId));

  // 2. Insert Categories
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

  // 3. Insert Toppings (universal for Terang Bulan)
  await db.insert(toppings).values([
    { tenantId, code: 'kacang', name: 'Kacang', isAvailable: true },
    { tenantId, code: 'keju', name: 'Keju', isAvailable: true },
    { tenantId, code: 'meses', name: 'Meses', isAvailable: true },
    { tenantId, code: 'pisang', name: 'Pisang', isAvailable: true },
    { tenantId, code: 'susu', name: 'Susu Kental Manis', isAvailable: true },
    { tenantId, code: 'wijen', name: 'Wijen', isAvailable: true },
    { tenantId, code: 'kismis', name: 'Kismis', isAvailable: true },
    { tenantId, code: 'oregan', name: 'Oreo', isAvailable: true },
  ]);
  console.log('Toppings inserted.');

  // 4. Insert Menu Items
  await db.insert(menuItems).values([
    // Martabak Telur Ayam
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - 2 Telur',
      slug: 'martabak-ayam-2-telur',
      description: 'Martabak telur ayam dengan 2 butir telur segar dan daun bawang melimpah.',
      price: '25000',
      isBestSeller: true,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - 3 Telur',
      slug: 'martabak-ayam-3-telur',
      description: 'Martabak telur ayam dengan 3 butir telur segar, lebih tebal dan lezat.',
      price: '35000',
      isBestSeller: false,
      isNew: true,
    },
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - Spesial 5 Telur',
      slug: 'martabak-ayam-5-telur',
      description: 'Porsi jumbo dengan 5 butir telur ayam, daging ayam melimpah ruah.',
      price: '50000',
      isBestSeller: true,
      isNew: false,
    },

    // Martabak Telur Bebek
    {
      tenantId,
      categoryId: catMartabakBebek[0].id,
      name: 'Martabak Telur Bebek - 2 Telur',
      slug: 'martabak-bebek-2-telur',
      description: 'Martabak telur bebek dengan rasa gurih khas telur bebek Surabaya.',
      price: '30000',
      isBestSeller: false,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catMartabakBebek[0].id,
      name: 'Martabak Telur Bebek - 3 Telur',
      slug: 'martabak-bebek-3-telur',
      description: 'Lebih tebal dan gurih dengan 3 butir telur bebek pilihan.',
      price: '40000',
      isBestSeller: true,
      isNew: false,
    },

    // Terang Bulan
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Coklat Meses',
      slug: 'terbul-coklat-meses',
      description: 'Terang bulan klasik dengan mentega premium dan meses coklat melimpah.',
      price: '20000',
      isBestSeller: true,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Keju Susu',
      slug: 'terbul-keju-susu',
      description: 'Terang bulan dengan parutan keju kraft tebal dan susu kental manis.',
      price: '25000',
      isBestSeller: true,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Spesial Campur (Coklat Keju Kacang Wijen)',
      slug: 'terbul-spesial-campur',
      description: 'Terang bulan dengan kombinasi topping coklat, keju, kacang tanah, dan wijen.',
      price: '30000',
      isBestSeller: true,
      isNew: false,
    },

    // Minuman
    {
      tenantId,
      categoryId: catMinuman[0].id,
      name: 'Es Teh Manis',
      slug: 'es-teh-manis',
      description: 'Teh wangi melati disajikan dingin segar.',
      price: '5000',
      isBestSeller: false,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catMinuman[0].id,
      name: 'Es Jeruk Peras',
      slug: 'es-jeruk-peras',
      description: 'Jeruk peras murni dengan es batu segar.',
      price: '7000',
      isBestSeller: false,
      isNew: false,
    },
  ]);

  console.log('Menu items inserted.');
  console.log('Seed template completed successfully!');
}

// Default run execution for a default tenant
async function run() {
  // Let's check if we have a default tenant "a6-nyuss" to seed
  const defaultSlug = 'a6-nyuss';
  
  // Find or create default tenant
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

if (require.main === module) {
  run().catch((err) => {
    console.error('Seed script failed:', err);
    process.exit(1);
  });
}
